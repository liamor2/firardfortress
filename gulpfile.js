import gulp from "gulp";
import ts from "gulp-typescript";
import * as sass from "sass";
import gulpSass from "gulp-sass";
import concat from "gulp-concat";
import replace from "gulp-replace";
import eslint from "gulp-eslint-new";
import prettier from "gulp-prettier";
import gulpif from "gulp-if";

const sassCompiler = gulpSass(sass);
const tsProject = ts.createProject("tsconfig.json");

// Linting task
gulp.task("lint", () => {
  return gulp
    .src(["src/**/*.ts", "!node_modules/**"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// Formatting task
gulp.task("format", () => {
  return gulp
    .src(["src/**/*.{ts,scss}", "!node_modules/**"])
    .pipe(prettier())
    .pipe(gulp.dest((file) => file.base));
});

// TypeScript compilation with linting
gulp.task("ts", () => {
  return tsProject
    .src()
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpif(!process.env.WATCH, eslint.failAfterError()))
    .pipe(tsProject())
    .js.pipe(replace(/(export\s+\*\s+from\s+['"].*?)(["'])/g, "$1.js$2"))
    .pipe(
      replace(
        /(import\s+.*\s+from\s+['"])@app\/(.*?)(['"])/g,
        "$1/systems/firardfortressdev/dist/$2/index.js$3"
      )
    )
    .pipe(prettier())
    .pipe(gulp.dest("dist"));
});

// Sass compilation
gulp.task("sass", () => {
  return gulp
    .src("templates/**/*.scss")
    .pipe(sassCompiler().on("error", sassCompiler.logError))
    .pipe(concat("firardFortressStyles.css"))
    .pipe(gulp.dest("dist"));
});

// Watch with linting
gulp.task("watch", () => {
  process.env.WATCH = "true";
  gulp.watch(["src/**/*.ts"], gulp.series("ts"));
  gulp.watch(["templates/**/*.scss"], gulp.series("sass"));
});

// Build task
gulp.task("build", gulp.series("lint", "format", "ts", "sass"));

// Development task
gulp.task("dev", gulp.series("build", "watch"));

// Default task
gulp.task("default", gulp.series("dev"));
