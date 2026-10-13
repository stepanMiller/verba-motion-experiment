# MILLER | VERBA — final motion demo

Точечное уточнение утверждённого прототипа, без нового редизайна. Крупная VERBA, первый экран с официальным видео территории и переход со сжатием кадра сохранены. HTML hero совпадает с исходным коммитом `f7ded3668688f3fdf91f5583f8b6ea1dac8620ee`; формат и SHA hero-видео не менялись.

## Архитектура и файлы

Статические HTML/CSS/ES modules, нативная прокрутка и CSS transforms/clip-path. Pretext — локальный vendored module. Production build и установка зависимостей не нужны.

| Путь | Назначение |
|---|---|
| `index.html`, `styles.css`, `app.js` | Работающая страница и взаимодействия |
| `assets/motion/` | Официальные изображения/hero, приложенный лесной фильм, его poster, Pretext |
| `assets/clear-sans*.woff` | Локальный Clear Sans |
| `ASSETS.json`, `licenses/` | Происхождение, hashes, статус прав и лицензии |
| `serve.py` | Loopback-only preview с CSP |
| `scripts/check_static.py` | Пути, IDs, anchors, branding, alt, video flags и проверка типичных секретов |
| `scripts/export_static.py` | Экспорт allowlist в `_site/` без Git, QA, документов и неиспользуемых материалов |
| `scripts/browser_qa.mjs` | Реальные browser/touch-emulation сценарии, MP4 и screenshots |
| `build-standalone.py` | Необязательный автономный HTML, который не является опубликованным сайтом |
| `.github/workflows/pages.yml` | Ручная публикация из экспериментальной ветки; push сам не публикует |

gstack, окружение Codex, авторизация, cookies, кеши, node_modules, архивы и записи QA в Git не включены.

## Запуск

Нужен Python 3.10+. Для проверки синтаксиса JS нужен существующий Node.js 18+.

```bash
git clone --branch experiment/verba-motion https://github.com/stepanMiller/verba-motion-experiment.git
cd verba-motion-experiment
python3 serve.py
```

Локально откройте `http://127.0.0.1:4173/`. Другой порт:

```bash
GSTACK_LAB_PORT=4174 python3 serve.py
```

Это команда локального разработчика, а не публичная ссылка для просмотра на телефоне.

## Статическая проверка и экспорт

```bash
python3 scripts/check_static.py
node --check app.js
python3 scripts/export_static.py
```

Отдельной компиляции нет. `_site/` — готовый набор публичных файлов; он не коммитится. Экспорт не меняет ресурсы и не устанавливает инструменты.

Необязательный автономный файл:

```bash
python3 build-standalone.py
```

## Браузерная проверка

Используется уже установленный gstack/Playwright, Chromium и FFmpeg. Новая установка не выполняется. В облачной лаборатории:

```bash
GSTACK_ROOT=/workspace/gstack-lab/gstack \
VERBA_DEMO_URL=http://127.0.0.1:4174/ \
VERBA_QA_OUTPUT=/workspace/gstack-lab/reports/verba-final/qa-new \
/workspace/gstack-lab/bin/lab-run node scripts/browser_qa.mjs
```

На другой машине задайте существующий `GSTACK_ROOT`, `GSTACK_CHROMIUM_PATH` и новый output-каталог. Повтор использует новый каталог, чтобы сохранить прежние наблюдения. Для проверки реального развёртывания передайте фактический URL в `VERBA_DEMO_URL`.

Ширины: 1440×1000, 390×844 и 375×812. Проверяются hero/window-scroll, меню/focus, четыре направления и быстрые нажатия, reload, CTA, FAQ, форма и реальный TXT download, лесной film one-shot/stop/revisit, ресурсные ответы и console. Отдельно — reduced-motion, модели отказа autoplay и отсутствующего media. Результаты — JSON с `pass/fail/blocked`, реальные PNG и CDP MP4.

Это Chromium/touch emulation, а не настоящий iPhone/Safari. Fixture отказа autoplay моделирует `play()` rejection; фактическая политика iOS не объявлена проверенной.

## Материалы и поведение видео

