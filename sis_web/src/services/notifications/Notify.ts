module NLP.Services.Notifications {
    'use strict';

    export interface INotifyConfiguration {
        position?: string;
        sticky?: boolean;
        duration?: number;
        theme?: string;
        html?: boolean;
        type?: string;
    }

    export interface INotify {
        set(notification: string, type?: string|INotifyConfiguration): void;
        dismiss():void;
    }

    export class Notify implements INotify {

        $inject: string[] = ['ngNotify'];

        constructor(private ngNotify) {
        }

        set(notification: string, type?: string|INotifyConfiguration): string {
            return this.ngNotify.set(notification, type);
        }

        dismiss() {
            this.ngNotify.dismiss();
        }
    }
}