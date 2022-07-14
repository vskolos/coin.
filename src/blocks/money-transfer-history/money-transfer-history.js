import { el } from 'redom'
import createPrimaryButton from '../button/--primary/button--primary'
import './money-transfer-history.scss'

// account = { account, balance, mine, transactions }
//   transactions = [ transaction1, transaction2, ... ]
//     transactionN = { amount, date, from, to }
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
      this.transactions = this.account.transactions
      if (this.transactions) {
        this.loadPage(this.page)
        if (this.transactions.length > count && pagination) {
          this.addPagination()
        }
      }
    } else {
      for (let i = 0; i < 6; i++) {
        this.add()
      }
    }
  }

  loadPage(page) {
    this.page = page
    this.table.innerHTML = ''
    this.table.append(this.header)
    if (this.pagination) {
      this.pagination.remove()
      this.addPagination()
    }
    this.transactions
      .slice(
        -this.count * page,
        this.transactions.length - this.count * (page - 1)
      )
      .reverse()
      .forEach((transaction) => this.add(transaction))
  }

  addPagination() {
    this.pagination = el('ul.money-transfer-history__pagination')
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
        button.disabled = true
      }
      item.append(button)
      this.pagination.append(item)
    }
    this.element.append(this.pagination)
  }

  add(transaction) {
    const row = el('.money-transfer-history__row')
    const colFrom = el('.money-transfer-history__row-text')
    const colTo = el('.money-transfer-history__row-text')
    const colAmount = el('.money-transfer-history__row-text')
    const colDate = el('.money-transfer-history__row-text')

    if (transaction) {
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

      if (transaction.to === this.account.account) {
        colAmount.classList.add('money-transfer-history__row-text--income')
      } else {
        colAmount.classList.add('money-transfer-history__row-text--outcome')
      }
    } else {
      colFrom.append(el('.money-transfer-history__row-text-skeleton'))
      colTo.append(el('.money-transfer-history__row-text-skeleton'))
      colAmount.append(el('.money-transfer-history__row-text-skeleton'))
      colDate.append(el('.money-transfer-history__row-text-skeleton'))
    }

    row.append(colFrom, colTo, colAmount, colDate)
    this.table.append(row)
  }
}
