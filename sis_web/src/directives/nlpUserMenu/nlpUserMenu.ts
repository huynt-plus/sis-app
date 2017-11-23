module NLP.Directives {
    'use strict';

    export function nlpUserMenu(): ng.IDirective {
        return {
            templateUrl: 'directives/nlpUserMenu/nlpUserMenu.tpl.html',
			restrict: 'E',
            controller: NLP.Directives.NLPUserMenuCtrl,
            controllerAs: 'vm',
            replace: true
		};
    }
}