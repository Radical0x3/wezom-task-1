const { src, dest } = require("gulp");
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const del = require("del");
const scss = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const group_media = require("gulp-group-css-media-queries");
const clean_css = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const webphtml = require("gulp-webp-html");
const webpcss = require("gulp-webpcss");
const svgSprite = require("gulp-svg-sprite");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const fonter = require("gulp-fonter");
const htmlmin = require("gulp-htmlmin");
const svgmin = require("gulp-svgmin");

const project_folder = "dist";
const source_folder = "src";
const fs = require("fs");

const path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css",
    img: project_folder + "/img",
    fonts: project_folder + "/fonts",
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/scss/*.scss",
    img: source_folder + "/img/**/*.+(jpg|png|svg|gif|ico|webp)",
    fonts: source_folder + "/fonts/*.ttf",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss" + "",
    img: source_folder + "/img/**/*.+(jpg|png|svg|gif|ico|webp)",
  },
  clean: "./" + project_folder + "/",
};

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/",
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded",
      })
    )
    .pipe(group_media())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true,
      })
    )
    .pipe(
      webpcss({
        webpClass: ".webp",
        noWebpClass: ".no-webp",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function images() {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 75,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3, //0 to 7
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function fonts() {
  src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
  return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
}

gulp.task("svgSprite", function () {
  return gulp
    .src([source_folder + "/iconsprite/*.svg"])
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../icons/icons.svg",
            // example: true
          },
        },
      })
    )
    .pipe(svgmin())
    .pipe(dest(path.build.img));
});

gulp.task("otf2ttf", function () {
  return src([source_folder + "/fonts/*.otf"])
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
    .pipe(dest(source_folder + "/fonts/"));
});

function cb() {}

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.img], images);
}

function clean(params) {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, html, images, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.images = images;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;
exports.default = watch;
