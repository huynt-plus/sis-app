/// <reference path="nlpclientpersistentstorage.ts" />

module NLP.Services {
    'use strict';

    export class NLPClientPersistentStorageProvider implements ng.IServiceProvider {

        static $inject = ['localStorageServiceProvider'];

        constructor(private localStorageServiceProvider: angular.local.storage.ILocalStorageServiceProvider) {
            this.$get.$inject = NLPClientPersistentStorage.$inject;
        }

        $get(localStorageService) {
            return new NLPClientPersistentStorage(localStorageService);
        }

        setPrefix(prefix: string): NLPClientPersistentStorageProvider {
            this.localStorageServiceProvider.setPrefix(prefix);
            return this;
        }
    }
}