const{src,dest,watch,parallel} = require("gulp");
//css
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const cssnano = require("cssnano");
const autoprefixeer = require("autoprefixer");
const postcss = require("gulp-postcss");
const sourceMaps = require("gulp-sourcemaps");
//imagenes
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const avif = require('gulp-avif');
const webp = require("gulp-webp");
//Javascript
const terser = require("gulp-terser-js");

function css(done){
    src('src/scss/**/*.scss') //identificar el archivo SASS
    .pipe(sourceMaps.init())
    .pipe(plumber())
    .pipe(sass()) //Compilarlo
    .pipe(postcss([autoprefixeer(), cssnano()]))
    .pipe(sourceMaps.write('.'))
    .pipe(dest('build/css'))//Almacenarlo en el disco duro

    done(); //callback avisa a gulp cuando llegamos al final
}
function imagenes(done){
    const opciones ={
        optimizationlevel: 3
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(cache(imagemin(opciones)))
    .pipe(dest('build/img'))

    done();
}

function versionwebp(done){
    const opciones ={
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(webp(opciones))
    .pipe(dest('build/img'))

    done();
}
function versionavif(done){
    const opciones ={
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones))
    .pipe(dest('build/img'))

    done();
}
function javascript(done){
    src('src/js/**/*.js')
    .pipe(sourceMaps.init())
    .pipe( terser() )
    .pipe(sourceMaps.write('.'))
    .pipe(dest('build/js'));

    done();
}

function dev(done){ 
    watch('src/scss/**/*.scss',css); 
    watch('src/js/**/*.js',javascript); 
    done();
}


exports.css = css;
exports.imagenes = imagenes;
exports.js= javascript;
exports.versionwebp = versionwebp
exports.versionavif = versionavif
exports.dev = parallel(imagenes,versionwebp,versionavif,javascript,dev);