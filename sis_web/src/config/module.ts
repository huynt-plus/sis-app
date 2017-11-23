declare var Clipboard: any;

angular.module('nlp.config', [])
    .constant('toastr', toastr)
    .constant('Clipboard', Clipboard)
    .constant('restrictedCharactersRegex', /^[^\/\"\;\:\<\>\|\[\]\,\.\'\?\~\`\!\$\%\^\&\*\(\)\-\+\=\{\}\@\#]+$/)
    .constant('defaultChartColors', [
        '#6699FF',
        '#F63232',
        '#99FF66',
        '#FF9900',
        '#1966FF',
        '#CD0909',
        '#4EEA00',
        '#DE8400',
        '#AFCAFF',
        '#F86262',
        '#C7FFAB',
        '#FFB84F'
    ])
    .constant('spectrumColorPickerDefaultPalette', ['black', 'blue', 'green', 'aqua', 'red', 'pink', 'yellow', 'white'])
    .constant('spectrumColorPickerTriggerPalette', ['#FF2000', '#FF6000', '#FF8000', '#FFA000', '#FFC000', '#FFF000', '#FFFF00', '#C0FF00', '#A0FF00', '#80FF00', '#10FF00'])
    .value('NLPClientInfo', {
        appErrorPrefix: '[NLPApp Error] ',
        appTitle: 'NLP Application',
        version: '1.0.0'
    }); 