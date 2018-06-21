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

import { Plugin, RuleSetRule } from 'webpack'
import WebpackConfigBuilder from '../WebpackConfigBuilder'
import BuilderConfiguration from '../WebpackConfigBuilderConfiguration'
import AbstractThreadSafeLoaderModule from './AbstractThreadSafeLoaderModule'

const ExtractTextPlugin = require('extract-text-webpack-plugin')

export default class StyleLoaderModule extends AbstractThreadSafeLoaderModule
{
    public static readonly TEST = /\.(scss|sass|css)$/

    public constructor()
    {
        super(StyleLoaderModule.TEST)
    }

    public make(options: BuilderConfiguration, addPlugin: (plugin: Plugin) => WebpackConfigBuilder): RuleSetRule
    {
        const loaders = [
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

        this.module.use = options.extractStyles
            ? ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: loaders
            })
            : loaders

        if (options.extractStyles) {
            addPlugin(new ExtractTextPlugin({
                filename: (options.hashOutputFileNames ? '[hash]/' : '') + 'bundle.css',
                allChunks: true
            }))
        }

        return super.make(options, addPlugin)
    }
}
