/**
 * Created by zc on 2016/9/6.
 */
var gulp=require("gulp")
var html=require("gulp-htmlmin")
var jsmin=require("gulp-uglify")
var pics=require("gulp-imagemin")
var cssmin=require("gulp-clean-css")

gulp.task("html",function(){
    gulp.src("index.html")
        .pipe(html({collapseWhitespace: true
            ,
            removeComments: true
        }))
        .pipe(gulp.dest("js"))

})
gulp.task("jsmin",function(){
    gulp.src("js/*.js")
        .pipe(jsmin())
        .pipe(gulp.dest("jsmin"))

})
gulp.task("pics",function(){
    gulp.src("images/*.*")
        .pipe(pics())
        .pipe(gulp.dest("imagesmin"))

})
gulp.task("cssmin",function() {
    gulp.src("css/*.css")
        .pipe(cssmin())
        .pipe(gulp.dest("cssmin")
    )})