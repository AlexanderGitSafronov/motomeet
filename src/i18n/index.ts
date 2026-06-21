import { useAppStore, type Lang } from '@/store/useAppStore'

export type { Lang }

export const LANGUAGES: { value: Lang; label: string; flag: string }[] = [
  { value: 'uk', label: 'Українська', flag: '🇺🇦' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'ru', label: 'Русский', flag: '🇷🇺' },
]

/**
 * Translation dictionary keyed by the Ukrainian source string. `t()` returns
 * the source as-is for `uk` (so Ukrainian rendering never changes), and the
 * mapped value for `en` / `ru`. Missing entries fall back to the source.
 */
const dict: Record<string, { en: string; ru: string }> = {
  // ---- nav ----
  Карта: { en: 'Map', ru: 'Карта' },
  Події: { en: 'Events', ru: 'События' },
  Чати: { en: 'Chats', ru: 'Чаты' },
  Маршрути: { en: 'Routes', ru: 'Маршруты' },
  Профіль: { en: 'Profile', ru: 'Профиль' },
  Клуби: { en: 'Clubs', ru: 'Клубы' },
  Повідомлення: { en: 'Messages', ru: 'Сообщения' },
  Райдери: { en: 'Riders', ru: 'Райдеры' },
  Усі: { en: 'All', ru: 'Все' },
  'Створити подію': { en: 'Create event', ru: 'Создать событие' },

  // ---- auth ----
  'Знайди свою команду. Катай разом.': { en: 'Find your tribe. Ride together.', ru: 'Найди свою команду. Катай вместе.' },
  Увійти: { en: 'Log in', ru: 'Войти' },
  Реєстрація: { en: 'Sign up', ru: 'Регистрация' },
  'Створити акаунт': { en: 'Create account', ru: 'Создать аккаунт' },
  'Забули пароль?': { en: 'Forgot password?', ru: 'Забыли пароль?' },
  'або увійти через': { en: 'or continue with', ru: 'или войти через' },
  'Електронна пошта': { en: 'Email', ru: 'Эл. почта' },
  Пароль: { en: 'Password', ru: 'Пароль' },
  'Повторіть пароль': { en: 'Repeat password', ru: 'Повторите пароль' },
  'Ваше ім’я': { en: 'Your name', ru: 'Ваше имя' },
  'Ім’я': { en: 'Name', ru: 'Имя' },
  'Зачекайте…': { en: 'Please wait…', ru: 'Подождите…' },
  'Продовжуючи, ви приймаєте Умови та Політику конфіденційності': {
    en: 'By continuing you agree to our Terms & Privacy Policy',
    ru: 'Продолжая, вы принимаете Условия и Политику конфиденциальности',
  },
  'Відновлення пароля': { en: 'Password reset', ru: 'Восстановление пароля' },
  'Надіслати посилання': { en: 'Send link', ru: 'Отправить ссылку' },

  // ---- common actions ----
  Стежити: { en: 'Follow', ru: 'Подписаться' },
  'Ви стежите': { en: 'Following', ru: 'Вы подписаны' },
  Написати: { en: 'Message', ru: 'Написать' },
  Піду: { en: 'Join', ru: 'Пойду' },
  Іду: { en: 'Going', ru: 'Иду' },
  Вступити: { en: 'Join', ru: 'Вступить' },
  Учасник: { en: 'Joined', ru: 'Участник' },
  Долучитися: { en: 'Join ride', ru: 'Присоединиться' },
  'Ви учасник': { en: "You're going", ru: 'Вы участник' },
  Скасувати: { en: 'Cancel', ru: 'Отмена' },
  Зберегти: { en: 'Save', ru: 'Сохранить' },
  Старт: { en: 'Start', ru: 'Старт' },
  'Додати фото': { en: 'Add photo', ru: 'Добавить фото' },

  // ---- screen titles / sections ----
  'Редагувати профіль': { en: 'Edit Profile', ru: 'Редактировать профиль' },
  Підписники: { en: 'Followers', ru: 'Подписчики' },
  Підписки: { en: 'Following', ru: 'Подписки' },
  Заїзди: { en: 'Rides', ru: 'Заезды' },
  Досягнення: { en: 'Achievements', ru: 'Достижения' },
  Галерея: { en: 'Gallery', ru: 'Галерея' },
  'Створення події': { en: 'Create Event', ru: 'Создание события' },
  'Опублікувати подію': { en: 'Publish event', ru: 'Опубликовать событие' },
  'Про заїзд': { en: 'About this ride', ru: 'Об этом заезде' },
  'Локація і маршрут': { en: 'Location & route', ru: 'Локация и маршрут' },
  Маршрут: { en: 'Route', ru: 'Маршрут' },
  Тривалість: { en: 'Duration', ru: 'Длительность' },
  Учасники: { en: 'Going', ru: 'Участники' },
  Організатор: { en: 'Hosted by', ru: 'Организатор' },
  'Заплановані зупинки': { en: 'Planned stops', ru: 'Запланированные остановки' },
  'Активний маршрут': { en: 'Active route', ru: 'Активный маршрут' },
  'Плануйте та катайте разом': { en: 'Plan & ride together', ru: 'Планируйте и катайте вместе' },
  Сповіщення: { en: 'Notifications', ru: 'Уведомления' },
  'Прочитати всі': { en: 'Mark all read', ru: 'Прочитать все' },
  Нові: { en: 'New', ru: 'Новые' },
  Раніше: { en: 'Earlier', ru: 'Ранее' },
  'Пошук повідомлень': { en: 'Search messages', ru: 'Поиск сообщений' },
  'Пошук райдерів, подій, клубів': { en: 'Search riders, events, clubs', ru: 'Поиск райдеров, событий, клубов' },
  'Сортування: відстань': { en: 'Sort: Distance', ru: 'Сортировка: расстояние' },
  'До 10 км': { en: 'Within 10 km', ru: 'До 10 км' },
  Спорт: { en: 'Sport', ru: 'Спорт' },
  Онлайн: { en: 'Online', ru: 'Онлайн' },
  Ралі: { en: 'Rallies', ru: 'Ралли' },
  Трек: { en: 'Track', ru: 'Трек' },
  Тури: { en: 'Tours', ru: 'Туры' },
  Поруч: { en: 'Near me', ru: 'Рядом' },
  Туризм: { en: 'Touring', ru: 'Туризм' },
  Пригоди: { en: 'Adventure', ru: 'Приключения' },

  // ---- settings ----
  Налаштування: { en: 'Settings', ru: 'Настройки' },
  'Перегляд і редагування профілю': { en: 'View and edit your profile', ru: 'Просмотр и редактирование профиля' },
  'Приватність і локація': { en: 'Privacy & location', ru: 'Приватность и локация' },
  'Приватність локації': { en: 'Location privacy', ru: 'Приватность локации' },
  'Лише друзі': { en: 'Friends only', ru: 'Только друзья' },
  'Режим-привид': { en: 'Ghost mode', ru: 'Режим-призрак' },
  'Приховати геолокацію': { en: 'Hide your live location', ru: 'Скрыть геолокацию' },
  'Показувати відстань': { en: 'Show distance', ru: 'Показывать расстояние' },
  'Показувати км іншим райдерам': { en: 'Display km to other riders', ru: 'Показывать км другим райдерам' },
  'Push-сповіщення': { en: 'Push notifications', ru: 'Push-уведомления' },
  'Звуки та банери': { en: 'Sounds & banners', ru: 'Звуки и баннеры' },
  'Нагадування про події': { en: 'Event reminders', ru: 'Напоминания о событиях' },
  'За 30 хв до початку': { en: '30 min before start', ru: 'За 30 мин до начала' },
  'Райдери поруч': { en: 'Nearby riders', ru: 'Райдеры рядом' },
  'Сповіщати, коли друзі поруч': { en: 'Alert when friends are close', ru: 'Уведомлять, когда друзья рядом' },
  Вигляд: { en: 'Appearance', ru: 'Внешний вид' },
  Тема: { en: 'Theme', ru: 'Тема' },
  'Темна тема': { en: 'Dark mode', ru: 'Тёмная тема' },
  'Світла тема': { en: 'Light mode', ru: 'Светлая тема' },
  Мова: { en: 'Language', ru: 'Язык' },
  Безпека: { en: 'Security', ru: 'Безопасность' },
  'Пароль і 2FA': { en: 'Password & 2FA', ru: 'Пароль и 2FA' },
  Вийти: { en: 'Log out', ru: 'Выйти' },

  // ---- map / misc ----
  'Зараз у дорозі': { en: 'Riding now', ru: 'Сейчас в пути' },
  'У радіусі 25 км від вас': { en: 'Within 25 km of you', ru: 'В радиусе 25 км от вас' },
  'Найближчі події': { en: 'Upcoming events', ru: 'Ближайшие события' },
  'від вас': { en: 'away', ru: 'от вас' },
  'останній заїзд': { en: 'latest ride', ru: 'последний заезд' },
  'подій поряд': { en: 'events near you', ru: 'событий рядом' },
  'райдерів поруч': { en: 'riders nearby', ru: 'райдеров рядом' },
  'райдерів зараз у дорозі': { en: 'riders riding now', ru: 'райдеров сейчас в пути' },
  '284 клуби у світі': { en: '284 clubs worldwide', ru: '284 клуба в мире' },
  'подій знайдено': { en: 'events found', ru: 'событий найдено' },
  'клубів знайдено': { en: 'clubs found', ru: 'клубов найдено' },
}

export function translate(uk: string, lang: Lang): string {
  if (lang === 'uk') return uk
  return dict[uk]?.[lang] ?? uk
}

/** Hook returning a `t(uk)` function bound to the current language. */
export function useT() {
  const lang = useAppStore((s) => s.lang)
  return (uk: string) => translate(uk, lang)
}
