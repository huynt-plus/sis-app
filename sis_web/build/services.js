/// <reference path="../data-services/checkboxs/queries/getcheckboxs.ts" />
var NLP;
(function (NLP) {
    var Services;
    (function (Services) {
        'use strict';
        var CheckboxService = (function () {
            function CheckboxService($http, API_ENDPOINT_CONFIG) {
                this.$http = $http;
                this.API_ENDPOINT_CONFIG = API_ENDPOINT_CONFIG;
                this.urlBase = API_ENDPOINT_CONFIG.URL + 'checkboxlist/';
            }
            CheckboxService.prototype.getCheckboxs = function () {
                return this.$http.get(this.urlBase).then(function (response) { return response.data; });
            };
            CheckboxService.$inject = ['$http', 'API_ENDPOINT_CONFIG'];
            return CheckboxService;
        })();
        Services.CheckboxService = CheckboxService;
    })(Services = NLP.Services || (NLP.Services = {}));
})(NLP || (NLP = {}));

var NLP;
(function (NLP) {
    var Services;
    (function (Services) {
        'use strict';
    })(Services = NLP.Services || (NLP.Services = {}));
})(NLP || (NLP = {}));

/// <reference path="models.ts" />
var NLP;
(function (NLP) {
    var Services;
    (function (Services) {
        'use strict';
        var ReportService = (function () {
            // private syncResult: NLP.Services.IReportSyncResult;
            function ReportService($http, API_ENDPOINT_CONFIG, Upload) {
                this.$http = $http;
                this.API_ENDPOINT_CONFIG = API_ENDPOINT_CONFIG;
                this.Upload = Upload;
                this.urlBase = API_ENDPOINT_CONFIG.URL + 'report/';
            }
            ReportService.prototype.sendReport = function (formFile, reportFile) {
                return this.Upload.upload({ url: this.urlBase + 'upload', data: { file: reportFile } }).then(function (response) {
                    return response.data;
                });
            };
            ReportService.$inject = ['$http', 'API_ENDPOINT_CONFIG', 'Upload'];
            return ReportService;
        })();
        Services.ReportService = ReportService;
    })(Services = NLP.Services || (NLP.Services = {}));
})(NLP || (NLP = {}));

