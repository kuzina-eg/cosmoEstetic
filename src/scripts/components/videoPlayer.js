/*!
    VIDEO PLAYER — медиа поста: превью с кнопкой play, настоящие пропорции,
    свои контролы для собственных файлов.

    Ничего не грузится, пока карточка не подойдёт к экрану, и полностью
    видео не играет, пока не нажали play.

    Селекторы:
      .js-media          — контейнер (data-media-kind / -preview / -embed / -ratio)
      .js-media-video    — <video> своего файла: он же превью
      .js-media-poster   — картинка-превью эмбеда
      .js-media-play     — большая кнопка запуска
      .js-media-bar      — панель своих контролов
      .js-media-toggle   — play/pause
      .js-media-progress / .js-media-fill — полоса прогресса
      .js-media-current / .js-media-duration — время
*/

// play() возвращает промис не везде (старые браузеры, тестовые окружения)
const safePlay = (video) => {
    const played = video.play();
    if (played && typeof played.catch === 'function') played.catch(() => {});
};

/*! На iOS video.volume доступен только для чтения — ползунок там мёртвый,
    поэтому проверяем на одноразовом элементе и прячем его, если так.
    Кнопка mute работает везде: muted меняется и на iOS. */
const canSetVolume = (() => {
    try {
        const probe = document.createElement('video');
        probe.volume = 0.5;
        return probe.volume === 0.5;
    } catch (e) {
        return false;
    }
})();

const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const total = Math.floor(seconds);
    const min = Math.floor(total / 60);
    const sec = total % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

// Высота вертикального ролика — доля высоты экрана, посчитанная ОДИН раз при
// загрузке модуля. Именно поэтому не vh: те пересчитываются на каждом ресайзе,
// и ролик дёргался бы при повороте экрана или появлении адресной строки.
//   80%  — ролик заведомо не выше экрана;
//   800  — потолок, чтобы не разрастался на больших мониторах;
//   500  — пол, чтобы оставался читаемым на низких горизонтальных экранах.
const PORTRAIT_MIN = 500;
const PORTRAIT_MAX = 800;
const PORTRAIT_SHARE = 0.8;

const portraitHeight = Math.round(
    Math.max(PORTRAIT_MIN, Math.min(window.innerHeight * PORTRAIT_SHARE, PORTRAIT_MAX)),
);

// Отдаём число переменной, а не пишем в style каждого блока: решать, где эта
// высота применяется, должен CSS. В теле статьи она нужна, в карточках списка
// нет — там у медиа своя раскладка.
document.documentElement.style.setProperty('--portrait-height', `${portraitHeight}px`);

// Настоящие пропорции знает только сам файл — ставим их, когда стали известны.
// Явный ratio в данных уважаем и не трогаем, но вертикальность помечаем всегда:
// на неё завязана раскладка (у таких роликов фиксируется высота, а не ширина).
const applyRatio = (box, width, height) => {
    if (!width || !height) return;

    // класс — только признак вертикальности; высоту по нему назначает CSS
    box.classList.toggle('is-portrait', height > width);

    if (box.hasAttribute('data-media-ratio')) return;
    box.style.aspectRatio = `${width} / ${height}`;
};

const buildIframe = (box) => {
    const src = box.getAttribute('data-media-embed');
    if (!src) return null;

    const iframe = document.createElement('iframe');
    // autoplay может уже стоять в адресе (VK часто отдаёт ссылку с ним) — не дублируем
    const hasAutoplay = /[?&]autoplay=/.test(src);
    const separator = src.indexOf('?') === -1 ? '?' : '&';

    iframe.className = 'post-media__frame';
    iframe.src = hasAutoplay ? src : `${src}${separator}autoplay=1`;
    iframe.title = box.getAttribute('data-media-title') || '';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; screen-wake-lock');
    iframe.setAttribute('allowfullscreen', '');

    return iframe;
};

