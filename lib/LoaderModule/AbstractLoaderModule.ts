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

import { Plugin, RuleSetCondition, RuleSetRule, RuleSetUse } from 'webpack'
import WebpackConfigBuilder from '../WebpackConfigBuilder'
import BuilderConfiguration from '../WebpackConfigBuilderConfiguration'
import LoaderModule from './LoaderModule'

export default class AbstractLoaderModule implements LoaderModule
{
    protected module: RuleSetRule

    public constructor(test: RuleSetCondition, use?: RuleSetUse, exclude?: RuleSetCondition)
    {
        this.module = Object.assign({}, {
            test: test,
            use: use,
            exclude: exclude
        })
    }

    public make(_options: BuilderConfiguration, _addPlugin: ((plugin: Plugin) => WebpackConfigBuilder)): RuleSetRule
    {
        return this.module
    }
}