var NLP;
(function (NLP) {
    var Common;
    (function (Common) {
        'use strict';
        var Constants = (function () {
            function Constants() {
            }
            Constants.NLP_REQUESTCANCELLEDLOGININPROGRESS = 'nlp:requestCancelledLoginInProgress';
            Constants.EMPTYGUID = '00000000-0000-0000-0000-000000000000';
            return Constants;
        })();
        Common.Constants = Constants;
        var Events = (function () {
            function Events() {
            }
            Events.AUTH0_LOGINSUCCESS = 'loginSuccess';
            Events.AUTH0_LOGINFAILURE = 'loginFailure';
            Events.AUTH0_LOGOUT = 'logout';
            Events.AUTH0_FORBIDDEN = 'forbidden';
            Events.AUTH0_AUTHENTICATED = 'authenticated';
            Events.NLP_LOGINSUCCESS = 'nlp:loginSuccess';
            Events.NLP_TOKENREFRESHTIMEDOUT = 'nlp:tokenRefreshTimedOut';
            Events.NLP_REFRESH_TOKEN_WINDOW_OPENED = 'nlp:RefreshTokenWindowOpened';
            Events.UI_ROUTER_STATECHANGEERROR = '$stateChangeError';
            Events.UI_ROUTER_STATECHANGESTART = '$stateChangeStart';
            Events.UI_ROUTER_STATECHANGESUCCESS = '$stateChangeSuccess';
            Events.UI_ROUTERVIEWCONTENTLOADED_SCOPE_EVENT = '$viewContentLoaded';
            return Events;
        })();
        Common.Events = Events;
        (function (LegalDocumentType) {
            LegalDocumentType[LegalDocumentType["AcceptableUsePolicy"] = 0] = "AcceptableUsePolicy";
            LegalDocumentType[LegalDocumentType["DataConfidentialityAgreement"] = 1] = "DataConfidentialityAgreement";
            LegalDocumentType[LegalDocumentType["PrivacyPolicy"] = 2] = "PrivacyPolicy";
            LegalDocumentType[LegalDocumentType["ServiceLevelAgreement"] = 3] = "ServiceLevelAgreement";
            LegalDocumentType[LegalDocumentType["TermsOfUse"] = 4] = "TermsOfUse";
        })(Common.LegalDocumentType || (Common.LegalDocumentType = {}));
        var LegalDocumentType = Common.LegalDocumentType;
        var URL = (function () {
            function URL() {
            }
            return URL;
        })();
        Common.URL = URL;
        (function (LogMessageLevel) {
            LogMessageLevel[LogMessageLevel["Danger"] = 1] = "Danger";
            LogMessageLevel[LogMessageLevel["Warning"] = 2] = "Warning";
            LogMessageLevel[LogMessageLevel["Info"] = 3] = "Info";
            LogMessageLevel[LogMessageLevel["Muted"] = 4] = "Muted";
        })(Common.LogMessageLevel || (Common.LogMessageLevel = {}));
        var LogMessageLevel = Common.LogMessageLevel;
        var Utility = (function () {
            function Utility() {
            }
            Utility.convertLegalDocumentTypeToTitle = function (type) {
                switch (type) {
                    case LegalDocumentType.AcceptableUsePolicy:
                        return 'Acceptable Use Policy';
                    case LegalDocumentType.DataConfidentialityAgreement:
                        return 'Data Confidentiality Agreement';
                    case LegalDocumentType.PrivacyPolicy:
                        return 'Privacy Policy';
                    case LegalDocumentType.ServiceLevelAgreement:
                        return 'Service Level Agreement';
                    case LegalDocumentType.TermsOfUse:
                        return 'Terms Of Use';
                    default:
                        return '';
                }
            };
            Utility.getDistinctCollection = function (collection) {
                var o = {}, i, l = collection.length, uniqueEntries = [];
                for (i = 0; i < l; i += 1) {
                    o[collection[i]] = collection[i];
                }
                for (i in o) {
                    if (o.hasOwnProperty(i)) {
                        uniqueEntries.push(o[i]);
                    }
                }
                return uniqueEntries;
            };
            Utility.URLparse = function (str) {
                var url = document.createElement('a');
                url.href = str;
                return url;
            };
            return Utility;
        })();
        Common.Utility = Utility;
    })(Common = NLP.Common || (NLP.Common = {}));
})(NLP || (NLP = {}));

var NLP;
(function (NLP) {
    var Services;
    (function (Services) {
        'use strict';
        function Logger($log, toastr) {
            var service = {
                showToasts: true,
                error: error,
                info: info,
                success: success,
                warning: warning,
                // straight to console; bypass toastr
                log: $log.log
            };
            return service;
            function error(message, data, title) {
                toastr.error(message, title);
                $log.error('Error: ' + message, data);
            }
            function info(message, data, title) {
                toastr.info(message, title);
                $log.info('Info: ' + message, data);
            }
            function success(message, data, title) {
                toastr.success(message, title);
                $log.info('Success: ' + message, data);
            }
            function warning(message, data, title) {
                toastr.warning(message, title);
                $log.warn('Warning: ' + message, data);
            }
        }
        Services.Logger = Logger;
    })(Services = NLP.Services || (NLP.Services = {}));
})(NLP || (NLP = {}));

var NLP;
(function (NLP) {
    var Services;
    (function (Services) {
        var Authentication;
        (function (Authentication) {
            'use strict';
        })(Authentication = Services.Authentication || (Services.Authentication = {}));
    })(Services = NLP.Services || (NLP.Services = {}));
})(NLP || (NLP = {}));

var NLP;
(function (NLP) {
    var Services;
    (function (Services) {
        'use strict';
        var NLPClientPersistentStorage = (function () {
            function NLPClientPersistentStorage(localStorageService) {
                this.localStorageService = localStorageService;
            }
            NLPClientPersistentStorage.prototype.set = function (key, value) {
                return this.localStorageService.set(key, value);
            };
            NLPClientPersistentStorage.prototype.get = function (key) {
                return this.localStorageService.get(key);
            };
            NLPClientPersistentStorage.prototype.remove = function (key) {
                return this.localStorageService.remove(key);
            };
            NLPClientPersistentStorage.$inject = ['localStorageService'];
            return NLPClientPersistentStorage;
        })();
        Services.NLPClientPersistentStorage = NLPClientPersistentStorage;
    })(Services = NLP.Services || (NLP.Services = {}));
})(NLP || (NLP = {}));

