# Личный кабинет Coin.

Итоговый проект курса «JavaScript. Продвинутый уровень». Задача: Сделать front-end для банковсковской системы по [техническому заданию](Coin.%20(Objective).pdf).

## Установка

После клонирования репозитория необходимо установить все зависимости:

```
npm i
```

Затем нужно перейти в директорию `server` и установить все зависимости для серверной части приложения:

```
npm i
```

Для работы приложения нужно запустить сервер с back-end частью проекта. Для этого из директории `server` нужно выполнить:

```
npm start
```

## Запуск

Далее есть два варианта запуска приложения:

### Запуск в режиме `development`

В этом режиме запускается `webpack-dev-server`.

```
npm run dev
```

### Сборка в режиме `production`

В этом режиме проект собирается в директорию `dist`.

```
npm run build
```

Необходимо запустить сервер в режиме SPA для корректной работы. Например, `serve -s dist` при использовании `serve`.

## Очистка

Команда удаляет папку `dist`.

```
npm run clean
```

## Тестирование

Реализованы тесты на базовый функционал через `cypress`.

```
npm test
```
