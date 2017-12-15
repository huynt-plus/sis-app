/// <reference path="../../services/models.ts" />
var NLP;
(function (NLP) {
    var Sections;
    (function (Sections) {
        var Home;
        (function (Home) {
            'use strict';
            var HomeDashboardService = (function () {
                function HomeDashboardService() {
                }
                HomeDashboardService.$inject = [];
                return HomeDashboardService;
            })();
            Home.HomeDashboardService = HomeDashboardService;
        })(Home = Sections.Home || (Sections.Home = {}));
    })(Sections = NLP.Sections || (NLP.Sections = {}));
})(NLP || (NLP = {}));

var NLP;
(function (NLP) {
    var Sections;
    (function (Sections) {
        var Home;
        (function (Home) {
            var Directives;
            (function (Directives) {
                'use strict';
                function nlpHomeDashboard() {
                    return {
                        restrict: 'EA',
                        templateUrl: 'sections/home/nlpHomeDashboard/nlpHomeDashboard.tpl.html',
                        controller: NLP.Sections.Home.Directives.NLPHomeDashboardCtrl,
                        controllerAs: 'reportZone',
                        bindToController: true
                    };
                }
                Directives.nlpHomeDashboard = nlpHomeDashboard;
                nlpHomeDashboard.$inject = [];
            })(Directives = Home.Directives || (Home.Directives = {}));
        })(Home = Sections.Home || (Sections.Home = {}));
    })(Sections = NLP.Sections || (NLP.Sections = {}));
})(NLP || (NLP = {}));

/// <reference path="../homedashboardservice.ts" />
/// <reference path="../../../services/checkboxservice.ts" />
/// <reference path="../../../services/reportservice.ts" />
/// <reference path="../../../services/common.ts" />
/// <reference path="../../../services/notifications/notify.ts" />
var NLP;
(function (NLP) {
    var Sections;
    (function (Sections) {
        var Home;
        (function (Home) {
            var Directives;
            (function (Directives) {
                'use strict';
                var NLPHomeDashboardCtrl = (function () {
                    function NLPHomeDashboardCtrl($q, $state, CheckboxService, ReportService, Notify) {
                        this.$q = $q;
                        this.$state = $state;
                        this.CheckboxService = CheckboxService;
                        this.ReportService = ReportService;
                        this.Notify = Notify;
                        this.json = [];
                        this.logMessageLevel = NLP.Common.LogMessageLevel;
                        this.loading = false;
                        this.collapsed = false;
                    }
                    NLPHomeDashboardCtrl.prototype.analyze = function (reportForm) {
                        var _this = this;
                        if (reportForm) {
                            this.collapsed = false;
                            this.loading = true;
                            this.loadingFinished = false;
                            this.syncResult = [];
                            this.ReportService.sendReport(this.formFile, this.reportFile).then(function (response) {
                                _this.syncResult = [].concat(response);
                                _this.CheckboxService.getCheckboxs().then(function (result) {
                                    _this.checkboxs = result;
                                    _this.syncResult.push(_this.checkboxs.message);
                                    _this.json = JSON.parse(_this.checkboxs.sections);
                                    _this.collapsed = true;
                                });
                            }).then(function () {
                                _this.loadingFinished = true;
                                _this.loading = false;
                            }).catch(function (e) {
                                _this.loading = false;
                                _this.showErrorMessage('Server is not running!');
                            });
                        }
                    };
                    NLPHomeDashboardCtrl.prototype.showErrorMessage = function (msg) {
                        this.Notify.set(msg, 'error');
                    };
                    NLPHomeDashboardCtrl.$inject = ['$q', '$state', 'CheckboxService', 'ReportService', 'Notify'];
                    return NLPHomeDashboardCtrl;
                })();
                Directives.NLPHomeDashboardCtrl = NLPHomeDashboardCtrl;
            })(Directives = Home.Directives || (Home.Directives = {}));
        })(Home = Sections.Home || (Sections.Home = {}));
    })(Sections = NLP.Sections || (NLP.Sections = {}));
})(NLP || (NLP = {}));

/// <reference path="homedashboardservice.ts" />
/// <reference path="nlphomedashboard/nlphomedashboard.ts" />
/// <reference path="nlphomedashboard/nlphomedashboardctrl.ts" />
angular.module('nlp.sections.home', [])
    .service('HomeDashboardService', NLP.Sections.Home.HomeDashboardService)
    .directive('nlpHomeDashboard', NLP.Sections.Home.Directives.nlpHomeDashboard)
    .controller('NLPHomeDashboardCtrl', NLP.Sections.Home.Directives.NLPHomeDashboardCtrl);
