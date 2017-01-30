"use strict";

var gulp = require("gulp");

var less = require("gulp-less");
var lessPluginGlob = require("less-plugin-glob");
var plumber = require("gulp-plumber");
var prettify = require("gulp-html-prettify");
var pug = require("gulp-pug");
var server = require("browser-sync").create();

gulp.task("serve", ["markup", "style"], function() {
  server.init({
    server: ".",
    notify: false,
    ui: false
  });

  gulp.watch("pug/**/*.pug", ["markup"]);
  gulp.watch("less/**/*.less", ["style"]);

  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("markup", function() {
  gulp.src("pug/**/*.pug")
    .pipe(plumber())
    .pipe(pug())
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2
    }))
    .pipe(gulp.dest("."))
    .pipe(server.stream());
});

gulp.task("style", function() {
  gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less({
        plugins: [lessPluginGlob]
      }))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});
