module NLP.Services {
    'use strict';

    export interface IHomeData {
        Title: number;
        Id: number;
    }

    export interface IUserResponse {
        id: string;
        name: string;
        picture: string;
    }

    export interface IReportSyncResult {
        messages: string;
        level: number;
        hasErrors: boolean;
        complete: boolean;
    }
}