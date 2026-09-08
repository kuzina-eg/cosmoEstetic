import gulp from 'gulp';
import {deleteAsync} from 'del';
import svgSprite from 'gulp-svg-sprite';
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';
import beautify from 'gulp-beautify';

const dist = './dist/';
const srcIcons = `./src/icons/**/*.svg`;
const publicIcons = `./public/img/`;

const spriteSvg = () => {
	deleteAsync(publicIcons + 'icons.svg');

	return gulp.src(srcIcons)
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
				$('[clip-path]').removeAttr('clip-path');
				$('defs').remove();
			},
			parserOptions: {xmlMode: true}
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				symbol: { // symbol
					sprite: '../icons.svg'
				}
			}
		}))
		.pipe(beautify.html({ indent_size: 4 }))
		.pipe(gulp.dest(publicIcons))
}

const beautifyTask = () => {
	return gulp.src(`${dist}*.html`)
        .pipe(replace('href="/css', 'href="css'))
        .pipe(replace('href="/assets', 'href="assets'))
        .pipe(replace('src="/assets', 'src="assets'))
        .pipe(replace('src="/js', 'src="js'))
        .pipe(beautify.html({
            indent_size: 4,
            max_preserve_newlines: 1,
            // button/svg/use переносим как блочные (по умолчанию js-beautify держит их инлайн);
            // текстовые инлайны (a, span, b, i …) оставляем, чтобы не ломать переносы в тексте
            inline: ['a','abbr','area','audio','b','bdi','bdo','br','canvas','cite','code','data','datalist','del','dfn','em','embed','i','iframe','img','input','ins','kbd','label','map','mark','meter','noscript','object','output','progress','q','ruby','s','samp','select','small','span','strong','sub','sup','textarea','time','u','var','video','wbr','text','acronym','big','strike','tt'],
        }))
        .pipe(gulp.dest(dist))
}

gulp.task('svg', spriteSvg);
gulp.task('beautify', beautifyTask);
