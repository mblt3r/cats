# Развертывание на GitHub Pages

## Подготовка к развертыванию

Проект готов для развертывания на GitHub Pages с использованием GitHub Actions.

### Что было сделано:

1. ✅ Настроена конфигурация Vite (`vite.config.js`)
2. ✅ Создан GitHub Actions workflow (`.github/workflows/deploy.yml`)
3. ✅ Добавлен файл `.nojekyll` в папку `public`
4. ✅ Обновлена конфигурация `.gitignore`

## Инструкции для развертывания

### 1. Создайте репозиторий на GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ВАШ_ЮЗЕР/ВАШ_РЕПОЗИТОРИЙ.git
git push -u origin main
```

### 2. Включите GitHub Pages

1. Перейдите в **Settings** вашего репозитория на GitHub
2. Выберите **Pages** в левом меню
3. Выберите **GitHub Actions** в качестве источника
4. Сохраните изменения

### 3. Автоматическое развертывание

После включения GitHub Pages:

- Каждый `push` на ветку `main` или `master` будет автоматически строить и развертывать приложение
- GitHub Actions будет:
  - Установить зависимости NPM
  - Построить приложение (`npm run build`)
  - Развернуть содержимое папки `dist` на GitHub Pages

### 4. Проверьте результат

После успешного развертывания (проверьте вкладку **Actions** в репозитории):

- Приложение будет доступно по адресу: `https://ВАШ_ЮЗЕР.github.io/ВАШ_РЕПОЗИТОРИЙ/`

## Важные замечания

### Про backend

⚠️ **Важно:** GitHub Pages хостит только статические файлы. Если приложение требует backend API:

**Вариант 1:** Развернуть backend отдельно

- Используйте Heroku, Railway, Render или другой сервис для backend
- Обновите API endpoints в `src/services/api.js`

**Вариант 2:** Использовать serverless функции

- Используйте Netlify Functions, Vercel Functions и т.д.

**Вариант 3:** Deploy на полноценный хостинг

- Если нужен полный stack (фронт + бэк), используйте Vercel, Netlify, Railway и т.д.

### Локальное тестирование

Перед push'ем протестируйте сборку локально:

```bash
npm run build
npm run preview
```

## Troubleshooting

### Проблемы с путями (404 на подпапках)

Если при переходе по ссылкам в приложении получаете 404, нужно настроить React Router для GitHub Pages. Текущая конфигурация использует `base: '/'`, но если репозиторий находится на подпапке, нужно изменить на `base: '/<repo-name>/'`.

Запросите помощь в обновлении `vite.config.js`, если это потребуется.

### GitHub Actions не работает

1. Проверьте, что у вас есть права на запись в репозитории
2. Перейдите на вкладку **Actions** и посмотрите логи
3. Убедитесь, что ветка названа `main` или `master` (настройка в `deploy.yml`)

## Полезные ссылки

- [Документация GitHub Pages](https://docs.github.com/en/pages)
- [GitHub Actions для Pages](https://github.com/actions/deploy-pages)
- [Документация Vite](https://vitejs.dev/guide/ssr.html#client-centric-routing)
