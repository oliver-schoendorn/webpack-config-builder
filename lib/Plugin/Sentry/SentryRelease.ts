/*
 * Copyright (c) 2018 Oliver Schöndorn
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import SentryHelper from './SentryHelper'
import GitHelper from './GitHelper'
import { performance } from 'perf_hooks'
import { SentryPluginOptions } from './SentryPlugin'

interface GitDetails
{
    repository: string
    version: string
    commitHash: string
}

export default class SentryRelease
{
    private readonly sentryHelper: SentryHelper
    private readonly gitHelper: GitHelper
    private readonly started: number
    private readonly gitDetails: Promise<GitDetails>

    public constructor(sentryHelper: SentryHelper, gitHelper: GitHelper)
    {
        this.sentryHelper = sentryHelper
        this.gitHelper = gitHelper
        this.started = performance.now()
        this.gitDetails = this.gatherGitDetails()
    }

    private gatherGitDetails = (): Promise<GitDetails> =>
    {
        const { gitHelper } = this
        return Promise.all([
            gitHelper.getCurrentRepository(),
            gitHelper.getCurrentVersion(),
            gitHelper.getCurrentHash()
        ]).then(response => ({
            repository: response[0],
            version: response[1],
            commitHash: response[2]
        }))
    }

    public create(): Promise<string>
    {
        return this.gitDetails.then(gitDetails => {
            return this.sentryHelper.create(
                gitDetails.version,
                gitDetails.repository,
                gitDetails.commitHash
            ).then(() => gitDetails.version)
        })
    }

    public finalize(options: SentryPluginOptions): Promise<string>
    {
        const { sentryHelper } = this
        return this.gitDetails.then(gitDetails => {
            return sentryHelper.uploadSourceMaps(
                    gitDetails.version,
                    options.uploadSource,
                    options.pathPrefix,
                    options.stripPathPrefix,
                    options.ignore,
                    options.ignoreFiles,
                    options.additionalExtensions,
                    options.rewriteSourceMaps,
                    options.validateSourceMaps
                )
                .then(() => sentryHelper.deploy(
                    gitDetails.version,
                    options.environment,
                    Math.round(performance.now()-this.started)
                ))
                .then(() => sentryHelper.finalize(gitDetails.version))
                .then(() => gitDetails.version)
                .catch(this.exceptionHandler(gitDetails.version))
            })
    }

    private exceptionHandler = (release: string) => (error: Error) => {
        console.error('Fatal error during sentry release', error)
        return this.sentryHelper.delete(release)
    }
}