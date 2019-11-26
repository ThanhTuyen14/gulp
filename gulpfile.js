const gulp  = require('gulp'),
jshint = require('gulp-jshint'),
sass   = require('gulp-sass'),
concat = require('gulp-concat'),
minify = require('gulp-minify'),
cleanCss = require('gulp-clean-css'),
pug = require('gulp-pug'),
htmlmin = require('gulp-htmlmin'),
image = require('gulp-image'),
clean = require('gulp-clean'),
webpack = require('webpack-stream'),
browserSync = require('browser-sync').create();

const _paths = {
    public: 'public/',
    pug: 'template/**/*.pug',
    scss: 'template/assets/scss/**/*.scss',
    js: 'template/assets/js/**/*.js',
    images: 'template/assets/images/*',
    data: 'template/data/*.json'
};

const reloadBrowserServer = (done) => {
    browserSync.reload();
    done();
}

const browserSever = (done) => {
    browserSync.init({
        server: {
            baseDir: _paths.public
        },
        port: 3000
    })
    done();
}

const pugHtml = () => {
    return gulp
        .src(_paths.pug)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(_paths.public + 'html'));
}

const img = () => {
    gulp
        .src(_paths.images)
        .pipe(image({ }))
        .pipe(gulp.dest(_paths.public + 'assets/images'));
}

const minJs = () => {
    return gulp
        .src([
            _paths.js
        ])
        .pipe(webpack({
            mode: 'development'
        }))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat('main.js'))
        .pipe(minify({
            ext:{
                min:'.js'
            },
            noSource: true
        }))
        .pipe(gulp.dest(_paths.public + 'assets/js'));
}

const minCss = () => {
    return gulp
        .src(_paths.scss)
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest(_paths.public + 'assets/css'));

}

const minHtml = () => {
    return gulp
        .src(_paths.public + 'html/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(_paths.public));
}

const copyData = () => {
    return gulp
        .src(_paths.data)
        .pipe(gulp.dest(_paths.public + 'data'));
}

const watchFuction = () => {
    gulp.watch(_paths.js , gulp.series(minJs));
    gulp.watch(_paths.scss, gulp.series(minCss));
    gulp.watch(_paths.pug, gulp.series(pugHtml, minHtml));
    gulp.watch(_paths.pug, gulp.series(img));
    gulp.watch(_paths.pug, gulp.series(copyData));
    gulp.watch(_paths.public, reloadBrowserServer);
}

const cleanFolder = () => {
    return gulp
        .src(_paths.public, {read: false})
        .pipe(clean());
}

exports.watch = gulp.series(browserSever, watchFuction);
exports.clean = cleanFolder;
exports.build = gulp.series(minJs, minCss, pugHtml, minHtml, img);

