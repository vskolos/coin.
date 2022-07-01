import { el } from 'redom'
import './accounts-list.scss'
import createAccountCard from '../account-card/account-card.js'

export function addItemToAccountsList(list, account) {
  const item = el('li.accounts-list__item')
  item.append(createAccountCard(account))
  list.append(item)
}

// accounts = [ account1, account2, ... ]
export default function createAccountsList(accounts) {
  const list = el('ul.accounts-list')

  accounts.forEach((account) => {
    addItemToAccountsList(list, account)
  })

  return list
}
