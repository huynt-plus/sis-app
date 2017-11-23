/// <reference path="../../services/common.ts" />
/// <reference path="../../services/authentication/nlpuser.ts" />

module NLP.Directives {
    'use strict';

    export class NLPUserMenuCtrl {
        static $inject = ['ILUser'];

        constructor(private NLPUser: NLP.Services.Authentication.NLPUser) {

        }

        isAuthenticated() {
            return this.NLPUser.isAuthenticated();
        }
    }
}