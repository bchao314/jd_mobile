/**
 * Created by zc on 2016/9/6.
 */
var gulp=require("gulp")
var cssnano=require("gulp-cssnano")
var jsmin=require("gulp-uglify")
var picmin=require("gulp-imagemin")
var html=require("gulp-htmlmin")

gulp.task("cssmin", function () {
    gulp.src("css/*.css")
        .pipe(cssnano())
        .pipe(gulp.dest("cssmin"))
})
gulp.task("jsmin", function () {
    gulp.src("js/*.js")
        .pipe(jsmin())
        .pipe(gulp.dest("jsmin"))
})
gulp.task("picmin", function () {
    gulp.src("images/*.*")
        .pipe(picmin())
        .pipe(gulp.dest("imagesmin"))
})
gulp.task("html", function () {
    gulp.src("index.html")
        .pipe(html({collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest("jsmin"))
})