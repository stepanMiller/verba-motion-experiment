# MILLER | VERBA — final motion demo

> Актуальное обновление BEAUTY: [утверждённый VERBASKIN подключён, SHA-256 проверен, QA и скриншоты](BEAUTY-QA.md). Сайт пока не опубликован. Остальные отчёты ниже фиксируют предыдущие этапы.

> Обновление композиции: [фото, текст и фон; сравнение до/после и QA](COMPOSITION-QA.md). Историческое сравнение на локальных медиа до подключения VERBASKIN.

> Дополнение от 16 октября: [SVG-стрелки, QA и точная диагностика HTTP 403](ARROWS-QA.md). Публикация приостановлена до выбора леса; hero и фото ещё требуют качественных источников.

> Обновление качества от 16 октября 2026: [изменения, реальные размеры, QA и блокеры](MEDIA-QUALITY.md). Ветка `fix/media-quality` содержит локально проверенные улучшения загрузки/отображения; в Pages они пока не опубликованы. Описания ниже относятся к предыдущей публикации.

Точечное уточнение утверждённого прототипа, без нового редизайна. Крупная VERBA, первый экран с официальным видео территории и переход со сжатием кадра сохранены. HTML hero совпадает с исходным коммитом `f7ded3668688f3fdf91f5583f8b6ea1dac8620ee`; формат и SHA hero-видео не менялись.

## Архитектура и файлы

Статические HTML/CSS/ES modules, нативная прокрутка и CSS transforms/clip-path. Pretext — локальный vendored module. Production build и установка зависимостей не нужны.

| Путь | Назначение |
|---|---|
| `index.html`, `styles.css`, `app.js` | Работающая страница и взаимодействия |
| `assets/motion/` | Официальные изображения/hero, приложенный лесной фильм, его poster, Pretext |
| `assets/clear-sans*.woff` | Локальный Clear Sans |
| `demo-evidence/` | Выбранные реальные PNG/MP4 и страница просмотра |
| `ASSETS.json`, `licenses/` | Происхождение, hashes, статус прав и лицензии |
| `serve.py` | Loopback-only preview с CSP |
| `scripts/check_static.py` | Пути, IDs, anchors, branding, alt, video flags и проверка типичных секретов |
| `scripts/export_static.py` | Экспорт allowlist в `_site/` без Git, QA, документов и неиспользуемых материалов |
| `scripts/browser_qa.mjs` | Реальные browser/touch-emulation сценарии, MP4 и screenshots |
| `build-standalone.py` | Необязательный автономный HTML, который не является опубликованным сайтом |
| `.github/workflows/pages.yml` | Ручная публикация из экспериментальной ветки; push сам не публикует |

gstack, окружение Codex, авторизация, cookies, кеши, node_modules, архивы и полные сырые прогоны QA в Git не включены. Выбранные PNG и две короткие записи служат доступными доказательствами результата.

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

Clear Sans: Apache 2.0, подтверждено embedded name table (Intel, 2012). Pretext: MIT, лицензия включена. Пользователь подтвердил 13 октября 2026 право публичного показа официальных фотографий и исходного фильма VERBA в этой демоверсии. Подтверждение отражено в `ASSETS.json`. Лесной фильм предоставлен пользователем для этой задачи.

## GitHub и публикация

Пользователь разрешил 13 октября 2026 публичный репозиторий и публикацию через Pages. Репозиторий: [stepanMiller/verba-motion-experiment](https://github.com/stepanMiller/verba-motion-experiment/tree/experiment/verba-motion), ветка `experiment/verba-motion`. Baseline и правки — отдельные commits; force push и merge в main не выполняются. В исходно пустом репозитории экспериментальная ветка стала первой веткой; существовавших main-коммитов не было.

- Демо: https://stepanmiller.github.io/verba-motion-experiment/
- Desktop screenshots и motion: https://stepanmiller.github.io/verba-motion-experiment/demo-evidence/#desktop
- Mobile screenshots и motion: https://stepanmiller.github.io/verba-motion-experiment/demo-evidence/#mobile

GitHub Pages настроен на GitHub Actions; действующий домен VERBA не менялся. Исходная попытка чтения Pages для приватного репозитория вернула 403; затем пользователь изменил настройки GitHub и прямо разрешил публичность. На момент подготовки этого обновления workflow для `5a463e1c7e9ba234d8b7345b6e83444a329ba67c` успешно завершился, фактический адрес демо вернул HTTP 200. Для нового итогового SHA запуск и результат фиксируются в истории Actions.

Точная команда обновления после commit + push:

```bash
gh workflow run pages.yml --repo stepanMiller/verba-motion-experiment \
  --ref experiment/verba-motion -f rights_confirmed=true
```

Workflow проверяет статические файлы, экспортирует только allowlist в `_site/` и публикует его через Pages. Push сам не публикует. В экспорт включены только сайт, лицензии и небольшой выбранный набор доказательных PNG/MP4 для просмотра на телефоне без ZIP. gstack, окружение, кеши, внутренние отчёты и временные frame-каталоги туда не попадают. Тяжёлые исходные QA-прогоны остаются вне Git; выбранные две короткие записи добавлены для требуемой доступной демонстрации.

После каждого развёртывания открыть фактический `page_url`, проверить ресурсы и основные сценарии. Для полного повторения браузерного прогона передать URL в `VERBA_DEMO_URL` по команде выше. Localhost, Google Drive HTML и ZIP не являются опубликованным сайтом.

## Изменения и оставшиеся ограничения

Убрано прежнее имя бренда; сокращён абстрактный повтор; обновлён BEAUTY; врач увеличен и этапы сокращены; встроен предоставленный one-shot forest film с доступным управлением. Утверждённый hero/window-motion сохранён.

Ограничения: 720p исходные фильмы, короткий hero-loop прежней версии, physical iPhone/Safari и screen readers не проверены; полная WCAG/производительность на слабом устройстве не измерены. Независимое ревью второй моделью не выполнялось. Краткий фактический отчёт — `QA-REPORT.md`. Реальные QA findings и исходный неуспешный прогон сохранены в лаборатории; выбранные итоговые доказательства доступны на странице demo-evidence.

## Удаление только эксперимента

Остановите собственный локальный preview через Ctrl+C. Чтобы удалить только этот checkout сайта в лаборатории:

```bash
rm -rf -- /workspace/gstack-lab/verba-motion-experiment
```

Это не удаляет другие проекты и основные настройки Codex. Если нужно удалить весь отдельный эксперимент GSTACK-LAB, после остановки его preview/браузера удалите только `/workspace/gstack-lab`; его HOME и CODEX_HOME находятся внутри него. Для снятия публичного демо отключите Pages в Settings этого экспериментального репозитория. Локальное удаление не удаляет GitHub и не меняет официальный сайт VERBA.
