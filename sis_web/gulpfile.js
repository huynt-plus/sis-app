var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var glob = require('glob');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var merge = require('merge-stream');
var del = require('del');
var karma = require('karma').server;
var karmaRunner = require('karma').runner;
var yargs = require('yargs').argv;
var browserSync = require('browser-sync');

var gulpConfig = require('./gulp.config')();

var mode = yargs.buildMode || 'nlp';
var buildSHA = yargs.sha || '';

var pkg = require('./package.json');
var config = null;
var sections = getSections();


gulp.task('set-config', function () {
    $.util.log('Build mode is set to: ' + mode);

    config = require('./src/config.' + mode + '.json');

    if (buildSHA) {
        config.constants.SHA = buildSHA;
    }
    //switch (mode) {
    //    case 'debug': config = require('./src/config.debug.json');
    //        break;
    //    case 'release': config = require('./src/config.release.json');
    //        break;
    //    case 'aqTest': config = require('./src/config.aqTest.json');
    //        break;
    //    default: config = require('./src/config.debug.json');
    //        break;
    //}
});

gulp.task('app-ts', function () {
    var sectionModules =
        sections.map(function (section) { return ', "nlp.sections.' + section.section + '"'; })
        .join('');

    return gulp.src(['src/app.ts', 'typings/**/*.ts'])
            .pipe($.sourcemaps.init())
            .pipe($.typescript({
                sortOutput: true,
                noExternalResolve: false,
                target: "ES5"
            }))
            .js
            .pipe($.concat('app.js'))
            .pipe($.sourcemaps.write())
            .pipe($.replace(/angular\.module\('nlp',\s*\[([^\]]*?)\]\)/, 'angular.module("nlp", [$1' + sectionModules + '])'))
            .pipe(gulp.dest(pkg.paths.build));
});

gulp.task('ts-lint', function () {
    return gulp.src(['src/**/*.ts']).pipe($.tslint()).pipe($.tslint.report('prose'));
});

gulp.task('config-js', function () {
    return gulp.src(['src/config/**/*.ts', 'typings/**/*.ts'])
            .pipe($.sourcemaps.init())
            .pipe($.typescript({
                sortOutput: true,
                noExternalResolve: true,
                target: "ES5"
            }))
            .js
            .pipe($.concat('config.js'))
			.pipe($.insert.append(buildConstantsModule(config)))
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest(pkg.paths.build));
});

gulp.task('templatecache', function () {
    return gulp
        .src('src/**/!(index)*.html')
		//.pipe($.debug())
		// append the APQC copyright message to all relevant templates
		//.pipe($.if(pkg.paths.apqcCopyrightAppendableFiles, $.insert.append('<div class="" data-ng-include="\'' + pkg.paths.apqcCopyrightFooterContent + '\'"></div>')))
        .pipe($.angularTemplatecache('templates.js', {
            module: 'nlp.templates',
            standalone: true,
            root: ''
        }))
        .pipe(gulp.dest(pkg.paths.build));
});

gulp.task('app-scss', function () {
    return gulp.src('src/app.scss')
        .pipe($.sourcemaps.init())
        // important to include both plumber and call gulp-sass in sync mode
        // see https://github.com/dlmanning/gulp-sass/issues/90#issuecomment-100021202
        // otherwise the watch task will not continue on SASS compile error
        .pipe($.plumber())
        .pipe($.sass.sync().on('error', $.sass.logError))
        .pipe($.autoprefixer({ browsers: ['last 2 versions', '> 5%'] }))
        .pipe($.concat('app.css'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(pkg.paths.build));
});

gulp.task('sass-lint', function () {
    return gulp.src('src/app.scss')
        .pipe($.scssLint({
            'config': '.scss-lint.yml'
        }));
});

gulp.task('assets', function () {
    return gulp.src('src/assets/**/*.*')
            .pipe(gulp.dest(pkg.paths.build + '/assets'));
});

gulp.task('partials', function () {
    return gulp.src('src/partials/**/*.*')
            .pipe(gulp.dest(pkg.paths.build + '/partials'));
});

gulp.task('vendor-js', function () {
    return gulp.src(pkg.paths.vendorjs)
		//.pipe($.debug())
            .pipe($.sourcemaps.init())
            .pipe($.concat('scripts.js'))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(pkg.paths.build + '/vendor'));
});

