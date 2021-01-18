import gulp from 'gulp'
import babel from 'gulp-babel'
import rename from 'gulp-rename'

import browserify from 'browserify'
import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'
import terser from 'gulp-terser'

gulp.task('build:bundled:min', function bundledMin () {
  return buildBundle(bundledConfig, '.bundle.min.js', true)
})

gulp.task('build:external:min', function () {
  return buildBundle(externalConfig, '.min.js', true)
})

gulp.task('build:bundled:debug', function () {
  return buildBundle(bundledConfig, '.bundle.js', false)
})

gulp.task('build:external:debug', function () {
  return buildBundle(externalConfig, '.js', false)
})

gulp.task('build:components', function () {
  return gulp.src('src/**')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/components'))
})

const bundledConfig = {
  debug: true,
  entries: 'src/starling.js',
  standalone: 'starling'
}
const externalConfig = {
  debug: true,
  entries: 'src/starling.js',
  standalone: 'starling',
  external: [
    'axios',
    'js-base64',
    'es6-promise',
    'debug'
  ],
  bundleExternal: false
}

function buildBundle (options, extname, minify) {
  let stream = browserify(options)
    .transform('babelify')
    .bundle()
    .pipe(source('starling.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))

  if (minify) {
    stream = stream.pipe(terser())
  }

  return stream.pipe(rename({ extname }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
}

gulp.task('build', gulp.series(
  'build:bundled:min',
  'build:external:min',
  'build:bundled:debug',
  'build:external:debug',
  'build:components'
))
