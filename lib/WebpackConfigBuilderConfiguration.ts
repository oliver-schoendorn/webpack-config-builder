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

import { Options } from 'webpack'

export default interface BuilderConfiguration
{
    sourceMaps: Options.Devtool
    target: 'development' | 'production'
    extensions: string[]
    alias: { [key: string]: string }
    useWebpackDevServer: false | {
        contentBase: string,
        inline?: boolean,
        historyApiFallback?: boolean,
        stats?: {
            colors: boolean,
            chunks: boolean
        }
    }
    hotModuleReplacement: boolean
    hashOutputFileNames: boolean
    extractStyles: boolean
    minimizeStyles: boolean
    minimizeJs: boolean
    includeSentry: boolean
    environmentVariables: { [key: string]: any }
    useBabelCache: boolean
    cacheDirectory?: string
    extractI18nMessages: false | string
    useThreadedLoaders: false | {
        workerCount: number
    },
    analyzeBundle: false | {
        mode: 'server'
        port: number,
        open?: boolean
    } | {
        mode: 'static'
        file: string,
        open?: boolean
    },
    html: false | {
        filename?: string
        template: string
    },
    output: {
        path: string,
        publicPath: string
    }
}
