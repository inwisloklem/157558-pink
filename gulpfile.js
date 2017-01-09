"use strict";

var gulp = require("gulp");

var jade = require("gulp-jade");
var plumber = require("gulp-plumber");
var prettify = require("gulp-html-prettify");
var less = require("gulp-less");
var server = require("browser-sync").create();

gulp.task("serve", ["markup", "style"], function() {
  server.init({
    server: ".",
    notify: false,
    ui: false
  });

  gulp.watch("jade/**/*.jade", ["markup"]);
  gulp.watch("sass/**/*.less", ["style"]);

  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("markup", function() {
  gulp.src("jade/**/*.jade")
    .pipe(plumber())
    .pipe(jade())
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2
    }))
    .pipe(gulp.dest("."))
    .pipe(server.stream());
});

gulp.task("style", function() {
  gulp.src("sass/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});
