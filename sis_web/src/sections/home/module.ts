/// <reference path="homedashboardservice.ts" />
/// <reference path="nlphomedashboard/nlphomedashboard.ts" />
/// <reference path="nlphomedashboard/nlphomedashboardctrl.ts" />

angular.module('nlp.sections.home', [])
    .service('HomeDashboardService', NLP.Sections.Home.HomeDashboardService)
    .directive('nlpHomeDashboard', NLP.Sections.Home.Directives.nlpHomeDashboard)
    .controller('NLPHomeDashboardCtrl', NLP.Sections.Home.Directives.NLPHomeDashboardCtrl);