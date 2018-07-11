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

import { Compiler, Plugin, RuleSetRule, Configuration, default as webpack } from 'webpack'
import { resolve as resolvePath } from 'path'
import Compilation = webpack.compilation.Compilation
import SentryRelease from './SentryRelease'
import SentryHelper from './SentryHelper'
import GitHelper from './GitHelper'

export interface SentryPluginOptions
{
    environment: string
    uploadSource: string
    urlPrefix: string
    ignore: string[]
    ignoreFiles: string[]
    additionalExtensions: string[]
    rewriteSourceMaps: boolean
    validateSourceMaps: boolean
}

export default class SentryPlugin implements Plugin
{
    private readonly options: SentryPluginOptions
    private release?: SentryRelease

    public constructor(options: Partial<SentryPluginOptions>)
    {
        this.options = Object.assign({
            environment: process.env.ENV || 'undefined',
            uploadSource: '.',
            urlPrefix: '~/',
            ignore: [ 'node_modules' ],
            ignoreFiles: [],
            additionalExtensions: [],
            rewriteSourceMaps: true,
            validateSourceMaps: true
        }, options)
    }

    public make(): Plugin
    {
        return this
    }

    public apply(compiler: Compiler): void
    {
        this.release = new SentryRelease(new SentryHelper(), new GitHelper())

        if ('module' in compiler.options && typeof compiler.options.module === 'object') {
            const newEntry = this.addEntry(compiler.options.entry)
            console.log({ label: 'new entry', newEntry })
            console.log('')

            compiler.options.entry = newEntry //this.addEntry(compiler.options.entry)
            compiler.options.module.rules.push(this.makeLoaderRuleSet(this.release.create()))

            // afterEmit hook
            if (typeof compiler.hooks === 'object') {
                compiler.hooks.afterEmit.tapAsync('Sentry Integration', this.afterEmit)
            }
            else {
                compiler.plugin('after-emit', this.afterEmit)
            }
        }
    }

    private makeLoaderRuleSet(release: Promise<string>): RuleSetRule
    {
        return {
            test: /SentryEntryDummy\.js$/,
            use: [
                {
                    loader: resolvePath(__dirname, 'SentryLoader.js'),
                    options: { release, options: this.options },
                },
            ],
        }
    }

    private addEntry(entry: Configuration['entry']): Configuration['entry']
    {
        const sentryEntry = resolvePath(__dirname, 'SentryEntryDummy.js')

        if (typeof entry === 'string') {
            return [ sentryEntry, entry ]
        }

        if (entry instanceof Array) {
            return [ sentryEntry, ...entry ]
        }

        if (typeof entry === 'function') {
            return () => Promise.resolve(entry()).then(
                entry => this.addEntry(entry) as string | string[]
            )
        }

        if (entry !== null && typeof entry === 'object') {
            return Object.keys(entry).reduce((accumulator: { [key: string]: Configuration['entry'] }, key) => {
                accumulator[key] = this.addEntry(entry[key])
                return accumulator
            }, {})
        }

        return entry
    }

    private afterEmit = (_compilation: Compilation, resolve: () => void) =>
    {
        this.release!.finalize(this.options)
            .then(() => {
                console.log('Completed sentry plugin execution')
                resolve()
            })
            .catch(error => _compilation.errors.push(error))
    }
}
