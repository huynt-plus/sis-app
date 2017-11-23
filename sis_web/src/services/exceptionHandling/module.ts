/// <reference path="exceptionhandlerprovider.ts" />
/// <reference path="servererrorinterceptor.ts" />

angular.module('nlp.services.exceptionHandling', ['ngNotify', 'nlp.services', 'nlp.config'])
    .provider('exceptionHandler', NLP.Services.ExceptionHandling.ExceptionHandlerProvider)
    .factory('serverErrorInterceptor', NLP.Services.ExceptionHandling.serverErrorInterceptor)
    .config(NLP.Services.ExceptionHandling.config);