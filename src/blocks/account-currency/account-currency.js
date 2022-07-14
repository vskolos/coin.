import { el } from 'redom'
import currencies from '../../api/currencies'
import handleError from '../../utilities/handle-error'
import './account-currency.scss'

// Создание блока с валютами счёта
export default class AccountCurrency {
  constructor({ token = localStorage.token, onInit }) {
    this.onInit = onInit
    this.token = token
    this.element = el('.account-currency')
    const title = el('p.account-currency__title', 'Ваши валюты')
    this.list = el('ul.account-currency__list')
    this.element.append(title, this.list)

    // Заполняем список пустыми строками для анимации загрузки
    for (let i = 0; i < 6; i++) {
      this.add()
    }

    this.fetch()
  }

  // Запрос данных о валютах счёта с сервера
  fetch() {
    currencies(this.token)
      .then((response) => {
        if (response.error) {
          throw new Error(response.error)
        }
        return response.payload
      })
      .then((currencies) => {
        // Очищаем список от пустых строк
        this.list.innerHTML = ''

        // Заполняем его реальными данными
        Object.keys(currencies).forEach((key) => {
          this.add(currencies[key])
        })
      })
      .then(() => this.onInit())
      .catch((error) => handleError(error))
  }

  // Добавление строки в список
  add(currency) {
    const li = el('li.account-currency__item')
    const code = el('span.account-currency__code')
    const amount = el('span.account-currency__amount')

    if (currency) {
      // Если передали данные строки, заполняем их
      code.textContent = currency.code

      // Если у пользователя нет такой валюты, пропускаем эту строку
      if (currency.amount === 0) return

      amount.textContent = currency.amount
        // Приводим число в формат 1 000 000.00
        .toLocaleString('ru-RU')
        .replace(',', '.')
    } else {
      // Иначе добавляем классы для визуализации загрузки
      code.classList.add('account-currency__code--skeleton')
      amount.classList.add('account-currency__amount--skeleton')
    }

    li.append(code, amount)
    this.list.append(li)
  }
}
