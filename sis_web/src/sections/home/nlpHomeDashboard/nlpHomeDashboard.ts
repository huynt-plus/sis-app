module NLP.Sections.Home.Directives {
    'use strict';

    export function nlpHomeDashboard(): ng.IDirective {
		return {
			restrict: 'EA',
            templateUrl: 'sections/home/nlpHomeDashboard/nlpHomeDashboard.tpl.html',
            controller: NLP.Sections.Home.Directives.NLPHomeDashboardCtrl,
            controllerAs: 'reportZone',
            bindToController: true
        };
	}

    nlpHomeDashboard.$inject = [];
}