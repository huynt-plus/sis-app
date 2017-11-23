module NLP.Directives {
    'use strict';

    export function nlpAdminMenu(): ng.IDirective {
        return {
            templateUrl: 'directives/nlpAdminMenu/nlpAdminMenu.tpl.html',
			restrict: 'E',
            controller: NLP.Directives.NLPAdminMenuCtrl,
            controllerAs: 'vm',
            replace: true
		};
    }
}