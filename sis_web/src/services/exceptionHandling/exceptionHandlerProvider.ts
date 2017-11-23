/// <reference path="../common.ts" />
module NLP.Services.ExceptionHandling {
	'use strict';

	export interface IExceptionHandlerProvider extends ng.IServiceProvider {

		$get(): { config: ExceptionHandlerConfig };
	}

	export class ExceptionHandlerConfig {
		appErrorPrefix: string = '';
	}

	/**
	 * Configure the exception handling
	 * @return {[type]}
	 */
	export class ExceptionHandlerProvider implements IExceptionHandlerProvider {
		/* jshint validthis:true */
		private config: ExceptionHandlerConfig;
		constructor() {
			//this.config = new exceptionHandlerConfig();
		}

		configure(appErrorPrefix: string) {
			//this.config.appErrorPrefix = appErrorPrefix;
		}

		$get(): { config: ExceptionHandlerConfig } {
			//var ret: { config: ExceptionHandlerConfig };
			//ret.config = this.config;

			return { config: this.config };
		}
	}

	/**
	 * Configure by setting an optional string value for appErrorPrefix.
	 * Accessible via config.appErrorPrefix (via config value).
	 * @param  {[type]} $provide
	 * @return {[type]}
	 * @ngInject
	 */
	export function config($provide, $httpProvider) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);

        if ($httpProvider && $httpProvider.interceptors) {
            $httpProvider.interceptors.push('serverErrorInterceptor');
        }
    }


    declare var Raygun: raygun.RaygunStatic;

    function sendToRaygun(exception, cause) {
        var error = exception;
        var errorTags: string[] = [];
        var customData: { cause: any; serverStackTrace?: any; config?: any; } = { cause: cause };
        if (exception.data && exception.data.message && exception.data.stackTrace) {
            error = new Error(exception.data.message + ': ' + exception.statusText);
            customData.serverStackTrace = exception.data.stackTrace;
            errorTags.push(exception.statusText);
        }

        if (exception.config) {
            customData.config = exception.config;

            // build tags for the error
            if (exception.config.url) {
                var requestUrl = NLP.Common.Utility.URLparse(exception.config.url);

                errorTags.push(requestUrl.pathname);
                error.message += ': ' + requestUrl.pathname;
                if (requestUrl.search) {
                    errorTags.push(requestUrl.search);
                }
            }
        }

        Raygun.send(error, customData, errorTags);
    }

	/**
	 * Extend the $exceptionHandler service to log an error with logger.
	 * @param  {Object} $delegate
	 * @param  {Object} $injector
	 * @param  {Object} exceptionHandler
	 * @param  {Object} logger
	 * @return {Function} the decorated $exceptionHandler service
	 */
    function extendExceptionHandler($delegate, $injector, exceptionHandler, logger) {

        var logException = function (exception, cause) {
            if (angular.isDefined(Raygun)) {
                sendToRaygun(exception, cause);
            }
            var appErrorPrefix = '';//exceptionHandler.config.appErrorPrefix || '';
            var errorData = { exception: exception, cause: cause };
            exception.message = appErrorPrefix + (angular.isDefined(exception.message) ? exception.message : exception.statusText);
            $delegate(exception, cause);

            if (angular.isDefined(exception.data) && exception.data != null && angular.isDefined(exception.data.exceptionMessage)) {
                logger.error(exception.data.exceptionMessage, exception.data.stackTrace, exception.data.message);
            }
            else {
                logger.error(exception.message, errorData);
            }
        };

		return function (exception, cause) {
			//var $rootScope = $injector.get("$rootScope");

            if (exception && exception.config && exception.config.timeout) {
                exception.config.timeout.then((value) => {
                    if (value !== NLP.Common.Constants.NLP_REQUESTCANCELLEDLOGININPROGRESS) {
                        logException(exception, cause);
                    }
                });
            }

            logException(exception, cause);

		};
	}
}