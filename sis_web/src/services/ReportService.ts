/// <reference path="models.ts" />
module NLP.Services {
    'use strict';

    export interface IReportService {
        sendReport(formFile, reportFile): ng.IPromise<NLP.Services.IReportSyncResult>;
    }
    export class ReportService implements IReportService {
        static $inject: string[] = ['$http', 'API_ENDPOINT_CONFIG', 'Upload'];
        private urlBase: string;
        // private syncResult: NLP.Services.IReportSyncResult;
        constructor(private $http: ng.IHttpService, private API_ENDPOINT_CONFIG, private Upload) {
            this.urlBase = API_ENDPOINT_CONFIG.URL + 'report/';
        }

        sendReport(formFile, reportFile): ng.IPromise<NLP.Services.IReportSyncResult> {
            return this.Upload.upload({url: this.urlBase + 'upload', data: { file: reportFile } }).then((response) => {
                return response.data;
            });
        }
    }
}
