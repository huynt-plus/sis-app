/// <reference path="services/common.ts" />
/// <reference path="../typings/tsd.d.ts" />

declare var Raygun: raygun.RaygunStatic;

angular.module('nlp',
    [
        // angular modules
        'ngAnimate',
        'ngSanitize',
        'ngMessages',
        'ngTouch',

        // third-party modules
        'ui.router',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'ui.select',
        'ui.grid',
        'ui.grid.edit',
        'ui.grid.rowEdit',
        'ui.grid.resizeColumns',
        'ui.grid.autoResize',
        'ui-rangeSlider',
        'angular-loading-bar',
        'highcharts-ng',
        'gridster',
        'cgBusy',
        'angular-carousel',
        'ngAside',
        'ngFileUpload',

        'ui.grid.cellNav',
        'textAngular',
        'smart-table',
        'colorpicker.module',
        'ng-sortable',
        'ncy-angular-breadcrumb',
        'angularAwesomeSlider',
        'vesparny.fancyModal',
        'ng-showdown',
        'ngNotify',
        'xeditable',
        'checklist-model',
        'mgcrea.ngStrap.affix',
        'LocalStorageModule',

        // common modules
        'nlp.directives',
        'nlp.services',
        'nlp.services.exceptionHandling',
        'nlp.templates',
        'angularSpectrumColorpicker'
    ])

    .config(['$httpProvider', function ($httpProvider: ng.IHttpProvider) {

         if (!$httpProvider.defaults.headers.common) {
             $httpProvider.defaults.headers.common = {};
             $httpProvider.defaults.headers.post = {};
             $httpProvider.defaults.headers.put = {};
             $httpProvider.defaults.headers.patch = {};
         }
            // disable IE ajax request caching
            /* tslint:disable:no-string-literal */
        // $httpProvider.defaults.headers.common['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
        // $httpProvider.defaults.headers.common['Pragma'] = 'no-cache';
        delete $httpProvider.defaults.headers.common['Origin, X-Requested-With, Content-Type, Accept, Authorization'];
        $httpProvider.defaults.headers.common['Accept'] = 'application/json';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
        /* tslint:enable:no-string-literal */

    }])
    // .config(['NLPClientPersistentStorageProvider', function (NLPClientPersistentStorageProvider: NLP.Services.NLPClientPersistentStorageProvider) {
    //     NLPClientPersistentStorageProvider.setPrefix('nlp');
    // }])
    .config(['$httpProvider', '$animateProvider', '$stateProvider', '$urlRouterProvider','$breadcrumbProvider',
        function (
            $httpProvider,
            $animateProvider,
            $stateProvider: ng.ui.IStateProvider,
            $urlRouterProvider: ng.ui.IUrlRouterProvider,
            $breadcrumbProvider
            ) {

            $breadcrumbProvider.setOptions({
                prefixStateName: 'nlp.home',
                template: 'bootstrap3',
                templateUrl: 'partials/breadcrumbs.tpl.html'
            });

            // if ($httpProvider && $httpProvider.interceptors) {
            //     $httpProvider.interceptors.push('accessDeniedInterceptor');
            // }

            $animateProvider.classNameFilter(/^((?!(repeat-modify)).)*$/);

            $urlRouterProvider
                .otherwise('/');

            $stateProvider
                .state('nlp', {
                    url: '',
                    abstract: true,
                    templateUrl: 'partials/main.html'
                })
                .state('nlp.home', {
                    url: '/',
                    templateUrl: 'sections/home/home.html',
                    data: { pageTitle: 'NLP Home' },
                    ncyBreadcrumb: { label: 'Home' }
                });
        }])

    .run(
    ['$rootScope', '$urlRouter', '$state', '$stateParams', 'logger',
        function ($rootScope, $urlRouter: ng.ui.IUrlRouterService, $state: ng.ui.IStateService, $stateParams, logger) {

            $rootScope.allowLocationChangeSync = true;

            $rootScope.$on('$locationChangeSuccess', function (e) {
                e.preventDefault();

                if ($rootScope.allowLocationChangeSync) {
                    $urlRouter.sync();
                }
            });

            var handleRouteChangeError = function (event, toState, toParams, fromState, fromParams, error) {
                if (error && error.config && error.config.timeout) {
                    error.config.timeout.then((value) => {
                        if (value !== NLP.Common.Constants.NLP_REQUESTCANCELLEDLOGININPROGRESS) {
                            logger.error(error.message, error, 'Route change error');
                        }
                    });
                }
                else {
                    logger.error(error.message, error, 'Route change error');
                }
            };
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$on(NLP.Common.Events.UI_ROUTER_STATECHANGEERROR, handleRouteChangeError);
        }
    ]
    );

declare var deferredBootstrapper: any;

deferredBootstrapper.bootstrap({
    element: document.body,
    module: 'nlp',
    injectorModules: 'nlp.config'
});