/// <reference path="../clientpersistentstorage/nlpclientpersistentstorage.ts" />
/// <reference path="../common.ts" />
/// <reference path="inlpuserinfo.ts" />
/// <reference path="../models.ts" />
var NLP;
(function (NLP) {
    var Services;
    (function (Services) {
        var Authentication;
        (function (Authentication) {
            'use strict';
            var NLPUser = (function () {
                function NLPUser($q, $rootScope, $window, $modal, $location, NLPClientPersistentStorage, $timeout) {
                    this.$q = $q;
                    this.$rootScope = $rootScope;
                    this.$window = $window;
                    this.$modal = $modal;
                    this.$location = $location;
                    this.NLPClientPersistentStorage = NLPClientPersistentStorage;
                    this.$timeout = $timeout;
                    this.$inject = ['$q', '$rootScope', '$window', '$modal', 'FacebookService', '$location', 'NLPClientPersistentStorage', '$timeout'];
                    this.nlpUser = null;
                }
                Object.defineProperty(NLPUser.prototype, "userInfo", {
                    get: function () {
                        return this.$rootScope.userInfo;
                    },
                    enumerable: true,
                    configurable: true
                });
                NLPUser.prototype.getCurrentUserProfile = function () {
                    return this.nlpUser;
                };
                NLPUser.prototype.isAuthenticated = function () {
                    return this.$rootScope.userInfo && this.$rootScope.userInfo.isAuthenticated;
                };
                NLPUser.prototype.logout = function () {
                    this.$rootScope.userInfo = null;
                    this.$location.path('/');
                    this.$window.location.reload();
                };
                return NLPUser;
            })();
            Authentication.NLPUser = NLPUser;
        })(Authentication = Services.Authentication || (Services.Authentication = {}));
    })(Services = NLP.Services || (NLP.Services = {}));
})(NLP || (NLP = {}));

var NLP;
(function (NLP) {
    var Services;
    (function (Services) {
        var Authentication;
        (function (Authentication) {
            'use strict';
            function accessDeniedInterceptor($q, $rootScope, $timeout, logger) {
                var messageDisplayed = false;
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
            Authentication.accessDeniedInterceptor = accessDeniedInterceptor;
            accessDeniedInterceptor.$inject = ['$q', '$rootScope', '$timeout', 'logger'];
        })(Authentication = Services.Authentication || (Services.Authentication = {}));
    })(Services = NLP.Services || (NLP.Services = {}));
})(NLP || (NLP = {}));

/// <reference path="nlpclientpersistentstorage.ts" />
var NLP;
(function (NLP) {
    var Services;
    (function (Services) {
        'use strict';
        var NLPClientPersistentStorageProvider = (function () {
            function NLPClientPersistentStorageProvider(localStorageServiceProvider) {
                this.localStorageServiceProvider = localStorageServiceProvider;
                this.$get.$inject = Services.NLPClientPersistentStorage.$inject;
            }
            NLPClientPersistentStorageProvider.prototype.$get = function (localStorageService) {
                return new Services.NLPClientPersistentStorage(localStorageService);
            };
            NLPClientPersistentStorageProvider.prototype.setPrefix = function (prefix) {
                this.localStorageServiceProvider.setPrefix(prefix);
                return this;
            };
            NLPClientPersistentStorageProvider.$inject = ['localStorageServiceProvider'];
            return NLPClientPersistentStorageProvider;
        })();
        Services.NLPClientPersistentStorageProvider = NLPClientPersistentStorageProvider;
    })(Services = NLP.Services || (NLP.Services = {}));
})(NLP || (NLP = {}));

/// <reference path="../common.ts" />
var NLP;
(function (NLP) {
    var Services;
    (function (Services) {
        var ExceptionHandling;
        (function (ExceptionHandling) {
            'use strict';
            var ExceptionHandlerConfig = (function () {
                function ExceptionHandlerConfig() {
                    this.appErrorPrefix = '';
                }
                return ExceptionHandlerConfig;
            })();
            ExceptionHandling.ExceptionHandlerConfig = ExceptionHandlerConfig;
            /**
             * Configure the exception handling
             * @return {[type]}
             */
            var ExceptionHandlerProvider = (function () {
                function ExceptionHandlerProvider() {
                    //this.config = new exceptionHandlerConfig();
                }
                ExceptionHandlerProvider.prototype.configure = function (appErrorPrefix) {
                    //this.config.appErrorPrefix = appErrorPrefix;
                };
                ExceptionHandlerProvider.prototype.$get = function () {
                    //var ret: { config: ExceptionHandlerConfig };
                    //ret.config = this.config;
                    return { config: this.config };
                };
                return ExceptionHandlerProvider;
            })();
            ExceptionHandling.ExceptionHandlerProvider = ExceptionHandlerProvider;
            /**
             * Configure by setting an optional string value for appErrorPrefix.
             * Accessible via config.appErrorPrefix (via config value).
             * @param  {[type]} $provide
             * @return {[type]}
             * @ngInject
             */
            function config($provide, $httpProvider) {
                $provide.decorator('$exceptionHandler', extendExceptionHandler);
                if ($httpProvider && $httpProvider.interceptors) {
                    $httpProvider.interceptors.push('serverErrorInterceptor');
                }
            }
            ExceptionHandling.config = config;
            function sendToRaygun(exception, cause) {
                var error = exception;
                var errorTags = [];
                var customData = { cause: cause };
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
                    var appErrorPrefix = ''; //exceptionHandler.config.appErrorPrefix || '';
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
                        exception.config.timeout.then(function (value) {
                            if (value !== NLP.Common.Constants.NLP_REQUESTCANCELLEDLOGININPROGRESS) {
                                logException(exception, cause);
                            }
                        });
                    }
                    logException(exception, cause);
                };
            }
        })(ExceptionHandling = Services.ExceptionHandling || (Services.ExceptionHandling = {}));
    })(Services = NLP.Services || (NLP.Services = {}));
})(NLP || (NLP = {}));

