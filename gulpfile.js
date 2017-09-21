const gulp = require("gulp"),
sass = require("gulp-sass"),
babel = require("gulp-babel"),
autoprefixer = require("gulp-autoprefixer"),
cleanCSS = require('gulp-clean-css'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
browserSync = require('browser-sync'),
php  = require('gulp-connect-php')

//Definicion de Tareas
gulp.task("CompileSass", ()=>
    //Input
    gulp.src("./sass/**/*.scss")
        .pipe(sass({
            outputStyle: "expanded"
        }))
        .pipe(autoprefixer({
            versions: ['last 2 browsers']
        }))
        .pipe(gulp.dest("./css"))
    //Output
);

gulp.task("minifycss", () => {
    gulp.src(["./css/**/*.css", "!./css/**/*.min.css"])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("./css"))
        .pipe(browserSync.stream());
});

gulp.task("minifyjs", () => {
    gulp.src(["./js/**/*.js","!./js/**/*.min.js"])
        .pipe(babel())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("./js"))
        .pipe(browserSync.stream());
});

gulp.task('php', function() {
    php.server({ base: 'ControlGastos', port: 8010, keepalive: true});
});

gulp.task("serve",['php'],()=>{
    browserSync({
        proxy: "127.0.0.1:8010",
        port: 8010,
        open: true,
        notify: false
    });

    gulp.watch("./*.php").on('change', browserSync.reload);
});

gulp.task("default",["CompileSass","minifycss","minifyjs","serve"],()=>{
    gulp.watch("./sass/**/*.scss",["CompileSass"]);
    gulp.watch(["./css/**/*.css", "!./css/**/*.min.css"],["minifycss"]);
    gulp.watch(["./js/**/*.js","!./js/**/*.min.js"],["minifyjs"]);
});