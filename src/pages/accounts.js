// CSS
import 'normalize.css'
import '../common/common.scss'
import '../../node_modules/choices.js/public/assets/styles/choices.min.css'

// Libraries
import Choices from 'choices.js'

// Blocks
import createHeader from '../blocks/header/header'
import createLogo from '../blocks/logo/logo'
import createMenu from '../blocks/menu/menu'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createButton from '../blocks/button/button'
import createTopRow from '../blocks/top-row/top-row'
import createAccountsList, {
  addItemToAccountsList,
} from '../blocks/accounts-list/accounts-list'

// API
import accounts from '../api/accounts'
import createAccount from '../api/create-account'

// Pages
import logout from '../utilities/logout'

// SVG
import Burger from '../assets/images/burger.svg'
import Plus from '../assets/images/plus.svg'

// Utilities
import reload from '../utilities/reload'
import sortAccounts from '../utilities/sort-accounts'

export default async function renderAccountsPage(sort = '') {
  const response = await accounts(localStorage.token)
  const data = response.payload

  const body = document.body
  const header = createHeader()
  const headerContainer = createContainer()
  const logo = createLogo()
  const burger = createButton({ icon: Burger })
  const menu = createMenu([
    { text: 'Банкоматы', disabled: false, handler: () => reload('/banks') },
    { text: 'Счета', disabled: true, handler: () => reload('/accounts') },
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
    title: 'Ваши счета',
    filter: [
      { text: 'Сортировка', value: '' },
      { text: 'По номеру', value: 'account' },
      { text: 'По балансу', value: 'balance' },
      { text: 'По последней транзакции', value: 'last-transaction' },
    ],
    button: {
      text: 'Создать новый счёт',
      icon: Plus,
    },
  })

  sortAccounts(data, sort)

  const accountsList = createAccountsList(data)

  const button = topRow.querySelector('.button')

  button.addEventListener('click', async () => {
    const data = await createAccount(localStorage.token)
    addItemToAccountsList(accountsList, data.payload)
  })

  headerContainer.append(logo, burger, menu)
  header.append(headerContainer)

  mainContainer.append(topRow, accountsList)

  main.append(mainContainer)

  burger.classList.add('button--burger')
  burger.addEventListener('click', () => {
    menu.classList.toggle('menu--visible')
  })

  body.innerHTML = ''
  body.append(header, main)

  const select = topRow.querySelector('.js-sort')
  const filter = new Choices(select, {
    allowHTML: false,
    searchEnabled: false,
    shouldSort: false,
    itemSelectText: '',
  })

  if (sort) {
    filter.setChoiceByValue(sort)
  }

  select.addEventListener('change', (event) => {
    reload(`/accounts?sort=${event.detail.value}`)
  })
}
