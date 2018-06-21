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

import { Plugin, RuleSetLoader, RuleSetRule } from 'webpack'
import WebpackConfigBuilder from '../WebpackConfigBuilder'
import BuilderConfiguration from '../WebpackConfigBuilderConfiguration'
import AbstractBabelLoader from './AbstractBabelLoader'

export default class TypescriptLoaderModule extends AbstractBabelLoader
{
    public static readonly TEST = /\.ts(x?)$/
    public static readonly TEST_NODE = /node_modules/

    public constructor()
    {
        super(TypescriptLoaderModule.TEST, [], TypescriptLoaderModule.TEST_NODE)
    }

    public make(options: BuilderConfiguration, addPlugin: (plugin: Plugin) => WebpackConfigBuilder): RuleSetRule
    {
        this.module.use = [
            TypescriptLoaderModule.makeBabelLoader(options),
            TypescriptLoaderModule.makeTypescriptLoader(options)
        ]

        return super.make(options, addPlugin)
    }

    private static makeTypescriptLoader(options: BuilderConfiguration): RuleSetLoader
    {
        const loader: RuleSetLoader = { loader: 'ts-loader' }

        if (options.useThreadedLoaders) {
            loader.options = { happyPackMode: true }
        }

        return loader
    }
}
