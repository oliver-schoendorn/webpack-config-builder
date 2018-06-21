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

import { Plugin, RuleSetUse } from 'webpack'
import HappyPackLoaderModule from '../LoaderModule/HappyPackLoaderModule'
const HappyLoader = require('happypack')

export default class HappyPackPlugin
{
    public readonly id: string
    private readonly loaders: RuleSetUse

    public constructor(loader: HappyPackLoaderModule)
    {
        this.id = loader.id
        this.loaders = loader.getLoaderIds()
    }

    public make(): Plugin
    {
        return new HappyLoader({
            id: this.id,
            threads: 2,
            loaders: this.loaders instanceof Array ? this.loaders : [ this.loaders ]
        })
    }
}
