module NLP.DataServices.Reports.Commands {
    'use strict';

    export class SendReport {
    }

    export module SendReport {
        export interface IModel {
            Id: string;
            File: string;
        }
    }
}