module NLP.Common {
    'use strict';

    export class Constants {
        public static NLP_REQUESTCANCELLEDLOGININPROGRESS = 'nlp:requestCancelledLoginInProgress';
        public static EMPTYGUID = '00000000-0000-0000-0000-000000000000';
    }

    export class Events {
        public static AUTH0_LOGINSUCCESS = 'loginSuccess';
        public static AUTH0_LOGINFAILURE = 'loginFailure';
        public static AUTH0_LOGOUT = 'logout';
        public static AUTH0_FORBIDDEN = 'forbidden';
        public static AUTH0_AUTHENTICATED = 'authenticated';

        public static NLP_LOGINSUCCESS = 'nlp:loginSuccess';
        public static NLP_TOKENREFRESHTIMEDOUT = 'nlp:tokenRefreshTimedOut';
        public static NLP_REFRESH_TOKEN_WINDOW_OPENED = 'nlp:RefreshTokenWindowOpened';
        public static UI_ROUTER_STATECHANGEERROR = '$stateChangeError';
        public static UI_ROUTER_STATECHANGESTART = '$stateChangeStart';
        public static UI_ROUTER_STATECHANGESUCCESS = '$stateChangeSuccess';
        public static UI_ROUTERVIEWCONTENTLOADED_SCOPE_EVENT = '$viewContentLoaded';
    }

    export enum LegalDocumentType {
        AcceptableUsePolicy,
        DataConfidentialityAgreement,
        PrivacyPolicy,
        ServiceLevelAgreement,
        TermsOfUse
    }

    export class URL {
        href: string;			// the full URL
        protocol: string;		// http:
        hostname: string;		// site.com
        port: string;			// 81
        pathname: string;		// /path/page
        search: string;			// ?a=1&b=2
        hash: string;			// #hash
    }

    export enum LogMessageLevel {
        Danger = 1,
        Warning = 2,
        Info = 3,
        Muted = 4
    }
    export class Utility {


        static convertLegalDocumentTypeToTitle(type: LegalDocumentType) {
            switch (type) {
                case LegalDocumentType.AcceptableUsePolicy:
                    return 'Acceptable Use Policy';
                case LegalDocumentType.DataConfidentialityAgreement:
                    return 'Data Confidentiality Agreement';
                case LegalDocumentType.PrivacyPolicy:
                    return 'Privacy Policy';
                case LegalDocumentType.ServiceLevelAgreement:
                    return 'Service Level Agreement';
                case LegalDocumentType.TermsOfUse:
                    return 'Terms Of Use';
                default:
                    return '';
            }
        }

        static getDistinctCollection(collection) {
            var o = {}, i, l = collection.length, uniqueEntries = [];
            for (i = 0; i < l; i += 1) {
                o[collection[i]] = collection[i];
            }
            for (i in o) {
                if (o.hasOwnProperty(i)) {
                    uniqueEntries.push(o[i]);
                }
            }
            return uniqueEntries;
        }

        static URLparse(str: string): URL {
            var url = document.createElement('a');
            url.href = str;
            return url;
        }

        //static normalizeDate(date: Date): moment.Moment {
          //  return moment.utc((<any>moment.utc({ y: new Date(date.toString()).getFullYear(), M: new Date(date.toString()).getMonth(), d: new Date(date.toString()).getDate() })).parseZone());
        //}
    }
} 