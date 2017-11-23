module NLP.Services.Authentication {
    'use strict';
    export function accessDeniedInterceptor($q, $rootScope: ng.IRootScopeService, $timeout: ng.ITimeoutService, logger: ILogger) {
        var messageDisplayed: boolean = false;
        return {
            responseError: function (rejection) {
                if (rejection && rejection.status === 403 && !messageDisplayed) {
                    // suppress messages from requests that are close in time so that they do not flood UI
                    messageDisplayed = true;
                    logger.warning('Sorry, you don\'t have enough permissions to complete this action.', '', 'Access denied');
                    // remove the threshold after some time so that the messages start showing up again
                    $timeout(function resetThreshold() { messageDisplayed = false; }, 1000);
                }
                return $q.reject(rejection);
            }
        };
    }
    accessDeniedInterceptor.$inject = ['$q', '$rootScope', '$timeout', 'logger'];
}