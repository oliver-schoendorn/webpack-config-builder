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

import { exec } from 'child_process'

export default class GitHelper
{
    public getCurrentVersion(): Promise<string>
    {
        return this.execute('git describe --tags --always')
    }

    public getCurrentHash(): Promise<string>
    {
        return this.execute('git rev-parse HEAD')
    }

    public getCurrentRepository(): Promise<string>
    {
        return this.execute('git config --get remote.origin.url').then(remote =>
            remote.replace(/(^git@github\.com:)|(\.git$)/g, '')
        )
    }

    private execute = (command: string) => new Promise<string>(((resolve, reject) =>
    {
        exec(command, (error, stdout) => {
            if (error) {
                reject(error)
            }

            resolve(stdout.trim())
        })
    }))
}
