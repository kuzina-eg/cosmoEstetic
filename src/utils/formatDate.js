/**
 * Дата поста в человеческом виде: '2026-09-18' -> '18 сентября 2026'.
 * Без Intl и локалей — результат одинаков в сборке и в браузере.
 *
 *   import formatDate from '@utils/formatDate';
 *   <time datetime={date}>{formatDate(date)}</time>
 */

const MONTHS = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

export function formatDate(input) {
    if (!input) return '';

    const [year, month, day] = String(input).split('-').map(Number);
    if (!year || !month || !day || month < 1 || month > 12) return String(input);

    return `${day} ${MONTHS[month - 1]} ${year}`;
}

export default formatDate;