const initFileControls = (box, video) => {
    const bar = box.querySelector('.js-media-bar');
    const toggle = box.querySelector('.js-media-toggle');
    const progress = box.querySelector('.js-media-progress');
    const fill = box.querySelector('.js-media-fill');
    const current = box.querySelector('.js-media-current');
    const duration = box.querySelector('.js-media-duration');    const mute = box.querySelector('.js-media-mute');
    const level = box.querySelector('.js-media-level');
    const levelFill = box.querySelector('.js-media-level-fill');


    const setProgress = () => {
        if (!video.duration) return;
        const percent = (video.currentTime / video.duration) * 100;
        if (fill) fill.style.width = `${percent}%`;
        if (progress) progress.setAttribute('aria-valuenow', String(Math.round(percent)));
        if (current) current.textContent = formatTime(video.currentTime);
    };

    const setPlayingState = (isPlaying) => {
        box.classList.toggle('is-paused', !isPlaying);
        if (toggle) toggle.setAttribute('aria-label', isPlaying ? 'Пауза' : 'Воспроизвести');
    };

    const setVolumeState = () => {
        const silent = video.muted || video.volume === 0;
        const percent = silent ? 0 : Math.round(video.volume * 100);

        box.classList.toggle('is-muted', silent);
        if (mute) mute.setAttribute('aria-label', silent ? 'Включить звук' : 'Выключить звук');
        if (levelFill) levelFill.style.width = `${percent}%`;
        if (level) level.setAttribute('aria-valuenow', String(percent));
    };

    const setVolume = (value) => {
        const next = Math.min(Math.max(value, 0), 1);
        video.volume = next;
        // двигать ползунок при выключенном звуке — значит включить его обратно
        if (next > 0 && video.muted) video.muted = false;
        setVolumeState();
    };

    const volumeFrom = (clientX) => {
        if (!level) return;
        const rect = level.getBoundingClientRect();
        setVolume((clientX - rect.left) / rect.width);
    };

    const seekTo = (clientX) => {
        if (!progress || !video.duration) return;
        const rect = progress.getBoundingClientRect();
        const part = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        video.currentTime = part * video.duration;
        setProgress();
    };

    video.addEventListener('loadedmetadata', () => {
        if (duration) duration.textContent = formatTime(video.duration);
    });
    video.addEventListener('timeupdate', setProgress);
    video.addEventListener('play', () => setPlayingState(true));
    // панель показываем не по клику, а когда видео реально пошло
    video.addEventListener('playing', () => {
        setPlayingState(true);
        if (bar) bar.hidden = false;
    });
    video.addEventListener('pause', () => setPlayingState(false));
    video.addEventListener('ended', () => {
        setPlayingState(false);
        box.classList.remove('is-playing');
        if (bar) bar.hidden = true;
    });

    if (toggle) {
        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            if (video.paused) safePlay(video);
            else video.pause();
        });
    }

    if (progress) {
        let isScrubbing = false;

        progress.addEventListener('pointerdown', (event) => {
            event.stopPropagation();
            isScrubbing = true;
            progress.setPointerCapture?.(event.pointerId);
            seekTo(event.clientX);
        });
        progress.addEventListener('pointermove', (event) => {
            if (isScrubbing) seekTo(event.clientX);
        });
        progress.addEventListener('pointerup', (event) => {
            isScrubbing = false;
            progress.releasePointerCapture?.(event.pointerId);
        });
        progress.addEventListener('keydown', (event) => {
            const step = event.key === 'ArrowRight' ? 5 : event.key === 'ArrowLeft' ? -5 : 0;
            if (!step || !video.duration) return;
            video.currentTime = Math.min(Math.max(video.currentTime + step, 0), video.duration);
            setProgress();
            event.preventDefault();
        });
    }

    if (mute) {
        mute.addEventListener('click', (event) => {
            event.stopPropagation();
            video.muted = !video.muted;
            setVolumeState();
        });
    }

    if (level) {
        if (!canSetVolume) {
            level.hidden = true;
        } else {
            let isAdjusting = false;

            level.addEventListener('pointerdown', (event) => {
                event.stopPropagation();
                isAdjusting = true;
                level.setPointerCapture?.(event.pointerId);
                volumeFrom(event.clientX);
            });
            level.addEventListener('pointermove', (event) => {
                if (isAdjusting) volumeFrom(event.clientX);
            });
            level.addEventListener('pointerup', (event) => {
                isAdjusting = false;
                level.releasePointerCapture?.(event.pointerId);
            });
            level.addEventListener('keydown', (event) => {
                const step = event.key === 'ArrowRight' ? 0.1 : event.key === 'ArrowLeft' ? -0.1 : 0;
                if (!step) return;
                setVolume(video.volume + step);
                event.preventDefault();
            });
        }
    }

    video.addEventListener('volumechange', setVolumeState);
    setVolumeState();

    // клик по самому видео — тоже пауза/продолжение
    video.addEventListener('click', () => {
        if (video.paused) safePlay(video);
        else video.pause();
    });

};

const initMedia = (box) => {
    const kind = box.getAttribute('data-media-kind');
    const play = box.querySelector('.js-media-play');
    const video = box.querySelector('.js-media-video');
    const poster = box.querySelector('.js-media-poster');

    // maxresdefault есть не у всех роликов YouTube — тихо падаем на hqdefault
    if (poster) {
        poster.addEventListener('error', () => {
            const fallback = poster.getAttribute('data-fallback');
            if (fallback && poster.src !== fallback) poster.src = fallback;
        }, { once: true });
    }

    if (video) {
        initFileControls(box, video);
        video.addEventListener('loadedmetadata', () => {
            applyRatio(box, video.videoWidth, video.videoHeight);
        });
    }

    // Превью своего файла: подставляем src с #t=, чтобы браузер нарисовал кадр
    const armPreview = () => {
        if (!video || video.src) return;
        const preview = box.getAttribute('data-media-preview');
        if (!preview) return;
        video.preload = 'metadata';
        video.src = preview;
    };

    const start = () => {
        if (box.classList.contains('is-playing')) return;
        box.classList.add('is-playing');

        if (video) {
            armPreview();
            video.controls = false;
            video.currentTime = 0;
            safePlay(video);
            return;
        }

        const iframe = buildIframe(box);
        if (!iframe) return;
        if (poster) poster.remove();
        box.appendChild(iframe);
    };

    if (play) {
        play.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            start();
        });
    }

    return armPreview;
};

export default function videoPlayer() {
    const boxes = [...document.querySelectorAll('.js-media')]
        .filter((box) => !box.hasAttribute('data-media-init'));

    if (!boxes.length) return;

    const armers = new Map();
    boxes.forEach((box) => {
        box.setAttribute('data-media-init', '');
        armers.set(box, initMedia(box));
    });

    // метаданные и кадр тянем только у того, что подходит к экрану
    if (typeof IntersectionObserver === 'undefined') {
        armers.forEach((arm) => arm && arm());
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const arm = armers.get(entry.target);
            if (arm) arm();
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '200px' });

    boxes.forEach((box) => observer.observe(box));
}
