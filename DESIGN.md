---
# gstack: design-md-format=spec
name: VERBA — New Rhythm
description: A cinematic retreat journey from forest to personal health, directed through space and native scroll.
colors:
  primary: "#203c34"
  on-primary: "#ffffff"
  surface: "#f3f4ef"
  text: "#203c34"
  text-muted: "#58665c"
  accent: "#a9b99b"
  beauty: "#6c5548"
typography:
  display:
    fontFamily: Clear Sans
    fontWeight: 400
    fontSize: clamp(3rem, 5vw, 5rem)
    letterSpacing: -0.025em
  body:
    fontFamily: Clear Sans
    fontSize: 1rem
    lineHeight: 1.6
  label:
    fontFamily: Clear Sans
    fontSize: 0.75rem
    letterSpacing: 0.04em
rounded:
  sm: 0px
  md: 0px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  nav-link:
    textColor: "{colors.text}"
---

# VERBA — New Rhythm

## Overview

Creative North Star: увидеть реальное место, замедлить взгляд, перейти от природы к персональному медицинскому подходу. Главная — Experience/Persuade; выбор направления и предварительный план — Operate.

Контекст, исследование и самостоятельные итерации авторизованы подробным пользовательским brief. Утверждённая версия из verba-pilot сохранена отдельным baseline в репозитории verba-motion-experiment; работа продолжается в ветке experiment/verba-motion. Модельные генерации/ревью не выполняются. Инструкции gstack-design-consultation применены с этими явными полномочиями вместо повторных вопросов о уже заданных целях.

## Colors

Глубокий зелёный принадлежит лесу и старому пилоту VERBA. Светлый фон используется как пауза между сценами. Коричневый BEAUTY — дополнительный оттенок из реального материала ухода, а не отдельный декоративный бренд.

## Typography

Локальные Clear Sans 400/500/700 извлечены с официального сайта VERBA ранее. Для Clear Sans подтверждена Apache 2.0 по embedded name table; лицензия включена. Пользователь подтвердил публичный показ официальных фото и фильма VERBA и разрешил публичный репозиторий/Pages 13 октября 2026. Большой VERBA — брендовая композиция первого экрана, намеренная poster typography по заданию пользователя. Остальные display-заголовки ограничены более спокойной шкалой. Pretext из установленного gstack измеряет текстовые блоки после загрузки шрифта и при изменении ширины.

## Layout

Первый кадр полноэкранный. При нативной прокрутке видео превращается в вертикальную часть следующей редакционной сцены; на телефоне — в нижний горизонтальный кадр. Выбор направлений представлен одним визуальным пространством и четырьмя табами. Медицинский блок не упакован в карточки.

## Elevation & Depth

Глубину дают разные скорости двух плоскостей, реальная перспектива камеры и смена размера кадра. Тени оставлены только для modal. Затемнение фотографий служит контрасту текста.

## Shapes

Прямые края и линии. Круглая форма допустима только для маленького SVG-маркера бренда; декоративных blobs, glow и карточных мозаик нет.

## Components

Все цели клика не меньше 44 px. Направления доступны click/touch/keyboard; hover не изменяет выбор. Меню, dialog и focus return работают нативно. Локальный предварительный план не является заявкой.

## Do's and Don'ts

- Реальные фильмы и фото VERBA, источники и недостающие материалы явно описаны.
- Native scroll; без wheel interception, smooth-scroll библиотеки и автоматического скролла по времени.
- Не использовать конкурентов как источник фотографий прототипа.
- Не вставлять emoji и стрелочные glyph; только SVG/CSS.
- Не делать auto-rotation направлений и не скрывать чтение за анимацией.

## Motion

Выразительное движение сосредоточено в одной длинной первой сцене: воздух → приближение → раскрытие медицинского смысла. Progress следует за реальной прокруткой с коротким сглаживанием rAF. Изображение, брендовая строка и пояснение имеют разные траектории. Направления crossfade с небольшим scale, текст раскрывается за ними с задержкой. Медицинский блок имеет одну лёгкую reveal, а не одинаковую анимацию каждого элемента.

Prefers-reduced-motion убирает pin-distance и scroll choreography, останавливает видео и переключает направления без transition. Управление воспроизведением видео отдельно доступно пользователю.

## Decisions Log

| Дата | Решение | Причина |
|---|---|---|
| 2026-10-12 | Применить five reference principles, без копирования внешних assets | Реально просмотренный Lanserhof даёт режиссуру и пространственный ритм |
| 2026-10-12 | Native sticky + rAF, без GSAP | Нужны одна timeline и ограниченное число transform-плоскостей; дополнительный runtime не нужен |
| 2026-10-12 | Vendored Pretext, vanilla HTML | gstack-design-html требует реальное resize-aware измерение; bundle уже установлен |
