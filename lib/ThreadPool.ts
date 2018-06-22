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

const HappyThreadPool = require('happypack').ThreadPool

export interface ThreadPoolOptions
{
    /**
     * Used for prefixing the thread IDs. This is only used for logging
     * purposes and does not affect the functionality.
     */
    id?: string

    /**
     * The number of background threads to spawn for running loaders.
     */
    size: number

    /**
     * Allow this module and threads to log information to the console.
     * Default: false
     */
    verbose?: boolean

    /**
     * Allow this module and threads to log debugging information to the console.
     * Default: false
     */
    debug?: boolean

    /**
     * Compatibility mode for fork() on Windows where message exchange
     * between the master and worker processes is done serially.
     * This should be turned on if you're on Windows otherwise the process
     * could hang!
     * Default: false
     */
    bufferedMessaging?: boolean
}

export default class ThreadPool
{
    private readonly options: ThreadPoolOptions
    constructor(options: ThreadPoolOptions)
    {
        this.options = options
    }

    public make(): object
    {
        return new HappyThreadPool(this.options)
    }
}
