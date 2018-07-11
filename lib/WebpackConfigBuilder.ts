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

import SentryPlugin from './Plugin/Sentry/SentryPlugin'
import BuilderConfiguration from './WebpackConfigBuilderConfiguration'
import {
    Configuration,
    DefinePlugin,
    Entry as WebpackEntry,
    HotModuleReplacementPlugin,
    NamedModulesPlugin,
    Plugin,
    RuleSetRule
} from 'webpack'
import Entry from './Entry'
import HappyPackLoaderModule from './LoaderModule/HappyPackLoaderModule'
import AbstractLoaderModule from './LoaderModule/AbstractLoaderModule'
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const babelPresetMinify = require('babel-preset-minify')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin

class WebpackConfigBuilder
{
    public static readonly defaultOptions: BuilderConfiguration = {
        target: 'development',
        extensions: [ '*', '.d.ts', '.ts', '.tsx', '.js', '.jsx' ],
        alias: {},
        sourceMaps: false,
        useWebpackDevServer: false,
        hotModuleReplacement: false,
        hashOutputFileNames: false,
        extractStyles: false,
        minimizeStyles: false,
        minimizeJs: false,
        includeSentry: false,
        environmentVariables: {},
        useBabelCache: true,
        cacheDirectory: undefined,
        extractI18nMessages: false,
        useThreadedLoaders: false,
        analyzeBundle: false,
        html: false,
        output: {
            path: './dist/',
            publicPath: '/'
        },
        stats: {
            assets: true,
            cached: true,
            cachedAssets: true,
            children: false,
            chunks: true,
            chunkModules: false,
            chunkOrigins: false,
            colors: true,
            depth: false,
            entrypoints: true,
            env: true,
            errors: true,
            errorDetails: true,
            hash: true,
            modules: false,
            moduleTrace: false,
            performance: true,
            providedExports: false,
            publicPath: true,
            reasons: true,
            source: true,
            timings: true,
            usedExports: false,
            version: true,
            warnings: true
        }
    }

    protected options: BuilderConfiguration
    protected entries: Entry[] = []
    protected loaderModules: AbstractLoaderModule[] = []
    protected plugins: Plugin[] = []

    protected happyPackLoaders: HappyPackLoaderModule[] = []

    public constructor(options?: Partial<BuilderConfiguration>)
    {
        this.options = Object.assign({}, WebpackConfigBuilder.defaultOptions, options)
    }

    public addEntry = (entry: Entry): this =>
    {
        this.entries.push(entry)
        return this
    }

    public addLoaderModule = (loader: AbstractLoaderModule): this =>
    {
        this.loaderModules.push(loader)
        return this
    }

    public addPlugin = (plugin: Plugin): this =>
    {
        this.plugins.push(plugin)
        return this
    }

    public make(): Configuration
    {
        const { extensions, alias, sourceMaps, useWebpackDevServer, hotModuleReplacement, output, hashOutputFileNames } = this.options

        const config: Configuration = {
            entry: this.makeEntries(),
            resolve: {
                extensions: extensions,
                alias: alias
            },
            module: {
                rules: this.makeModules()
            },
            plugins: this.makePlugins(),
            devtool: sourceMaps,
            output: {
                filename: (hashOutputFileNames ? '[hash]/' : '') + 'bundle.[name].js',
                chunkFilename: (hashOutputFileNames ? '[hash]/' : '') + 'chunk.[name].js',
                ...output
            },
            stats: this.options.stats
        }

        if (useWebpackDevServer) {
            config.devServer = {
                hot: hotModuleReplacement !== false,
                ...useWebpackDevServer
            }
        }

        return (new SpeedMeasurePlugin()).wrap(config)
    }

    private makeEntries(): WebpackEntry
    {
        return Object.assign({}, ...this.entries.map(entry => {
            if (this.options.hotModuleReplacement && entry.hotReplacementCapable) {
                entry.prepend('react-hot-loader/patch', 'prepend')
            }

            return entry.make()
        }))
    }

    private makeModules(): RuleSetRule[]
    {
        return this.loaderModules.map(loader => loader.make(this.options, this.addPlugin))
    }

    private makePlugins(): Plugin[]
    {
        const {
            useThreadedLoaders,
            minimizeJs,
            useWebpackDevServer,
            hotModuleReplacement,
            includeSentry,
            analyzeBundle,
            html,
            outputStats
        } = this.options

        const plugins: Plugin[] = [
            this.makeDefineEnvironmentPlugin(),
            new NamedModulesPlugin(),
            new DuplicatePackageCheckerPlugin({
                verbose: true,
                emitError: false,
                showHelp: true,
                strict: true,
            }),
            ...this.plugins
        ]

        if (useThreadedLoaders) {
            plugins.push(new ForkTsCheckerWebpackPlugin({
                checkSyntacticErrors: true
            }))
        }

        if (minimizeJs) {
            plugins.push(new MinifyPlugin(
                {
                    removeConsole: true,
                    undefinedToVoid: false,
                    mangle: { topLevel: true }
                },
                {
                    minifyPreset: babelPresetMinify
                }
            ))
        }

        if (useWebpackDevServer && hotModuleReplacement) {
            plugins.push(new HotModuleReplacementPlugin())
        }

        if (html) {
            plugins.push(new HtmlWebpackPlugin({
                filename: html.filename || 'index.html',
                template: html.template
            }))
        }

        if (includeSentry) {
            plugins.push(new SentryPlugin(includeSentry))
        }

        if (analyzeBundle) {
            plugins.push(new BundleAnalyzerPlugin(analyzeBundle.mode === 'server'
                ? {
                    analyzerMode: 'server',
                    analyzerPort: analyzeBundle.port,
                    openAnalyzer: analyzeBundle.open
                }
                : {
                    analyzerMode: 'static',
                    reportFilename: analyzeBundle.file,
                    openAnalyzer: analyzeBundle.open
                }
            ))
        }

        if (outputStats) {
            plugins.push(new StatsWriterPlugin({
                filename: outputStats,
                fields: [ 'hash', 'version', 'assetsByChunkName' ]
            }))
        }

        return plugins
    }

    private makeDefineEnvironmentPlugin(): Plugin
    {
        const defines = {} as { [key: string]: string }

        Object.keys(this.options.environmentVariables).map(key => {
            const value = JSON.stringify(this.options.environmentVariables[key])
            defines[key] = value
            defines['process.env.' + key] = value
        })

        return new DefinePlugin(defines)
    }
}

export default WebpackConfigBuilder