gulp.task('vendor-css', function () {
    return merge(
        gulp.src(pkg.paths.vendorcss)
            .pipe($.sourcemaps.init())
            .pipe($.concat('styles.css'))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(pkg.paths.build + '/vendor')),

        gulp.src((pkg.paths.fonts))
            .pipe(gulp.dest(pkg.paths.build + '/fonts'))
    );

});

gulp.task('vendor-images', function () {
    //$.util.log(pkg.paths.vendorimages);
    return merge(gulp.src(pkg.paths.vendorimages)
			//.pipe($.debug())
			.pipe(gulp.dest(pkg.paths.build + '/vendor')),
            gulp.src(pkg.paths.vendorimg)
			.pipe(gulp.dest(pkg.paths.build + '/img'))
	    );

});

gulp.task('section-scripts', function () {
    var streams = sections.map(compileSectionScripts);
    return merge.apply(this, streams);
});

function compileSectionScripts(section) {
    return gulp.src([section.dir + '**/module.ts', section.dir + '**/!(module)*.ts', 'typings/**/*.ts'])
        //.pipe($.debug())
        //.pipe($.sourcemaps.init())
        .pipe($.typescript({
            sortOutput: true,
            noExternalResolve: false,
            target: "ES5"
        }))
        .js
        .pipe($.concat('scripts.js'))
        //.pipe($.sourcemaps.write())
        .pipe(gulp.dest(pkg.paths.build + '/sections/' + section.section));
}

gulp.task('section-styles', function () {
    var streams = sections.map(function (section) {
        //$.util.log(section.section);
        return gulp.src(section.dir + '**/*.scss')
				//.pipe($.debug())
                .pipe($.sourcemaps.init())
                .pipe($.plumber())
                .pipe($.sass.sync().on('error', $.sass.logError))
                .pipe($.concat('styles.css'))
                .pipe($.sourcemaps.write('.'))
                .pipe(gulp.dest(pkg.paths.build + '/sections/' + section.section));
    });

    return merge.apply(this, streams);
});

gulp.task('sections', ['section-scripts', /*'section-templates',*/ 'section-styles']);

gulp.task('directive-scripts', function () {
    return gulp.src(['src/directives/**/!(module)*.ts', 'src/directives/**/module.ts', 'typings/**/*.ts'])
            .pipe($.sourcemaps.init())
            .pipe($.typescript({
                sortOutput: true,
                noExternalResolve: false,
                target: "ES5"
            }))
            .js
            .pipe($.concat('scripts.js'))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(pkg.paths.build + '/directives'));
});


gulp.task('directive-styles', function () {
    return gulp.src('src/directives/**/*.scss')
            .pipe($.sourcemaps.init())
            .pipe($.plumber())
            .pipe($.sass.sync().on('error', $.sass.logError))
            .pipe($.concat('styles.css'))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(pkg.paths.build + '/directives'));
});

gulp.task('directives', ['directive-scripts', /*'directive-templates',*/ 'directive-styles']);

gulp.task('services', function () {
    return gulp.src(['src/services/**/!(module)*.ts', 'src/services/**/module.ts', 'typings/**/*.ts'])
            .pipe($.sourcemaps.init())
            .pipe($.typescript({
                sortOutput: true,
                noExternalResolve: false,
                target: "ES5"
            }))
            .js
            .pipe($.concat('services.js'))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(pkg.paths.build));
});

gulp.task('data-services', function () {
    return gulp.src(['src/data-services/**/!(module)*.ts', 'src/data-services/**/module.ts', 'typings/**/*.ts'])
            .pipe($.sourcemaps.init())
            .pipe($.typescript({
                sortOutput: true,
                noExternalResolve: true,
                target: "ES5"
            }))
            .js
            .pipe($.concat('data-services.js'))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(pkg.paths.build));
});

