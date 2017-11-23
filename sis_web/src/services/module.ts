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