// App
import reload from '../app'

// Blocks
import createHeader from '../blocks/header/header'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createTopRow from '../blocks/top-row/top-row'
import createMap from '../blocks/map/map'

// Utilities
import logout from '../utilities/logout'

// CSS
import 'normalize.css'
import '../common/common.scss'

// Отрисовка страницы с картой банков
export default async function renderBanksPage() {
  const body = document.body

  // Создаём шапку страницы
  const header = createHeader([
    { text: 'Банкоматы', disabled: true, handler: () => reload('/banks') },
    { text: 'Счета', disabled: false, handler: () => reload('/accounts') },
    {
      text: 'Валюта',
      disabled: false,
      handler: () => reload('/currency'),
    },
    { text: 'Выйти', disabled: false, handler: logout },
  ])

  const main = createMain()
  const mainContainer = createContainer()

  // Создаем верхний блок
  const topRow = createTopRow(['title'], {
    title: 'Карта банкоматов',
  })

  // Создаем блок карты
  const map = createMap()

  mainContainer.append(topRow, map)
  main.append(mainContainer)

  // Очищаем страницу для перерисовки
  body.innerHTML = ''
  body.append(header, main)

  // Устанавливаем минимальную высоту страницы для отображения карты во весь экран
  main.style.minHeight = `calc(100vh - ${header.offsetHeight}px)`
}
