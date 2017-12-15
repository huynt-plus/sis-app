/// <reference path="../../services/common.ts" />
var NLP;
(function (NLP) {
    var Directives;
    (function (Directives) {
        'use strict';
        var NLPAdminMenuCtrl = (function () {
            function NLPAdminMenuCtrl() {
            }
            NLPAdminMenuCtrl.$inject = [];
            return NLPAdminMenuCtrl;
        })();
        Directives.NLPAdminMenuCtrl = NLPAdminMenuCtrl;
    })(Directives = NLP.Directives || (NLP.Directives = {}));
})(NLP || (NLP = {}));

var NLP;
(function (NLP) {
    var Directives;
    (function (Directives) {
        'use strict';
        function nlpAdminMenu() {
            return {
                templateUrl: 'directives/nlpAdminMenu/nlpAdminMenu.tpl.html',
                restrict: 'E',
                controller: NLP.Directives.NLPAdminMenuCtrl,
                controllerAs: 'vm',
                replace: true
            };
        }
        Directives.nlpAdminMenu = nlpAdminMenu;
    })(Directives = NLP.Directives || (NLP.Directives = {}));
})(NLP || (NLP = {}));

var NLP;
(function (NLP) {
    var Directives;
    (function (Directives) {
        'use strict';
        function nlpConfirmClick($modal, $parse) {
            return {
                priority: -1,
                restrict: 'A',
                scope: {},
                link: function (scope, element, attrs) {
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
                            controller: Directives.NLPConfirmClickModalCtrl,
                            controllerAs: 'vm',
                            resolve: {
                                modalOptions: function () {
                                    var opts = {
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
                        modalInstance.result.then(function (result) {
                            if (result === true) {
                                ngClickHandler();
                            }
                        });
                    });
                }
            };
        }
        Directives.nlpConfirmClick = nlpConfirmClick;
        nlpConfirmClick.$inject = ['$modal', '$parse'];
    })(Directives = NLP.Directives || (NLP.Directives = {}));
})(NLP || (NLP = {}));

var NLP;
(function (NLP) {
    var Directives;
    (function (Directives) {
        'use strict';
        var NLPConfirmClickModalCtrl = (function () {
            function NLPConfirmClickModalCtrl($modalInstance, modalOptions) {
                this.$modalInstance = $modalInstance;
                this.modalOptions = modalOptions;
            }
            NLPConfirmClickModalCtrl.prototype.onOK = function () {
                this.$modalInstance.close(true);
            };
            NLPConfirmClickModalCtrl.prototype.onCancel = function () {
                this.$modalInstance.close(false);
            };
            NLPConfirmClickModalCtrl.$inject = ['$modalInstance', 'modalOptions'];
            return NLPConfirmClickModalCtrl;
        })();
        Directives.NLPConfirmClickModalCtrl = NLPConfirmClickModalCtrl;
    })(Directives = NLP.Directives || (NLP.Directives = {}));
})(NLP || (NLP = {}));

/// <reference path="../../services/common.ts" />
/// <reference path="../../services/authentication/nlpuser.ts" />
var NLP;
(function (NLP) {
    var Directives;
    (function (Directives) {
        'use strict';
        var NLPUserMenuCtrl = (function () {
            function NLPUserMenuCtrl(NLPUser) {
                this.NLPUser = NLPUser;
            }
            NLPUserMenuCtrl.prototype.isAuthenticated = function () {
                return this.NLPUser.isAuthenticated();
            };
            NLPUserMenuCtrl.$inject = ['ILUser'];
            return NLPUserMenuCtrl;
        })();
        Directives.NLPUserMenuCtrl = NLPUserMenuCtrl;
    })(Directives = NLP.Directives || (NLP.Directives = {}));
})(NLP || (NLP = {}));

var NLP;
(function (NLP) {
    var Directives;
    (function (Directives) {
        'use strict';
        function nlpUserMenu() {
            return {
                templateUrl: 'directives/nlpUserMenu/nlpUserMenu.tpl.html',
                restrict: 'E',
                controller: NLP.Directives.NLPUserMenuCtrl,
                controllerAs: 'vm',
                replace: true
            };
        }
        Directives.nlpUserMenu = nlpUserMenu;
    })(Directives = NLP.Directives || (NLP.Directives = {}));
})(NLP || (NLP = {}));

angular.module('nlp.directives', [])
    .directive('nlpAdminMenu', NLP.Directives.nlpAdminMenu)
    .directive('nlpConfirmClick', NLP.Directives.nlpConfirmClick);

//# sourceMappingURL=scripts.js.map