gulp.task('index-html', [
    'app-ts',
    'config-js',
    'app-scss',
    'assets',
    'vendor-js',
    'vendor-css',
    'vendor-images',
    'sections',
    'directives',
    'services',
    'data-services',
    'templatecache'
], function () {
    return gulp.src('src/index.html')
            .pipe(gulp.dest(pkg.paths.build))
            .pipe($.htmlReplace({
                'sectionCSS':
                    sections
                    .filter(function (section) {
                        return fs.existsSync('build/sections/' + section.section + '/styles.css');
                    })
                    .map(function (section) {
                        return 'sections/' + section.section + '/styles.css?rev=@@hash';
                    }),
                'sectionJS':
                    sections
                    .filter(function (section) {
                        return fs.existsSync('build/sections/' + section.section + '/scripts.js');
                    })
                    .map(function (section) {
                        return 'sections/' + section.section + '/scripts.js?rev=@@hash';
                    })//,
                //'sectionTemplates':
                //    sections
                //    .filter(function (section) {
                //        return fs.existsSync('build/sections/' + section.section + '/templates.js');
                //    })
                //    .map(function (section) {
                //        return 'sections/' + section.section + '/templates.js?rev=@@hash';
                //    }),
            }))
            .pipe($.revAppend())
            .pipe(gulp.dest(pkg.paths.build));
});

gulp.task('index-html-light', ['app-ts', 'config-js', 'app-scss', 'assets', 'sections', 'directives', 'services', 'data-services', 'templatecache'], function () {
    return gulp.src('src/index.html')
            .pipe(gulp.dest(pkg.paths.build))
            .pipe($.htmlReplace({
                'sectionCSS':
                    sections
                    .filter(function (section) {
                        return fs.existsSync('build/sections/' + section.section + '/styles.css');
                    })
                    .map(function (section) {
                        return 'sections/' + section.section + '/styles.css?rev=@@hash';
                    }),
                'sectionJS':
                    sections
                    .filter(function (section) {
                        return fs.existsSync('build/sections/' + section.section + '/scripts.js');
                    })
                    .map(function (section) {
                        return 'sections/' + section.section + '/scripts.js?rev=@@hash';
                    })//,
                //'sectionTemplates':
                //    sections
                //    .filter(function (section) {
                //        return fs.existsSync('build/sections/' + section.section + '/templates.js');
                //    })
                //    .map(function (section) {
                //        return 'sections/' + section.section + '/templates.js?rev=@@hash';
                //    }),
            }))
            .pipe($.revAppend())
            .pipe(gulp.dest(pkg.paths.build));
});

gulp.task('clean', function () {
    del.sync(pkg.paths.build + '/**/*');
});

gulp.task('lint', ['ts-lint', 'sass-lint']);

gulp.task('default', ['ts-lint', 'set-config', 'partials', 'index-html']);

gulp.task('default-dev', ['partials', 'index-html-light']);

function getSections() {
    var dirs = glob.sync('src/sections/*/');
    var sections =
        dirs.map(function (dir) {
            return {
                dir: dir,
                section: dir.replace(/src\/sections\/([^/]*?)\//, '$1')
            };
        });

    return sections;
}

function buildConstantsModule(data) {

    //var data = file.isNull() ? {} : JSON.parse(file.contents);

    var template =
	'angular.module("<%- moduleName %>") ' +
					'<% constants.forEach(function(constant) { %> ' +
					'.constant("<%- constant.name %>", <%= constant.value %>) ' +
					'	<% }) %> ' +
					';';

    var result = _.template(template, {
        moduleName: data.module,
        constants: getConstants(data)
    });

    return result;
}

function getConstants(data) {
    var dataCnst = data.constants || data;
    var input = dataCnst;
    var constants = _.map(input, function (value, name) {
        return {
            name: name,
            value: stringify(value, '\t')
        };
    });


    return constants;
}

function stringify(value, space) {
    return _.isUndefined(value) ? 'undefined' : JSON.stringify(value, null, space);
}