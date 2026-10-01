/**
 * Разбор медиа поста. Один модуль на сборку и на браузер, чтобы разметка
 * и скрипт понимали источник одинаково.
 *
 * Тип в данных указывать не обязательно — он определяется по ссылке.
 * Поля poster и ratio всегда перебивают автоматику.
 */

const RE_YOUTUBE = /(?:youtube\.com|youtu\.be)/i;
const RE_VK = /(?:vk\.com\/video_ext|vkvideo\.ru)/i;
const RE_FILE = /\.(mp4|webm|ogv|mov|m4v)(\?|#|$)/i;

/** 'image' | 'video' (свой файл) | 'youtube' | 'vk' | 'embed' */
export function detectMediaKind(media = {}) {
    const { type, src = '' } = media;

    if (type === 'image') return 'image';
    if (RE_YOUTUBE.test(src)) return 'youtube';
    if (RE_VK.test(src)) return 'vk';
    if (type === 'video' || RE_FILE.test(src)) return 'video';
    if (type === 'embed' || /^https?:\/\//i.test(src)) return 'embed';

    return 'image';
}

export function youtubeId(src = '') {
    const match = String(src).match(/(?:youtu\.be\/|\/embed\/|[?&]v=)([\w-]{6,})/);
    return match ? match[1] : '';
}

/** Адрес для iframe: ссылку вида youtube.com/watch?v=… приводим к /embed/… */
export function embedSrc(media = {}) {
    const src = media.src || '';

    if (detectMediaKind(media) === 'youtube') {
        const id = youtubeId(src);
        return id ? `https://www.youtube.com/embed/${id}` : src;
    }

    return src;
}

/**
 * Превью. Ручной poster — в приоритете; для YouTube картинка выводится из ID;
 * для VK и прочих эмбедов автоматики нет, нужен poster в данных.
 * Локальные постеры лежат парами @1x/@2x.webp, внешние — как есть.
 */
export function resolvePoster(media = {}) {
    const { poster } = media;

    if (poster) {
        return /^https?:\/\//i.test(poster)
            ? { url: poster, srcset: null, fallback: null }
            : { url: `${poster}@1x.webp`, srcset: `${poster}@2x.webp 2x`, fallback: null };
    }

    if (detectMediaKind(media) === 'youtube') {
        const id = youtubeId(media.src);
        if (id) {
            return {
                url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
                srcset: null,
                // maxres есть не у всех роликов — подменяем на hq при ошибке
                fallback: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
            };
        }
    }

    return null;
}

/**
 * Что подгрузить из своего файла до клика. Ручные данные всегда в приоритете:
 * лишнюю работу не делаем, если её результат уже задан в разметке.
 *
 *   нет постера            → `src#t=0.1` — кадр (заодно придут габариты)
 *   постер есть, ratio нет → `src`       — только габариты, кадр не нужен
 *   есть и постер, и ratio → ''          — файл до клика вообще не трогаем
 *
 * Эмбеды сюда не попадают: у чужого плеера ни кадр, ни габариты не достать.
 */
export function previewSrc(media = {}) {
    if (detectMediaKind(media) !== 'video') return '';

    const src = media.src || '';
    if (!src) return '';

    if (!media.poster) return src.indexOf('#') === -1 ? `${src}#t=0.1` : src;
    if (!media.ratio) return src;

    return '';
}

/** Стартовые пропорции до того, как станут известны настоящие */
export function ratioStyle(media = {}, fallback = '16 / 9') {
    const ratio = media.ratio;
    if (!ratio) return fallback;
    return String(ratio).replace(/\s*\/\s*/, ' / ');
}
