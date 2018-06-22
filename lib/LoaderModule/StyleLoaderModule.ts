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

import { Plugin, RuleSetRule, RuleSetUse } from 'webpack'
import ThreadPool from '../ThreadPool'
import WebpackConfigBuilder from '../WebpackConfigBuilder'
import BuilderConfiguration from '../WebpackConfigBuilderConfiguration'
import AbstractLoaderModule from './AbstractLoaderModule'
import HappyPackLoaderModule from './HappyPackLoaderModule'
import ThreadSafeLoaderModule from './ThreadSafeLoaderModule'

const ExtractTextPlugin = require('extract-text-webpack-plugin')

export default class StyleLoaderModule extends AbstractLoaderModule implements ThreadSafeLoaderModule
{
    public static readonly TEST = /\.(scss|sass|css)$/
    public readonly threadPool?: ThreadPool

    public constructor(threadPool?: ThreadPool)
    {
        super(StyleLoaderModule.TEST)
        this.threadPool = threadPool
    }

    private static makeChildLoaders(options: BuilderConfiguration): RuleSetUse
    {
        return [
            { loader: 'css-loader', options: {
                minimize: options.minimizeStyles,
                importLoaders: 2,
                sourceMap: options.sourceMaps !== false
            } },
            { loader: 'resolve-url-loader' },
            { loader: 'sass-loader', options: {
                sourceMap: options.sourceMaps !== false
            } }
        ]
    }

    private makeExtractable(options: BuilderConfiguration, addPlugin: (plugin: Plugin) => WebpackConfigBuilder): RuleSetRule
    {
        const plugin = new ExtractTextPlugin({
            filename: (options.hashOutputFileNames ? '[hash]/' : '') + 'bundle.css',
            allChunks: true
        })
        addPlugin(plugin)

        const loaderStack = StyleLoaderModule.makeChildLoaders(options)

        if (! options.useThreadedLoaders) {
            this.module.loader = plugin.extract({
                fallback: 'style-loader',
                use: loaderStack
            })
            return this.module
        }


        /**
         * @type {{
         *       "test": {},
         *       "loader": "happypack/loader?id=StyleLoaderModule-05"
         *   }}
         */
        this.module = this.makeHappyPackLoaderModule(loaderStack, options, addPlugin)
        this.module.loader = plugin.extract({
            fallback: 'style-loader',
            use: this.module.loader
        })
        return this.module
    }

    private makeNonExtractable(options: BuilderConfiguration, addPlugin: (plugin: Plugin) => WebpackConfigBuilder): RuleSetRule
    {
        this.module.use = [ { loader: 'style-loader' }, ...StyleLoaderModule.makeChildLoaders(options) ]

        if (! options.useThreadedLoaders) {
            return this.module
        }

        return this.makeHappyPackLoaderModule(this.module.use, options, addPlugin)
    }

    private makeHappyPackLoaderModule(
        loaderStack: RuleSetUse,
        options: BuilderConfiguration,
        addPlugin: (plugin: Plugin) => WebpackConfigBuilder
    ): RuleSetRule
    {
        // Note: The wrapper loader will call this.makeThreadSafe() to get
        //       the loader stack.
        this.module.use = loaderStack

        const wrapper = new HappyPackLoaderModule(this)
        return wrapper.make(options, addPlugin)
    }

    public make(options: BuilderConfiguration, addPlugin: (plugin: Plugin) => WebpackConfigBuilder): RuleSetRule
    {
        return options.extractStyles
            ? this.makeExtractable(options, addPlugin)
            : this.makeNonExtractable(options, addPlugin)
    }

    public makeThreadSafe(_options: BuilderConfiguration, _addPlugin: (plugin: Plugin) => WebpackConfigBuilder): RuleSetRule
    {
        return this.module
    }
}
