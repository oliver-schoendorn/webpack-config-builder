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
import HappyPackPlugin from '../Plugin/HappyPackPlugin'
import WebpackConfigBuilder from '../WebpackConfigBuilder'
import BuilderConfiguration from '../WebpackConfigBuilderConfiguration'
import LoaderModule from './LoaderModule'
import ThreadSafeLoaderModule from './ThreadSafeLoaderModule'

export default class HappyPackLoaderModule implements LoaderModule
{
    public static counter = 0

    public readonly id: string
    private loader: ThreadSafeLoaderModule
    private use?: RuleSetUse

    public constructor(loader: ThreadSafeLoaderModule)
    {
        this.id = loader.constructor.name + '-' + String('0' + (++HappyPackLoaderModule.counter)).slice(-2)
        this.loader = loader
    }

    public getLoaderIds(): RuleSetUse
    {
        if (! this.use) {
            throw new Error('Unable to get loader ids before invoking LoaderModule::make()')
        }

        return this.use
    }

    public make(options: BuilderConfiguration, addPlugin: (plugin: Plugin) => WebpackConfigBuilder): RuleSetRule
    {
        const loader = this.loader.makeThreadSafe(options, addPlugin)
        this.use = loader.use

        addPlugin((new HappyPackPlugin(this, this.loader.threadPool)).make())

        return Object.assign({}, loader, {
            loader: 'happypack/loader?id=' + this.id,
            use: undefined
        })
    }
}
