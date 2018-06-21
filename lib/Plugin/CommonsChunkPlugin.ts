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

import { Plugin } from 'webpack'
import Module = NodeJS.Module

const WebpackCommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')

export interface CommonsChunkPluginOptions
{
    name: string
    names: string[]
    filename: string
    minChunks: number | ((module: Module) => boolean)
    chunks: string[]
    children: boolean
    deepChildren: boolean
    async: boolean
    minSize: number
}

export default function CommonsChunkPlugin(options: Partial<CommonsChunkPluginOptions>): Plugin
{
    return new WebpackCommonsChunkPlugin(options)
}
