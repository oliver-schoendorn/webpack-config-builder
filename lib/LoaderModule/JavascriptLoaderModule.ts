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
import ThreadPool from '../ThreadPool'
import WebpackConfigBuilder from '../WebpackConfigBuilder'
import BuilderConfiguration from '../WebpackConfigBuilderConfiguration'
import AbstractBabelLoader from './AbstractBabelLoader'

export default class JavascriptLoaderModule extends AbstractBabelLoader
{
    public static readonly TEST = /\.js(x?)$/
    public static readonly TEST_NODE = /node_modules/

    public constructor(threadPool?: ThreadPool)
    {
        super(JavascriptLoaderModule.TEST, [], JavascriptLoaderModule.TEST_NODE, threadPool)
    }

    public make(options: BuilderConfiguration, addPlugin: (plugin: Plugin) => WebpackConfigBuilder): RuleSetRule
    {

        this.module.use = [
            JavascriptLoaderModule.makeBabelLoader(options)
        ]

        return super.make(options, addPlugin)
    }
}
