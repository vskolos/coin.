// CSS
import 'normalize.css'
import '../common/common.scss'

// Libraries
import ymaps from 'ymaps'

// Blocks
import createHeader from '../blocks/header/header'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createTopRow from '../blocks/top-row/top-row'
import createMap from '../blocks/map/map'

// API
import banks from '../api/banks'

// Utilities
import logout from '../utilities/logout'
import reload from '../app'

export default async function renderBanksPage() {
  const response = await banks()
  const data = response.payload

  const body = document.body
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
  const topRow = createTopRow({
    title: 'Карта банкоматов',
  })
  const map = createMap()

  mainContainer.append(topRow, map)

  main.append(mainContainer)

  body.innerHTML = ''
  body.append(header, main)

  main.style.minHeight = `calc(100vh - ${header.offsetHeight}px)`

  ymaps.load('//api-maps.yandex.ru/2.1/?lang=ru_RU').then((maps) => {
    const banksMap = new maps.Map(map, {
      center: [55.755819, 37.617644],
      zoom: 7,
    })
    data.forEach((point) => {
      const placemark = new maps.Placemark([point.lat, point.lon])
      banksMap.geoObjects.add(placemark)
    })
    banksMap.setBounds(banksMap.geoObjects.getBounds())
  })
}