Официальный контент проверен 13 октября 2026 на `https://verbamayr.ru/` и `/clinic/lechenie/`. Упоминания метода Майера и MAYR сохранены; прежнее имя бренда исключено из интерфейса, metadata/alt и TXT-плана. Юридические документы не редактировались.

BEAUTY — кадр специалиста с аппаратом из официального `promo_.mp4`, 11.4 s. Название процедуры и квалификация не приписаны. Врач — соседний более ясный кадр существующей консультации, 9.1 s. Фотографии корректируются только слабыми CSS saturation/brightness; документальное содержание не изменено.

Финальный `assets/motion/verba-forest-5s.mp4` — точная копия предоставленного пользователем Runway-файла: 5.04 s, H.264, 1280×720, без аудио. Он является художественной визуализацией леса, не документальным изображением территории. Новый ролик не генерировался.

`src` лесного видео назначается после появления сцены. Нет `loop`: film проигрывается однократно и остаётся на последнем кадре. Выход из viewport останавливает film; возвращение не сбрасывает время. Повтор — только явной кнопкой. `object-fit: cover` сохраняет пропорции. Poster остаётся при autoplay failure; reduced-motion изначально не загружает final movie и выключает автоматическое движение. Ручное воспроизведение доступно.

Clear Sans: Apache 2.0, подтверждено embedded name table (Intel, 2012). Pretext: MIT, лицензия включена. Разрешение на публичное использование официальных фото и фильма VERBA **пока не подтверждено**; запрос пользователю остаётся открытым. Приватное хранение исходников разрешено задачей.

## GitHub и публикация

Репозиторий приватный: `stepanMiller/verba-motion-experiment`. Ветка `experiment/verba-motion`. Baseline и правки — отдельные commits; force push и merge в main не выполняются. В исходно пустом репозитории экспериментальная ветка стала первой веткой; никаких существовавших main-коммитов не изменялось.

На проверке Pages API вернул **403 Resource not accessible by integration**. `has_pages=false`. Поддержка приватного Pages на текущем тарифе через доступное API не установлена. GitHub Pages для приватного репозитория требует подходящего существующего тарифа (например, Pro/Team/Enterprise); платный тариф подключать запрещено. Альтернативный Vercel read probe вернул **404 User not found**, доступного аккаунта для автоматического развёртывания не установлено. Новые аккаунты не создавались.

До публичного размещения необходимо:

1. Подтвердить право публичного показа материалов VERBA для этой демоверсии и обновить `ASSETS.json`/статус ниже.
2. При уже подходящем тарифе включить **Settings → Pages → GitHub Actions** в этом приватном репозитории. Visibility не менять.
3. Запустить ручной workflow именно на `experiment/verba-motion`, с подтверждённым `rights_confirmed=true`:

```bash
gh workflow run pages.yml --repo stepanMiller/verba-motion-experiment \
  --ref experiment/verba-motion -f rights_confirmed=true
```

Workflow экспортирует только `_site/` и использует Pages/id-token для deployment. Полученный фактический `page_url` нужно открыть и повторно проверить, включая fonts/video paths и взаимодействия. Придуманный URL, localhost, Google Drive HTML и ZIP не считаются deployment. При недоступном Pages нужно согласовать существующий бесплатный hosting-доступ; аккаунты, тарифы и permissions автоматически не расширяются.

Публикация **не выполнена**: права и Pages-доступ остаются блокерами. Ручной workflow подготовлен, но не запущен; CI pass для публикации не заявлен.

## Изменения и оставшиеся ограничения

Убрано прежнее имя бренда; сокращён абстрактный повтор; обновлён BEAUTY; врач увеличен и этапы сокращены; встроен предоставленный one-shot forest film с доступным управлением. Утверждённый hero/window-motion сохранён.

Ограничения: 720p исходные фильмы, короткий hero-loop прежней версии, physical iPhone/Safari и screen readers не проверены; полная WCAG/производительность на слабом устройстве не измерены. Независимое ревью второй моделью не выполнялось. Реальные QA findings, исходный неуспешный прогон и успешный повтор сохранены в лаборатории и передаются отдельно проверенными ссылками.
