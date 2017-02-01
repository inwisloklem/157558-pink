"use strict";

var gulp = require("gulp");

var inject = require("gulp-inject");
var less = require("gulp-less");
var lessPluginGlob = require("less-plugin-glob");
var plumber = require("gulp-plumber");
var prettify = require("gulp-html-prettify");
var pug = require("gulp-pug");
var rename = require("gulp-rename");
var server = require("browser-sync").create();
var svgmin = require("gulp-svgmin");
var svgstore  = require("gulp-svgstore");

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
      indent_char: " ",
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

gulp.task("inject-svg", function() {
  var svgs = gulp
    .src("img/icons/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}));

  function fileContents(filePath, file) {
    return file.contents.toString();
  }

  return gulp
    .src("pug/index.pug")
    .pipe(inject(svgs, {transform: fileContents}))
    .pipe(gulp.dest("pug"));
});
