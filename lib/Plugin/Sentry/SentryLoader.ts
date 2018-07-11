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

import { loader } from 'webpack'
import { RawSourceMap } from 'uglify-js/node_modules/source-map'

const loader: loader.Loader = function sentryLoader(
    this: loader.LoaderContext,
    _: string | Buffer | void | undefined,
    sourceMap: RawSourceMap | undefined
)
{
    const callback = this.async()
    if (! callback) {
        return
    }

    if (! ('release' in this.query) || ! (this.query.release instanceof Promise)) {
        throw new Error('Unable to inject SentryReleaseId because no release promise was given')
    }

    const release: Promise<string> = this.query.release

    release.then(release => {
        callback(null, `global.SENTRY_RELEASE={id:"${release}"}`, sourceMap)
    })
}

export default loader
