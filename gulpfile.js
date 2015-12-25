/*
创建Gulp配置文件
 */

//引入 gulp
var gulp = require('gulp');

//引入功能组件

var compass = require('gulp-compass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var jshint = require('gulp-jshint');

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');


var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');

// 图像处理

var imagemin = require('gulp-imagemin'); //十分大
var pngquant = require('imagemin-pngquant');
var spritesmith = require('gulp.spritesmith');
var imageResize = require('gulp-image-resize');


// 错误处理
var plumber = require("gulp-plumber");
var stylish = require("jshint-stylish");

// 开发辅助
var pkg = require('./package.json'); //获得配置文件中相关信息
var chalk = require('chalk'); //美化日志
var dateFormat = require('dateformat'); //获得自然时间
var csscomb = require('gulp-csscomb'); //CSS规范排序

// 打包发布
var zip = require('gulp-zip');
var ftp = require('gulp-ftp');


// 设置相关路径
var paths = {
    assets: 'assets',
    sass: 'dev/css/sass/**/*',
    css: 'dev/css',
    js: 'dev/js/**/*', //js文件相关目录
    img: 'dev/img/**/*', //图片相关
};

gulp.task('clean', function(cb) {
    del(['build'], cb);
});



// Sass 处理
gulp.task('sass', function() {
    gulp.src(paths.sass)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(paths.css))
        .pipe(minifycss())
        .pipe(sourcemaps.write({
            sourceRoot: '/css/sass'
        }))
        .pipe(rename('dev.min.css'))
        .pipe(gulp.dest('assets/css'));

    gulp.src(paths.sass)
        .pipe(plumber())
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(csscomb())
        .pipe(rename('uncompressed.css'))
        .pipe(gulp.dest('assets/css'))
        .pipe(gulp.dest(paths.css))
        .pipe(minifycss())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest('assets/css'));

});




// JS检查
gulp.task('lint', function() {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('scripts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    gulp.src(paths.js)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(uglify({
            compress: {
                drop_console: true
            }
        }))
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('assets/js'))
        .pipe(rename('dev.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets/js'));

});



// 处理图像
gulp.task('image', function() {
    return gulp.src(paths.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('assets/images'));
});


/**
 * 自动生成@2x图片精灵
 * $ gulp sprite
 * algorithm排列有top-down,left-right,diagonal,alt-diagonal,binary-tree五种方式，根据需求选择
 * 参考:https://github.com/Ensighten/spritesmith#algorithms
 * 此task生成的为@2x的高清图
 */


gulp.task('retinasprite', function(cb) {
    del(['dev/img/*.png'], function() {
        console.log(chalk.red('[清理] 删除旧有精灵'))
    });
    var spriteData = gulp.src('dev/sprites/*.png').pipe(spritesmith({
        imgName: 'sprite@2x.png',
        cssName: '_sprite.scss',
        algorithm: 'binary-tree',
        padding: 10 //建议留白10像素
    }));
    spriteData.img.pipe(gulp.dest('dev/img/')); // 输出合成图片
    spriteData.css.pipe(gulp.dest('dev/css/sass/')).on('end', cb)
    console.log(chalk.green('[缩略] 生成高清图'))
});


/**
 * 自动生成@1x图片精灵
 * 在retinasprite执行后自动生成标清精灵
 */

gulp.task('standardsprite', ['retinasprite'], function(cb) {
    console.log(chalk.green('[缩略] 生成标清图'))
    gulp.src('dev/img/sprite@2x.png').pipe(imageResize({
            width: '50%'
        }))
        .pipe(rename('sprite.png'))
        .pipe(gulp.dest('dev/img/')).on('end', cb)

})
gulp.task('sprite2assets', ['retinasprite', 'standardsprite'], function() {
    console.log(chalk.green('[转移] 复制精灵图到资源目录'))
    gulp.src('dev/img/*.png').pipe(gulp.dest('assets/images/'))
})

/**
 * 文件变更监听
 * $ gulp watch
 */

gulp.task('watch', function() {
    console.log(chalk.green('[监听] 启动gulp watch自动编译'))
    gulp.watch(paths.js, ['scripts']);
    gulp.watch(paths.sass, ['sass']);
});

/**
 * 生成最终交付文件夹
 * $ gulp build
 *
 */
gulp.task('build', function() {
    del(['build'], function() {
        console.log(chalk.red('[清理] 删除旧有build文件夹'))
    });
    gulp.src('*.html').pipe(gulp.dest('build'))
    gulp.src('assets/**/!(*dev*)*').pipe(gulp.dest('build/assets'))
});


/**
 * 压缩最终的文件
 * 自动增加当前时间戳 + 项目名称
 * $ gulp zip
 */

gulp.task('zip', function() {
    var now = new Date();
    del(['zipped/*.zip'], function() {
        console.log(chalk.red('[清理] 删除旧有压缩包'))
    });
    console.log(chalk.red('[压缩] 打包最终文件'))
    gulp.src('build/**/*')
        .pipe(zip(dateFormat(now, 'yyyy-mmmm-dS-h-MMTT') + '-' + pkg.name + '.zip'))
        .pipe(gulp.dest('zipped/'))
});


gulp.task('ftp', function() {
    console.log(chalk.red('[发布] 上传到内网服务器'))
    gulp.src('build/**/*')
        .pipe(ftp({
            host: '10.97.19.100',
            user: 'ftp',
            pass: '123456',
            remotePath: pkg.name
        }))
        .pipe(gutil.noop());
});




gulp.task('sprite', ['retinasprite', 'standardsprite', 'sprite2assets']);
gulp.task('default', ['watch', 'scripts']);
gulp.task('watch:base', ['watch']);
