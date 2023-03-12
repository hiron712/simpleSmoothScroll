const gulp = require('gulp'); //タスクランナー

const sass = require('gulp-dart-sass');//SCSS変換用

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require("gulp-uglify-es").default;

const postcss = require("gulp-postcss");
const autoprefixer = require('autoprefixer');
const cssSorter = require('css-declaration-sorter');
const mqpacker = require("css-mqpacker");

const plumber = require("gulp-plumber");
const glob = require("glob");

const plugin = [
    autoprefixer({
        cascade: false
    }),
    cssSorter({
        order: 'smacss'
    }),
    mqpacker()
];

/*-------------------------------------------------
--------------------------------------------------*/
gulp.task('scss', function(){
    //ここからタスクの内容
    return gulp.src('htdocs/assets/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(postcss(plugin))
        .pipe(gulp.dest('htdocs/assets/css/'));
});

/*-------------------------------------------------
--------------------------------------------------*/
gulp.task('babel', function() {
    let scriptFiles = glob.sync('htdocs/assets/script/**/*.js', '!./htdocs/assets/script/**/_*.js');
    return browserify({
        entries: scriptFiles
    })
        .transform(babelify, {
            global: true,
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
        })
        .bundle()
        .pipe(source('script.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(plumber())
        .pipe(gulp.dest('htdocs/assets/js'));
});
/*-------------------------------------------------
--------------------------------------------------*/
gulp.task('watch', function(){
    gulp.watch( 'htdocs/assets/sass/**/*.scss', gulp.task('scss'));
    gulp.watch( 'htdocs/assets/script/**/*.js', gulp.task('babel'));
});
