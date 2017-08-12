const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");

const path = require("path");
const runSequence = require("run-sequence");

const { exec } = require("child_process");

const paths = {
  scripts: [path.join("*.js"), path.join("**", "*.js")],
  stylesheets: [
    path.join("stylesheets", "*.scss"),
    path.join("stylesheets", "**", "*.scss")
  ],
  sassSrc: [path.join("stylesheets", "pages", "*.scss")],
  views: [path.join("views", "*.pug"), path.join("views", "**", "*.pug")],
  server: ["server.js"]
};

gulp.task("default", () => {
  runSequence(["sass"], ["run"], ["watch"]);
});

gulp.task("sass", () => {
  return gulp
    .src(paths.sassSrc)
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(path.join("public", "css")));
});

gulp.task('run', () => {
  exec('node ' + paths.server[0], { stdio: 'inherit' });
});

gulp.task("watch", () => {
  // gulp.watch(paths.scripts, ["run"]);
  gulp.watch(paths.views);
  gulp.watch(paths.stylesheets, ["sass"]).on("change", function(event) {
    console.log(event);
  });
});
