'use strict';

if (typeof module !== 'undefined' && module.exports) {
    module.exports.inject = function (conf) {
        return new AuthenticationContext(conf);
    };
}

(function () {
    // ============= Angular modules- Start =============
    if (angular) {

        var AuthModule = angular.module('authAngular', []);

        AuthModule.provider('authAuthenticationService', function () {
            var _auth = null;
            var _oauthData = { isAuthenticated: false, accessToken: '', userName: '' };

            var updateDataFromCache = function () {
                // only cache lookup here to not interrupt with events
                var token = _auth.getCachedToken();
                _oauthData.isAuthenticated = token !== null && token.length > 0;
                var user = _auth.getCachedUser() || { accessToken: '' };
                _oauthData.accessToken = user.accessToken;
                _oauthData.userName = user.userName;
            };

            this.init = function (configOptions, httpProvider) {
                if (configOptions) {
                   
                    if (httpProvider && httpProvider.interceptors) {
                        httpProvider.interceptors.push('ProtectedResourceInterceptor');
                    }

                    // create instance with given config
                    _auth = new AuthenticationContext(configOptions);
                } else {
                    throw new Error('You must set configOptions, when calling init');
                }

                // loginresource is used to set authenticated status
                updateDataFromCache(_ilal.config.loginResource);
            };

            this.$get = ['$rootScope', '$window', '$q', '$location', '$timeout', '$injector', function ($rootScope, $window, $q, $location, $timeout, $injector) {

                updateDataFromCache();
                $rootScope.userInfo = _oauthData;

                return {
                    // public methods will be here that are accessible from Controller
                    config: _auth.config,
                    login: function (accessToken, userName) {                        
                        _auth.login(accessToken, userName);
                        updateDataFromCache();
                        $rootScope.userInfo = _oauthData;
                    },
                    logOut: function () {
                        _auth.logOut();
                    },
                    getCachedToken: function () {
                        return _auth.getCachedToken();
                    },
                    userInfo: _oauthData,
                    clearCacheForResource: function () {
                        _auth.clearCacheForResource();
                    },
                    getUser: function () {
                        var deferred = $q.defer();
                        _auth.getUser(function (error, user) {
                            if (error) {
                                _auth.error('Error when getting user', error);
                                deferred.reject(error);
                            } else {
                                deferred.resolve(user);
                            }
                        });

                        return deferred.promise;
                    },
                    clearCache: function () {
                        _auth.clearCache();
                    }
                };
            }];
        });

        // Interceptor for http if needed
        AuthModule.factory('ProtectedResourceInterceptor', ['authAuthenticationService', '$q', '$rootScope', '$templateCache', function (authService, $q, $rootScope, $templateCache) {

            return {
                request: function (config) {
                    if (config) {
                        config.headers = config.headers || {};

                        var tokenStored = authService.getCachedToken();
                        if (tokenStored) {
                            config.headers.Authorization = 'Bearer ' + tokenStored;
                            return config;
                        }

                        return config;
                    }
                },
                responseError: function (rejection) {
                    if (rejection && rejection.status === 401) {
                        authService.clearCacheForResource();
                        authService.logOut();
                        $rootScope.$broadcast('auth:notAuthorized', rejection);
                    }

                    return $q.reject(rejection);
                }
            };
        }]);
    } else {
        console.error('Angular.JS is not included');
    }
}());
