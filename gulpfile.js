"use strict";

var gulp = require("gulp");

var autoprefixer = require("gulp-autoprefixer");
var cssmin = require("gulp-csso");
var del = require("del");
var imagemin = require("gulp-imagemin");
var inject = require("gulp-inject");
var less = require("gulp-less");
var lessPluginGlob = require("less-plugin-glob");
var plumber = require("gulp-plumber");
var prettify = require("gulp-html-prettify");
var pug = require("gulp-pug");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var run = require("run-sequence");
var server = require("browser-sync").create();
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");

gulp.task("clean", function() {
  return del("dist");
});

gulp.task("copy", function() {
  return gulp.src([
    "fonts/*.{woff,woff2}",
    "js/**",
    "*.html",
    "*.png"
  ], {base: "."})
  .pipe(gulp.dest("dist"));
});

gulp.task("cssmin", function() {
  return gulp.src("css/style.css")
    .pipe(cssmin())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("dist", function(fn) {
  run(
    "clean",
    "inject-svg",
    "markup",
    "style",
    "cssmin",
    "replace-css",
    "imagemin",
    "svgmin",
    "copy",
    fn
  );
});

gulp.task("imagemin", function() {
  return gulp.src("img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("dist/img"));
});

gulp.task("inject-svg", function() {
  var svgs = gulp
    .src("img/icons/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}));

  function fileContents(filePath, file) {
    return file.contents.toString();
  }

  return gulp.src("pug/index.pug")
    .pipe(inject(svgs, {transform: fileContents}))
    .pipe(gulp.dest("pug"));
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

gulp.task("replace-css", function() {
  gulp.src("dist/index.html")
  .pipe(replace("style.css", "style.min.css"))
  .pipe(gulp.dest("dist"));
});

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

gulp.task("style", function() {
  gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less({
      plugins: [lessPluginGlob]
    }))
    .pipe(autoprefixer({
      browsers: ["last 2 versions"]
    }))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("svgmin", function() {
  return gulp.src("img/**/*.svg")
  .pipe(svgmin())
  .pipe(gulp.dest("dist/img"));
});
