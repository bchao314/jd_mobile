/**
 * Created by zc on 2016/9/6.
 */
var gulp=require("gulp")
var html=require("gulp-htmlmin")

gulp.task("html",function(){
    gulp.src("index.html")
        .pipe(html({collapseWhitespace: true
            ,
            removeComments: true
        }))
        .pipe(gulp.dest("js"))

})