var NLP;
(function (NLP) {
    var Services;
    (function (Services) {
        var ExceptionHandling;
        (function (ExceptionHandling) {
            'use strict';
            function serverErrorInterceptor($q, $injector, $exceptionHandler) {
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
            ExceptionHandling.serverErrorInterceptor = serverErrorInterceptor;
            serverErrorInterceptor.$inject = ['$q', '$injector', '$exceptionHandler'];
        })(ExceptionHandling = Services.ExceptionHandling || (Services.ExceptionHandling = {}));
    })(Services = NLP.Services || (NLP.Services = {}));
})(NLP || (NLP = {}));

var NLP;
(function (NLP) {
    var Services;
    (function (Services) {
        var Notifications;
        (function (Notifications) {
            'use strict';
            var Notify = (function () {
                function Notify(ngNotify) {
                    this.ngNotify = ngNotify;
                    this.$inject = ['ngNotify'];
                }
                Notify.prototype.set = function (notification, type) {
                    return this.ngNotify.set(notification, type);
                };
                Notify.prototype.dismiss = function () {
                    this.ngNotify.dismiss();
                };
                return Notify;
            })();
            Notifications.Notify = Notify;
        })(Notifications = Services.Notifications || (Services.Notifications = {}));
    })(Services = NLP.Services || (NLP.Services = {}));
})(NLP || (NLP = {}));

/// <reference path="logger.ts" />
/// <reference path="models.ts" />
/// <reference path="notifications/notify.ts" />
/// <reference path="authentication/accessdeniedinterceptor.ts" />
/// <reference path="clientpersistentstorage/nlpclientpersistentstorageprovider.ts" />
angular.module('nlp.services', ['nlp.config', 'angular-loading-bar'])
    .factory('logger', NLP.Services.Logger)
    .factory('accessDeniedInterceptor', NLP.Services.Authentication.accessDeniedInterceptor)
    .service('CheckboxService', NLP.Services.CheckboxService)
    .service('ReportService', NLP.Services.ReportService)
    .service('Notify', NLP.Services.Notifications.Notify)
    .provider('NLPClientPersistentStorage', NLP.Services.NLPClientPersistentStorageProvider);

/// <reference path="exceptionhandlerprovider.ts" />
/// <reference path="servererrorinterceptor.ts" />
angular.module('nlp.services.exceptionHandling', ['ngNotify', 'nlp.services', 'nlp.config'])
    .provider('exceptionHandler', NLP.Services.ExceptionHandling.ExceptionHandlerProvider)
    .factory('serverErrorInterceptor', NLP.Services.ExceptionHandling.serverErrorInterceptor)
    .config(NLP.Services.ExceptionHandling.config);

//# sourceMappingURL=services.js.map
