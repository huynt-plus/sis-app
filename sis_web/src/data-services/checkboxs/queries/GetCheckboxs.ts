module NLP.DataServices.Checkbox.Queries {
    'use strict';
    export class GetCheckboxs {
    }

    export module GetCheckboxs {
        export interface IModel {
            message: Model.IReportSyncResult;
            sections: string;
        }

        export module Model {
            export interface IReportSyncResult {
                messages: string;
                level: number;
                hasErrors: boolean;
                complete: boolean;
            }
        }
    }
}


