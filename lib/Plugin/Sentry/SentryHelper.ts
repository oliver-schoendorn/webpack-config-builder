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

import SentryCli from '@sentry/cli'

export default class SentryHelper
{
    private readonly cli: SentryCli
    private live: boolean = true

    public constructor()
    {
        this.cli = new SentryCli()
    }

    public create(release: string, repository: string, commitHash: string): Promise<string>
    {
        return this.execute(`releases new ${release}`)
            .then(() => this.execute(
                `releases set-commits ${release} --commit ${repository}@${commitHash}`
            ))
    }

    public delete(release: string): Promise<string>
    {
        return this.execute(`releases delete ${release}`)
    }

    public uploadSourceMaps(
        release: string,
        source: string,
        pathPrefix: string,
        stripPathPrefix: string,
        ignore: string[],
        ignoreFiles: string[],
        additionalExtensions: string[],
        rewriteSourceMaps: boolean,
        validateSourceMaps: boolean
    ): Promise<string>
    {
        return this.execute(`releases files ${release} upload-sourcemaps ${source}`, {
            '--url-prefix': pathPrefix,
            '--strip-prefix': stripPathPrefix,
            '--ignore': ignore,
            '--ignore-file': ignoreFiles,
            '--ext': additionalExtensions,
            '--rewrite': rewriteSourceMaps,
            '--validate': validateSourceMaps
        })
    }

    public finalize(release: string): Promise<string>
    {
        return this.execute(`releases finalize ${release}`)
    }

    public deploy(release: string, environment: string, timeElapsed: number): Promise<string>
    {
        return this.execute(`releases deploys ${release} new -e ${environment} -t ${timeElapsed*1000}`)
    }

    private execute(args: string, parameters: { [key: string]: boolean | string | string[] } = {}): Promise<string>
    {
        const parsedParameters = this.parseParameters(parameters)
        console.log(`SentryHelper::execute("${args.split(' ').concat(parsedParameters).join(' ')}", true)`)
        return this.cli.execute(args.split(' ').concat(parsedParameters), this.live)
    }

    private parseParameters(parameters: { [key: string]: boolean | string | string[] }): string[]
    {
        const response: string[] = []
        Object.keys(parameters)
            .map(parameterKey => {
                const parameterValue = parameters[parameterKey]
                const parsedValues = this.parseParameter(parameterKey, parameterValue)
                if (parsedValues) {
                    parsedValues.map(parsedValue => response.push(parsedValue))
                }
            })

        return response
    }

    private parseParameter(parameterKey: string, parameterValue: string | string[] | boolean): string[] | null
    {
        if (parameterValue instanceof Array && parameterValue.length > 0) {
            return parameterValue.map(value => `${parameterKey}=${value}`)
        }

        if (typeof parameterValue === 'string' && parameterValue !== '') {
            return [ `${parameterKey}=${parameterValue}` ]
        }

        if (parameterValue === true) {
            return [ `${parameterKey}` ]
        }

        return null
    }
}
