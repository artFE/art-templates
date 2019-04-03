var gulp = require('gulp');
var path = require('path');
var fs = require('fs');

// Plugins
var uglify = require('gulp-uglify');
var wrapper = require('gulp-wrapper');
var replace = require('gulp-replace');
var watch = require("gulp-watch");
var browserSync = require('browser-sync');
// seajs transport
var transport = require("gulp-seajs-transport");
// Autoprefixer
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
// ftp
var ftp = require("vinyl-ftp");
var gutil = require("gulp-util");
var gulpSequence = require('gulp-sequence');  //管理任务队列，可以保证前一个task执行完成再执行下一个

/**
 * [projectConfig 项目设置]
 */
var projectConfig = require("./config.json");

/**
 * [projectUtil 工具类]
 */
var projectUtil = {
	// 格式化路径
	fomartPath: function (pathStr) {
		return pathStr.replace(/\\/g, '\/');
	},
	// 获取当前目录
	getCurrentDir: function () {
		return fs.realpathSync('./');
	},
	// 获取当前时间
	getNowDate: function () {
		var nowDate = new Date();
		now = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate() + ' ' + nowDate.getHours() + ':' + nowDate.getMinutes() + ':' + nowDate.getMinutes();
		return now;
	},
	// 删除文件夹
	deleteDir: function (path) {
		var _this = this;
		var files = [];
		if (fs.existsSync(path)) {
			files = fs.readdirSync(path);
			files.forEach(function (file, index) {
				var curPath = path + "/" + file;
				if (fs.statSync(curPath).isDirectory()) { // recurse
					_this.deleteDir(curPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	},
	// 部署到Demo
	deployToDemo: function () {
		var connect = ftp.create({
			host: projectConfig.host,
			user: projectConfig.user,
			password: projectConfig.pwd,
			parallel: 10,   // 并行数
			log: gutil.log  // 打印日志，依赖gulp-util包
		});
		var path = projectConfig.demoPath + projectConfig.path;
		var rmPath = path.replace(/^var\/www\//gm, '');  // 删除路径
		connect.rmdir(rmPath, function () {
			gutil.log("[上传准备] 旧文件删除成功");
			setTimeout(function () {
				gulp.src(['build/**/*.*'], {base: 'build', buffer: true})
					.pipe(connect.dest(path))
					.on("error", function (err) {
						gutil.log("[上传中]上传错误" + err);
					}).on("end", function () {
					gutil.log("[上传完成]发布完成")
				})
			}, 10)
		})
	},
	// 部署到线上
	deployToCDN: function () {
		var connect = ftp.create({
			host: projectConfig.host,
			user: projectConfig.user,
			password: projectConfig.pwd,
			parallel: 10,   // 并行数
			log: gutil.log  // 打印日志，依赖gulp-util包
		});
		var path = projectConfig.cdnPath + projectConfig.path;
		var rmPath = path.replace(/^var\/www\//gm, '');  // 删除路径
		connect.rmdir(rmPath, function () {
			gutil.log("[上传准备] 旧文件删除成功");
			setTimeout(function () {
				gulp.src(['build/**/*.*'], {base: 'build', buffer: true})
					.pipe(connect.dest(path))
					.on("error", function (err) {
						gutil.log("[上传中]上传错误" + err);
					}).on("end", function () {
					gutil.log("[上传完成]发布完成")
				})
			}, 10)
		})
	},
};

/**
 * 单步任务
 */
// 通过ftp发布到服务器
gulp.task('ftpToDemo', function () {
	projectUtil.deployToDemo();
});
gulp.task('ftpToCDN', function () {
	projectUtil.deployToCDN();
});

// css
gulp.task('css', function () {
	gulp.src([
		'css/**/*.css',
		'!css/_gaga_temp/**',
		'!css/**/*.min.css'
	])
		.pipe(postcss([
			autoprefixer({
				browsers: ['Android >= 4', 'iOS >= 6']
			})
		]))
		.pipe(wrapper({
			header: '/* @update: ' + projectUtil.getNowDate() + ' */ \n'
		}))
		.pipe(gulp.dest('build/css'))
});

// uglify javascript
gulp.task('js', function () {
	gulp.src([
		'js/**/*.js',
		'!js/modules/**/*.*',
		'!js/config.js'
	])
		.pipe(replace(/msinner/g, "ms"))
		.pipe(replace(/debugTag/g, ""))
		.pipe(uglify({
			mangle: {
				reserved: ['jQuery', '$', 'require']
			},
			output: {
				ascii_only: true
			}
		}))
		.pipe(wrapper({
			header: '/* @update: ' + projectUtil.getNowDate() + ' */ \n'
		}))
		.pipe(gulp.dest('build/js'))
});

gulp.task('js-m', function () {
	gulp.src([
		'js/**/*.js',
		'!js/modules/**/*.*',
		'!js/config.js'
	])
		.pipe(wrapper({
			header: '/* @update: ' + projectUtil.getNowDate() + ' */ \n'
		}))
		.pipe(gulp.dest('build/js'))
});

// html
gulp.task('html', function () {
	gulp.src([
		'**/*.html',
		'!node_modules/**/*.*',
		'!template/**/*.*',
		'!tpl/**/*.*'
	])
		.pipe(gulp.dest('build'))
});

gulp.task('html-m', function () {
	gulp.src([
		'**/*.html',
		'!node_modules/**/*.*',
		'!template/**/*.*',
		'!tpl/**/*.*'
	])
		.pipe(gulp.dest('build'))
});

//移动文件
gulp.task('moveFiles', function () {
	gulp.src([
		'css/img/**/*.png',
		'css/img/**/*.jpg',
		'css/img/**/*.gif',
		'css/img/slice/**/*.*'
	])
		.pipe(gulp.dest('build/css/img'));
	gulp.src([
		'css/fonts/*'
	])
		.pipe(gulp.dest('build/css/fonts'));
	gulp.src([
		'css/sprite/**/*.png',
		'css/sprite/**/*.jpg',
		'css/sprite/**/*.gif'
	])
		.pipe(gulp.dest('build/css/sprite'));
	gulp.src([
		'images/**/*.*'
	])
		.pipe(gulp.dest('build/images'));
	gulp.src([
		'data/**/*.*'
	])
		.pipe(gulp.dest('build/data'));
});


// 删除build 文件夹
gulp.task('deleteBuild', function () {
	projectUtil.deleteDir('build');
});

// task build 打包流程
gulp.task('build', function () {
	gulp.run(['deleteBuild', 'trans', 'css', 'js', 'moveFiles', 'html']);
});

// task build-m 打包流程
gulp.task('build-m', function () {
	gulp.run(['deleteBuild', 'trans', 'css', 'js-m', 'moveFiles', 'html-m']);
});

// 压缩并部署到demo服务器
gulp.task('builddemo', function () {
	gulpSequence(['deleteBuild', 'trans', 'css', 'js', 'moveFiles', 'html'], 'ftpToDemo', function () {
		gutil.log("[上传准备] 开始上传")
	})
});
// 不压缩并部署到demo服务器
gulp.task('buildmdemo', function () {
	gulpSequence(['deleteBuild', 'trans', 'css', 'js-m', 'moveFiles', 'html-m'], 'ftpToDemo', function () {
		gutil.log("[上传准备] 开始上传")
	})
});
// 压缩并部署到cdn服务器
gulp.task('buildcdn', function () {
	gulpSequence(['deleteBuild', 'trans', 'css', 'js', 'moveFiles', 'html'], 'ftpToCDN', function () {
		gutil.log("[上传准备] 开始上传")
	})
});
// 不压缩并部署到cdn服务器
gulp.task('buildmcdn', function () {
	gulpSequence(['deleteBuild', 'trans', 'css', 'js-m', 'moveFiles', 'html-m'], 'ftpToCDN', function () {
		gutil.log("[上传准备] 开始上传")
	})
});

gulp.task('trans', function () {
	gulp.src("js/modules/**/*.js")
		.pipe(transport())
		.pipe(replace(/define\(\"/g, 'define("dist/'))
		.pipe(gulp.dest("js/dist"))
})

// Static server
gulp.task('server', function () {
	var files = [
		'html/**/*.html',
		'html/**/*.htm',
		'css/**/*.css',
		'css/img/*.*',
		'js/**/*.js'
	];
	browserSync.init(files, {
		server: {
			baseDir: './',
			directory: true
		},
		port: 80
	});
	// gulp.watch("css/**/*.css", ['autoprefixer'])
});

// autoprefixer
gulp.task("autoprefixer", function () {
	gulp.src("css/**/*.css")
		.pipe(postcss([
			autoprefixer({
				browsers: ['Android >= 4', 'iOS >= 6']
			})
		]))
		.pipe(gulp.dest("css/"))
});
