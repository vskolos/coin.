import { el } from 'redom'
import createPrimaryButton from '../button/--primary/button--primary'
import './money-transfer-history.scss'

// Создание блока истории денежных переводов
export default class MoneyTransferHistory {
  constructor(account, count, pagination = false) {
    this.account = account
    this.count = count
    this.page = 1

    this.element = el('.money-transfer-history')
    const title = el('p.money-transfer-history__title', 'История переводов')
    this.table = el('.money-transfer-history__table')
    this.header = el('.money-transfer-history__header')

    const headerFrom = el(
      '.money-transfer-history__header-text',
      'Счёт отправителя'
    )
    const headerTo = el(
      '.money-transfer-history__header-text',
      'Счёт получателя'
    )
    const headerAmount = el('.money-transfer-history__header-text', 'Сумма')
    const headerDate = el('.money-transfer-history__header-text', 'Дата')

    this.header.append(headerFrom, headerTo, headerAmount, headerDate)
    this.table.append(this.header)
    this.element.append(title, this.table)

    if (account) {
      // Если передали данные счёта, заполняем их
      this.transactions = this.account.transactions

      if (this.transactions) {
        // Если у счёта есть транзации, загружаем их
        this.loadPage(this.page)

        if (this.transactions.length > count && pagination) {
          // Если транзакций больше, чем count, добавляем кнопки пагинации
          this.addPagination()
        }
      }
    } else {
      // Иначе создаём пустые строки для визуализации загрузки
      for (let i = 0; i < 6; i++) {
        this.add()
      }
    }
  }

  // Загрузка выбранной страницы списка транзакций
  loadPage(page) {
    this.page = page

    // Очищаем таблицу и добавляем строку с заголовками
    this.table.innerHTML = ''
    this.table.append(this.header)

    if (this.pagination) {
      // Реинициализируем пагинацию для отображения нужных кнопок
      this.pagination.remove()
      this.addPagination()
    }

    // Создаём строку таблицы для каждой транзакции из выбранного интервала
    this.transactions
      .slice(
        -this.count * page,
        this.transactions.length - this.count * (page - 1)
      )
      .reverse()
      .forEach((transaction) => this.add(transaction))
  }

  // Добавление блока пагинации
  addPagination() {
    this.pagination = el('ul.money-transfer-history__pagination')

    // Если мы не в самом начале, выводим по две кнопки справа и слева от актуального номера страницы
    const start = this.page > 3 ? this.page - 2 : 1
    let end =
      (this.page + 2) * this.count < this.transactions.length
        ? (this.page + 2) * this.count
        : this.transactions.length

    for (let page = start; page * this.count <= end; page++) {
      const item = el('li.money-transfer-history__pagination-item')
      const button = createPrimaryButton({
        text: page,
        handler: () => this.loadPage(page),
      })

      if (page === this.page) {
        // Деактивируем кнопку с текущим номером страницы
        button.disabled = true
      }

      item.append(button)
      this.pagination.append(item)
    }
    this.element.append(this.pagination)
  }

  // Добавление строки с данными транзакции в таблицу
  add(transaction) {
    const row = el('.money-transfer-history__row')
    const colFrom = el('.money-transfer-history__row-text')
    const colTo = el('.money-transfer-history__row-text')
    const colAmount = el('.money-transfer-history__row-text')
    const colDate = el('.money-transfer-history__row-text')

    if (transaction) {
      // Если передали данные транзакции, заполняем их
      colFrom.textContent = transaction.from
      colTo.textContent = transaction.to
      colAmount.textContent = transaction.amount
        .toLocaleString('ru-RU')
        .replace(',', '.')
      colDate.textContent = new Date(transaction.date).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      })

      // Проверка транзации на входящую/исходящую
      if (transaction.to === this.account.account) {
        colAmount.classList.add('money-transfer-history__row-text--income')
      } else {
        colAmount.classList.add('money-transfer-history__row-text--outcome')
      }
    } else {
      // Иначе добавляем классы для визуализации загрузки
      colFrom.append(el('.money-transfer-history__row-text-skeleton'))
      colTo.append(el('.money-transfer-history__row-text-skeleton'))
      colAmount.append(el('.money-transfer-history__row-text-skeleton'))
      colDate.append(el('.money-transfer-history__row-text-skeleton'))
    }

    row.append(colFrom, colTo, colAmount, colDate)
    this.table.append(row)
  }
}
