// Libraries
import { el } from 'redom'
import ymaps from 'ymaps'

import banks from '../../api/banks'
import handleError from '../../utilities/handle-error'
import './map.scss'

// Создание блока карты
export default function createMap() {
  const div = el('.map.map--skeleton')

  // Запрос координат банков с сервера
  banks()
    .then((response) => {
      if (response.error) {
        throw new Error(response.error)
      }
      return response.payload
    })
    .then((data) => {
      ymaps
        // Добавляем тег <script> на страницу
        .load('//api-maps.yandex.ru/2.1/?lang=ru_RU')
        .then((maps) => {
          // Инициализируем карту
          const banksMap = new maps.Map(div, {
            center: [55.755819, 37.617644],
            zoom: 7,
          })
          // Добавляем точки с координатами
          data.forEach((point) => {
            const placemark = new maps.Placemark([point.lat, point.lon])
            banksMap.geoObjects.add(placemark)
          })
          // Настраиваем масштаб и центрирование карты, чтобы все точки были видны
          banksMap.setBounds(banksMap.geoObjects.getBounds())
        })
        // Убираем класс с анимацией загрузки
        .then(() => div.classList.remove('map--skeleton'))
    })
    .catch((error) => handleError(error))

  return div
}
