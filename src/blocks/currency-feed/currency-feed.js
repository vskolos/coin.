import { el } from 'redom'
import currencyFeed from '../../api/currency-feed'
import handleError from '../../utilities/handle-error'
import './currency-feed.scss'

// Создание блока с курсами валют в реальном времени
export default class CurrencyFeed {
  constructor() {
    try {
      // Пробуем загрузить сохраненные в браузере данные
      this.feed = JSON.parse(localStorage.currencyFeed)
      if (!this.feed) {
        throw new Error()
      }
    } catch {
      // Если не получилось, задаем пустые значения
      localStorage.currencyFeed = '[]'
      this.feed = []
    }
    // Масимальное количество строк в блоке
    this.rows = 12

    this.element = el('.currency-feed')
    const title = el(
      'p.currency-feed__title',
      'Изменение курсов в реальном времени'
    )
    this.list = el('ul.currency-feed__list')
    this.element.append(title, this.list)

    this.reload()

    currencyFeed()
      .then(
        (socket) =>
          (socket.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data)
              if (data.type === 'EXCHANGE_RATE_CHANGE') {
                this.add(data)
                this.feed.push(data)
                localStorage.currencyFeed = JSON.stringify(
                  this.feed.slice(-100)
                )
              }
            } catch (error) {
              throw new Error(error)
            }
          })
      )
      .catch((error) => handleError(error))
  }

  // Отображение данных
  reload() {
    if (this.feed) {
      // Очищаем список
      this.list.innerHTML = ''

      // Заполняем его данными из свойства класса
      this.feed.slice(-this.rows).forEach((entry) => this.add(entry))
    }
  }

  // Добавление строки в начало списка
  add(data) {
    const li = el('li.currency-feed__item')
    const code = el('span.currency-feed__code', `${data.from}/${data.to}`)
    const rate = el(
      'span.currency-feed__rate',
      // Приводим число к виду 0.0000000001
      data.rate
        .toLocaleString('ru-RU', { maximumFractionDigits: 10 })
        .replace(',', '.')
    )

    if (data.change === 1) {
      // Если изменение положительное, добавляем классы
      code.classList.add('currency-feed__code--positive')
      rate.classList.add('currency-feed__rate--positive')
    } else if (data.change === -1) {
      // Если отрицательное, добавляем соответствующие классы
      code.classList.add('currency-feed__code--negative')
      rate.classList.add('currency-feed__rate--negative')
    }

    // При добавлении новых строк удаляем лишние с конца
    while (this.list.childElementCount >= this.rows) {
      this.list.lastChild.remove()
    }

    li.append(code, rate)
    this.list.prepend(li)
  }
}
