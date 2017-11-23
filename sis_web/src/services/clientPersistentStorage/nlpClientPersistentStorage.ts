module NLP.Services {
    'use strict';

    export class NLPClientPersistentStorage {
        static $inject: string[] = ['localStorageService'];

        constructor(private localStorageService: angular.local.storage.ILocalStorageService) {
        }

        set<T>(key: string, value: T): boolean {
            return this.localStorageService.set<T>(key, value);
        }

        get<T>(key: string): T {
            return this.localStorageService.get<T>(key);
        }

        remove(key: string): boolean {
            return this.localStorageService.remove(key);
        }
    }
}