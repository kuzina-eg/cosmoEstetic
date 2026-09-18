/*
    VIDEO FACADE — видео и эмбеды не грузятся до первого клика.
    Вместо плеера показывается превью-картинка с кнопкой play; по клику
    в тот же контейнер подставляется настоящий <video> или <iframe>.

    Селекторы:
      .js-video-facade — контейнер, несёт data-video-type / -src / -title
      .js-video-play   — кнопка запуска
*/

const buildPlayer = (facade) => {
    const type = facade.getAttribute('data-video-type');
    const src = facade.getAttribute('data-video-src');
    const title = facade.getAttribute('data-video-title') || '';

    if (!src) return null;

    if (type === 'embed') {
        const iframe = document.createElement('iframe');
        // autoplay может уже стоять в адресе (VK часто отдаёт ссылку с ним) — не дублируем
        const hasAutoplay = /[?&]autoplay=/.test(src);
        const separator = src.indexOf('?') === -1 ? '?' : '&';

        iframe.className = 'post-media__frame';
        iframe.src = hasAutoplay ? src : `${src}${separator}autoplay=1`;
        iframe.title = title;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; screen-wake-lock');
        iframe.setAttribute('allowfullscreen', '');

        return iframe;
    }

    const video = document.createElement('video');

    video.className = 'post-media__video';
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    if (title) video.title = title;

    return video;
};

const activate = (facade) => {
    if (facade.classList.contains('is-playing')) return;

    const player = buildPlayer(facade);
    if (!player) return;

    facade.classList.add('is-playing');
    facade.innerHTML = '';
    facade.appendChild(player);

    // autoplay может быть отклонён браузером — у плеера остаются controls
    if (player.tagName === 'VIDEO' && typeof player.play === 'function') {
        const played = player.play();
        if (played && typeof played.catch === 'function') played.catch(() => {});
    }
};

export default function videoFacade() {
    document.querySelectorAll('.js-video-facade').forEach((facade) => {
        if (facade.hasAttribute('data-video-init')) return;
        facade.setAttribute('data-video-init', '');

        // слушаем контейнер: ловит и клик по превью, и Enter/Space на кнопке
        facade.addEventListener('click', () => activate(facade));
    });
}
