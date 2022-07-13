import { el } from 'redom'
import './accounts-list.scss'
import AccountCard from '../account-card/account-card'
import accounts from '../../api/accounts'

export default class AccountsList {
  constructor(sort = '', token = localStorage.token) {
    const ul = el('ul.accounts-list')
    this.element = ul
    for (let i = 0; i < 6; i++) {
      this.add()
    }

    accounts(token)
      .then((response) => response.payload)
      .then((accounts) => {
        this.accounts = accounts
        this.element.innerHTML = ''
        accounts.forEach((account) => this.add(account))
      })
      .finally(this.sort(sort))
  }

  add(account) {
    const item = el('li.accounts-list__item')
    const card = new AccountCard(account)
    item.append(card.element)
    this.element.append(item)
  }

  sort(param = '') {
    if (!param) {
      return
    } else if (param === 'account') {
      this.accounts.sort((a, b) => a.account - b.account)
    } else if (param === 'balance') {
      this.accounts.sort((a, b) => a.balance - b.balance)
    } else if (param === 'last-transaction') {
      this.accounts.sort((a, b) => {
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
    this.element.innerHTML = ''
    this.accounts.forEach((account) => this.add(account))
  }
}
