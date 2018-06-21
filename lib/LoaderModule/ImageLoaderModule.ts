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
import FileLoaderModule from './FileLoaderModule'

export default class ImageLoaderModule extends FileLoaderModule
{
    public static TEST = /\.(png|svg|jp(e?)g|gif)$/

    public constructor(outputDirectory: string, excludeNodeModules: boolean = false)
    {
        super(ImageLoaderModule.TEST, outputDirectory, excludeNodeModules)
    }

    public make(options: BuilderConfiguration, addPlugin: (plugin: Plugin) => WebpackConfigBuilder): RuleSetRule
    {
        this.module.options = {
            name: this.outputDirectory + (options.hashOutputFileNames ? '[hash]' : '[name]') + '.[ext]'
        }
        return super.make(options, addPlugin)
    }
}
