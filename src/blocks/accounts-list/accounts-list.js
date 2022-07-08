import { el } from 'redom'
import './accounts-list.scss'
import createAccountCard from '../account-card/account-card'
import accounts from '../../api/accounts'

// accounts = [ account1, account2, ... ]
export default class AccountsList {
  constructor(accounts, token = localStorage.token) {
    const ul = el('ul.accounts-list')
    this.element = ul
    this.accounts = accounts
    this.token = token
    accounts.forEach((account) => this.add(account))
  }

  static async create(token = localStorage.token) {
    const response = await accounts(token)
    const data = response.payload
    return new AccountsList(data, token)
  }

  async fetchAccounts() {
    const response = await accounts(this.token)
    const data = response.payload
    this.accounts = data
    return data
  }

  async reload() {
    const accounts = await this.fetchAccounts()
    this.element.innerHTML = ''
    accounts.forEach((account) => this.add(account))
  }

  add(account) {
    const item = el('li.accounts-list__item')
    item.append(createAccountCard(account))
    this.element.append(item)
  }

  sort(param = '') {
    if (!param) {
      return
    } else if (param === 'account') {
      this.accounts.sort((a, b) => a.account - b.account)
    } else if (param === 'balance') {
      this.accounts.sort((a, b) => b.balance - a.balance)
    } else if (param === 'last-transaction') {
      this.accounts.sort((a, b) => {
        if (a.transactions.length === 0 && b.transactions.length === 0) {
          return 0
        } else if (a.transactions.length === 0) {
          return 1
        } else if (b.transactions.length === 0) {
          return -1
        }
        return (
          new Date(b.transactions[b.transactions.length - 1].date).getTime() -
          new Date(a.transactions[a.transactions.length - 1].date).getTime()
        )
      })
    }
    this.element.innerHTML = ''
    this.accounts.forEach((account) => this.add(account))
  }
}
