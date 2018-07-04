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
    includeSentry: boolean | {
        debug?: boolean
        release?: string
    }
    environmentVariables: { [key: string]: any }
    useBabelCache: boolean
    cacheDirectory?: string
    extractI18nMessages: false | string
    useThreadedLoaders: boolean,
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
    },
    outputStats?: false | string
    stats?: boolean | 'errors-only' | 'minimal' | 'none' | 'normal' | 'verbose' | Partial<{
        // Add asset Information
        assets: boolean

        // Sort assets by a field
        // You can reverse the sort with `!field`.
        assetsSort: string

        // Add information about cached (not built) modules
        cached: boolean

        // Show cached assets (setting this to `false` only shows emitted files)
        cachedAssets: boolean

        // Add children information
        children: boolean

        // Add chunk information (setting this to `false` allows for a less verbose output)
        chunks: boolean

        // Add built modules information to chunk information
        chunkModules: boolean

        // Add the origins of chunks and chunk merging info
        chunkOrigins: boolean

        // Sort the chunks by a field
        // You can reverse the sort with `!field`. Default is `id`.
        chunksSort: string

        // `webpack --colors` equivalent
        colors: boolean

        // Display the distance from the entry point for each module
        depth: boolean // | number -- probably a bug in the webpack ambient ts definition

        // Display the entry points with the corresponding bundles
        entrypoints: boolean

        // Add --env information
        env: boolean

        // Add errors
        errors: boolean

        // Add details to errors (like resolving log)
        errorDetails: boolean

        // Add the hash of the compilation
        hash: boolean

        // Set the maximum number of modules to be shown
        maxModules: number

        // Add built modules information
        modules: boolean

        // Sort the modules by a field
        // You can reverse the sort with `!field`. Default is `id`.
        modulesSort: string

        // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
        moduleTrace: boolean

        // Show performance hint when file size exceeds `performance.maxAssetSize`
        performance: boolean

        // Show the exports of the modules
        providedExports: boolean

        // Add public path information
        publicPath: boolean

        // Add information about the reasons why modules are included
        reasons: boolean

        // Add the source code of modules
        source: boolean

        // Add timing information
        timings: boolean

        // Show which exports of a module are used
        usedExports: boolean

        // Add webpack version information
        version: boolean

        // Add warnings
        warnings: boolean
    }>
}
