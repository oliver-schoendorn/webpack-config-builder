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

import { Entry as WebpackEntry } from 'webpack'

export default class Entry
{
    public readonly hotReplacementCapable: boolean

    protected name: string
    protected path: string
    protected prependedPaths: string[]
    protected appendedPaths: string[]

    public constructor(name: string, path: string, hotReplacementCapable: boolean, prepend?: string[], append?: string[])
    {
        this.name = name
        this.path = path
        this.appendedPaths = append || []
        this.prependedPaths = prepend || []
        this.hotReplacementCapable = hotReplacementCapable
    }

    public prepend(path: string, mode: 'prepend' | 'append' = 'append'): this
    {
        switch (mode) {
            case 'prepend':
                this.prependedPaths.unshift(path)
                break

            case 'append':
                this.prependedPaths.push(path)
                break
        }
        return this
    }

    public append(path: string, mode: 'prepend' | 'append' = 'append'): this
    {
        switch (mode) {
            case 'prepend':
                this.appendedPaths.unshift(path)
                break

            case 'append':
                this.appendedPaths.push(path)
                break
        }
        return this
    }

    public make(): WebpackEntry
    {
        return {
            [this.name]: [
                ...this.prependedPaths,
                this.path,
                ...this.appendedPaths
            ]
        }
    }
}
