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

declare module "@sentry/cli" {
    export default class SentryCli
    {
        public constructor(configFile?: string)

        /**
         * Returns the version of the installed `sentry-cli` binary.
         * @returns {string}
         */
        public static getVersion(): string

        /**
         * Returns an absolute path to the `sentry-cli` binary.
         * @returns {string}
         */
        public static getPath(): string

        /**
         * See {helper.execute} docs.
         * @param {string[]} args Command line arguments passed to `sentry-cli`.
         * @param {boolean} live We inherit stdio to display `sentry-cli` output directly.
         * @returns {Promise.<string>} A promise that resolves to the standard output.
         */
        execute(args: string[], live: boolean): Promise<string>
    }
}
