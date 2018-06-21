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
import AbstractLoaderModule from './AbstractLoaderModule'
import HappyPackLoaderModule from './HappyPackLoaderModule'
import ThreadSafeLoaderModule from './ThreadSafeLoaderModule'

export default abstract class AbstractThreadSafeLoaderModule extends AbstractLoaderModule implements ThreadSafeLoaderModule
{
    public make(options: BuilderConfiguration, addPlugin: (plugin: Plugin) => WebpackConfigBuilder): RuleSetRule
    {
        if (! options.useThreadedLoaders) {
            return this.makeThreadSafe(options, addPlugin)
        }

        const wrapper = new HappyPackLoaderModule(this)
        return wrapper.make(options, addPlugin)
    }

    public makeThreadSafe(options: BuilderConfiguration, addPlugin: (plugin: Plugin) => WebpackConfigBuilder): RuleSetRule
    {
        return super.make(options, addPlugin)
    }
}
