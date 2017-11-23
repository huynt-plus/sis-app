module NLP.Services.ExceptionHandling {
    'use strict';

    export function serverErrorInterceptor($q, $injector, $exceptionHandler: ng.IExceptionHandlerService) {
        return {
            responseError: function (rejection) {
                if (rejection.status >= 500 && rejection.status <= 599) {
                    var ngNotify = $injector.get('ngNotify');
                    $exceptionHandler(rejection, rejection.data.message || rejection.statusText);
                    ngNotify.set('Oops, we\'ve had a server error, please try again later.', 'error');
                }

                return $q.reject(rejection);
            }
        };
    }

    serverErrorInterceptor.$inject = ['$q', '$injector', '$exceptionHandler'];
}