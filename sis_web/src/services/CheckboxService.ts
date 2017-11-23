/// <reference path="../data-services/checkboxs/queries/getcheckboxs.ts" />
module NLP.Services {
        'use strict';

        export interface ICheckboxService {
            getCheckboxs();
        }
        export class CheckboxService implements ICheckboxService {
            static $inject: string[] = ['$http', 'API_ENDPOINT_CONFIG'];
            private urlBase: string;

            constructor(private $http: ng.IHttpService, private API_ENDPOINT_CONFIG) {
                this.urlBase = API_ENDPOINT_CONFIG.URL + 'checkboxlist/';
            }

            getCheckboxs() {
                return this.$http.get<NLP.DataServices.Checkbox.Queries.GetCheckboxs.IModel>(this.urlBase).then(response => response.data);
            }
        }
}
