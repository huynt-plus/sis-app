module NLP.Directives {
    'use strict';

    export function nlpConfirmClick($modal, $parse): ng.IDirective {
        return {
            priority:-1,
            restrict: 'A',
            scope: {},
            link: function (scope, element, attrs: any) {
                element.bind('click', function (e) {
                    e.stopImmediatePropagation();
                    e.preventDefault();

                    //capture ngClick expression
                    var ngClickExpr = attrs.ngClick;
                    var ngClickHandler = function () {
                        var fn = $parse(ngClickExpr);
                        fn(scope.$parent);
                    };

                    //show the modal dialog
                    var modalInstance = $modal.open({
                        animation: true,
                        size: 'sm',
                        templateUrl: 'directives/nlpConfirmClick/nlpConfirmClickModal.tpl.html',
                        controller: NLPConfirmClickModalCtrl,
                        controllerAs: 'vm',
                        resolve: {
                            modalOptions: () => {
                                var opts: NLPConfirmClickModalCtrl.IModalOptions = {
                                    modalHeader: attrs.modalHeader || 'Xác nhận',
                                    modalBody: attrs.aqConfirmClick || 'Bạn có chắc muốn xóa dòng này?',
                                    okLabel: attrs.okLabel || 'Đồng ý',
                                    cancelLabel: attrs.cancelLabel || 'Hủy bỏ'
                                };
                                return opts;
                            }
                        }
                    });

                    //call ngClickHandler when user click YES on the modal
                    modalInstance.result.then((result) => {
                        if (result === true) {
                            ngClickHandler();
                        }
                    });
                });
            }
        };
    }
    nlpConfirmClick.$inject = ['$modal', '$parse'];
}