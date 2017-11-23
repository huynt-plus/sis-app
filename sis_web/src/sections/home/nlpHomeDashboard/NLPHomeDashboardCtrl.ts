/// <reference path="../homedashboardservice.ts" />
/// <reference path="../../../services/checkboxservice.ts" />
/// <reference path="../../../services/reportservice.ts" />
/// <reference path="../../../services/common.ts" />
/// <reference path="../../../services/notifications/notify.ts" />
module NLP.Sections.Home.Directives {
    'use strict';
    export class NLPHomeDashboardCtrl {
        static $inject = ['$q', '$state','CheckboxService', 'ReportService', 'Notify'];

        checkboxs: NLP.DataServices.Checkbox.Queries.GetCheckboxs.IModel;
        json: any = [];
        formFile: File;
        reportFile: File;
        syncResult: NLP.Services.IReportSyncResult[];
        logMessageLevel = NLP.Common.LogMessageLevel;
        loadingFinished;
        loading = false;
        collapsed = false;
        constructor(
            private $q: ng.IQService,
            private $state,
            private CheckboxService: NLP.Services.CheckboxService,
            private ReportService: NLP.Services.ReportService,
            private Notify: NLP.Services.Notifications.Notify) {
        }

        analyze(reportForm) {
            if (reportForm) {
                this.collapsed = false;
                this.loading = true;
                this.loadingFinished = false;
                this.syncResult = [];
                this.ReportService.sendReport(this.formFile, this.reportFile).then((response) => {
                    this.syncResult = [].concat(response);
                    this.CheckboxService.getCheckboxs().then((result) => {
                        this.checkboxs = result;
                        this.syncResult.push(this.checkboxs.message);
                        this.json = JSON.parse(this.checkboxs.sections);
                        this.collapsed = true;
                    });
                }).then(() => {
                    this.loadingFinished = true;
                    this.loading = false;
                }).catch((e) => {
                    this.loading = false;
                    this.showErrorMessage('Server is not running!');
                });
            }
        }

        private showErrorMessage(msg) {
            this.Notify.set(msg, 'error');
        }
    }
}