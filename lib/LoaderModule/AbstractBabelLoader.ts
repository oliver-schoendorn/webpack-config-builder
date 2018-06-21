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

import { RuleSetLoader } from 'webpack'
import BuilderConfiguration from '../WebpackConfigBuilderConfiguration'
import AbstractThreadSafeLoaderModule from './AbstractThreadSafeLoaderModule'

export default abstract class AbstractBabelLoader extends AbstractThreadSafeLoaderModule
{
    protected static makeBabelLoader(options: BuilderConfiguration): RuleSetLoader
    {
        const loader = {
            loader: 'babel-loader',
            options: {
                babelrc: false,
                cacheDirectory: options.useBabelCache ? options.cacheDirectory : false,
                presets: [
                    [ 'env', {
                        debug: true,
                        targets: { browsers: AbstractBabelLoader.makeBabelLoaderEnvTargetConfig(options) }
                    }],
                    'react',
                    'stage-2'
                ],
                plugins: [] as any[]
            }
        }

        if (options.hotModuleReplacement) {
            loader.options.plugins.push('react-hot-loader/babel')
        }

        if (options.extractI18nMessages) {
            loader.options.plugins.push([ 'react-intl', {
                messagesDir: options.extractI18nMessages,
                enforceDescriptions: true,
                extractSourceLocation: true
            }])
        }

        return loader
    }

    protected static makeBabelLoaderEnvTargetConfig(options: BuilderConfiguration): string[]
    {
        switch (options.target) {
            case 'production':
                return [
                    '> 1%',
                    'ie 10'
                ]

            default:
                return [
                    'last 2 chrome version'
                ]
        }
    }
}
