const gulp = require('gulp'),
  babel = require('gulp-babel'),
  browserSync = require('browser-sync').create(),
  cleanCSS = require('gulp-clean-css'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  plumber = require('gulp-plumber'),
  autoprefixer = require('gulp-autoprefixer'),
  spritesmith = require('gulp.spritesmith'),
  watch = require('gulp-watch');

const path = {
  build: {
    root: 'build/',
    css: 'build/css/',
    js: 'build/js/',
    img: 'build/img/',
    sprite: 'build/sprite/',
  },
  src: {
    sass: 'src/sass/*.scss',
    js: 'src/js/*.js',
    img: 'src/img/*.*',
    sprite: 'src/sprite/*.*',
  },
  watch: {
    sass: 'src/sass/*.scss',
    js: 'src/js/*.js',
    img: 'src/img/*.*',
    sprite: 'src/sprite/*.*',
  }
};

//CSS
gulp.task('sass', function() {
  return gulp.src(path.src.sass)
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
});

//JS
gulp.task('js', function() {
  return gulp.src(path.src.js)
    .pipe(plumber())
    .pipe(concat('main.min.js'))
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());;
});

//images
gulp.task('image', function() {
  return gulp.src(path.src.img)
    .pipe(plumber())
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img));
});

//sprites
gulp.task('sprite', function () {
  const spriteData = gulp.src(path.src.sprite)
    .pipe(plumber())
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css',
    }));
  spriteData.img.pipe(gulp.dest(path.build.sprite)); 
  spriteData.css.pipe(gulp.dest(path.build.sprite));
});

gulp.task('build', ['sass','js','image','sprite']);

gulp.task('serve', ['sass', 'js', 'image', 'sprite'], function() {
  browserSync.init({
    server: "./"
  });

  gulp.watch(path.src.sass, ['sass']);
  gulp.watch(path.src.js, ['js']);
  gulp.watch(path.src.img, ['image']);
  gulp.watch(path.src.sprite, ['sprite']);
  gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);