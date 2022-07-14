import { el } from 'redom'
import createAccountCard from '../account-card/account-card'
import accounts from '../../api/accounts'
import handleError from '../../utilities/handle-error'
import './accounts-list.scss'

// Создание блока со списком счетов пользователя
export default class AccountsList {
  constructor(token = localStorage.token) {
    this.element = el('ul.accounts-list')

    // Заполняем список пустыми строками для анимации загрузки
    for (let i = 0; i < 6; i++) {
      this.add()
    }

    // Запрос списка счетов пользователя с сервера
    accounts(token)
      .then((response) => {
        if (response.error) {
          throw new Error(response.error)
        }
        return response.payload
      })
      .then((accounts) => {
        // Добавляем свойство классу для метода сортировки
        this.accounts = accounts

        // Очищаем список от пустых карточек
        this.element.innerHTML = ''

        // Заполняем его реальными данными
        accounts.forEach((account) => this.add(account))
      })
      .catch((error) => handleError(error))
  }

  // Добавление карточки счёта к списку
  add(account) {
    const item = el('li.accounts-list__item')
    item.append(createAccountCard(account))
    this.element.append(item)
  }

  // Сортировка и перерисовка карточек счетов
  sort(param = '') {
    if (!param) {
      return
    } else if (param === 'account') {
      // Сортировка по номеру счёта
      this.accounts.sort((a, b) => a.account - b.account)
    } else if (param === 'balance') {
      // Сортировка по балансу
      this.accounts.sort((a, b) => a.balance - b.balance)
    } else if (param === 'last-transaction') {
      // Сортировка по дате последней транзакции
      this.accounts.sort((a, b) => {
        // Проверка на крайние случаи с отстутсвием транзакций
        if (a.transactions.length === 0 && b.transactions.length === 0) {
          return 0
        } else if (a.transactions.length === 0) {
          return -1
        } else if (b.transactions.length === 0) {
          return 1
        }
        return (
          new Date(a.transactions[a.transactions.length - 1].date).getTime() -
          new Date(b.transactions[b.transactions.length - 1].date).getTime()
        )
      })
    }
    // Очищаем список
    this.element.innerHTML = ''

    // Заполняем отсортированными данными
    this.accounts.forEach((account) => this.add(account))
  }
}
