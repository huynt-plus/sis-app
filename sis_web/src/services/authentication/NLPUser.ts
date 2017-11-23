/// <reference path="../clientpersistentstorage/nlpclientpersistentstorage.ts" />
/// <reference path="../common.ts" />
/// <reference path="inlpuserinfo.ts" />
/// <reference path="../models.ts" />

module NLP.Services.Authentication {
    'use strict';

    export interface INLPUser {
        userInfo: INLPUserInfo;
        isAuthenticated(): boolean;
        getCurrentUserProfile(): IUserResponse;
        logout(): void;
    }

    export class NLPUser implements INLPUser {

        $inject: string[] = ['$q', '$rootScope', '$window', '$modal', 'FacebookService', '$location', 'NLPClientPersistentStorage', '$timeout'];

        nlpUser: NLP.Services.IUserResponse = null;

        NLPId: any;

        constructor(private $q: ng.IQService,
            private $rootScope,
            private $window: ng.IWindowService,
            private $modal,
            private $location,
            private NLPClientPersistentStorage: NLP.Services.NLPClientPersistentStorage,
            private $timeout: ng.ITimeoutService
        ) {}

        get userInfo(): INLPUserInfo {
            return this.$rootScope.userInfo;
        }

        getCurrentUserProfile() {
            return this.nlpUser;
        }


        isAuthenticated() {
            return this.$rootScope.userInfo && this.$rootScope.userInfo.isAuthenticated;
        }

        logout() {
            this.$rootScope.userInfo = null;
            this.$location.path('/');
            this.$window.location.reload();
        }
    }
}