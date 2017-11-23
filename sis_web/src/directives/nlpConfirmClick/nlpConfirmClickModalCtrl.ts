module NLP.Directives {
    'use strict';

    export class NLPConfirmClickModalCtrl {
        static $inject = ['$modalInstance', 'modalOptions'];
        constructor(
            private $modalInstance,
            private modalOptions: NLPConfirmClickModalCtrl.IModalOptions) {
        }

        onOK() {
            this.$modalInstance.close(true);
        }

        onCancel() {
            this.$modalInstance.close(false);
        }
    }

    export module NLPConfirmClickModalCtrl {
        export interface IModalOptions {
            modalHeader: string;
            modalBody: string;
            okLabel: string;
            cancelLabel: string;
        }
    }
}