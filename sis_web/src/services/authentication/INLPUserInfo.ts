module NLP.Services.Authentication {
    'use strict';

    export interface INLPUserInfo {
        isAuthenticated: boolean;
        userName: string;
        loginError: string;
        id: string;
    }
}