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

export default function renderAccountsPage() {
  const body = document.body
  const header = createHeader()
  const headerContainer = createContainer()
  const logo = createLogo()
  const burger = createButton({ icon: Burger })
  const menu = createMenu([
    { text: 'Банкоматы', disabled: false, handler: () => reload('/map') },
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
    filter: {
      placeholder: 'Сортировка',
      options: ['По номеру', 'По балансу', 'По последней транзакции'],
    },
    button: {
      text: 'Создать новый счёт',
      icon: Plus,
    },
  })
  let accountsList

  const button = topRow.querySelector('.button')

  button.addEventListener('click', async () => {
    const data = await createAccount(localStorage.token)
    addItemToAccountsList(accountsList, data.payload)
  })

  headerContainer.append(logo, burger, menu)
  header.append(headerContainer)

  mainContainer.append(topRow)
  accounts(localStorage.token).then((data) => {
    accountsList = createAccountsList(data.payload)
    mainContainer.append(accountsList)
  })

  main.append(mainContainer)

  burger.classList.add('button--burger')
  burger.addEventListener('click', () => {
    menu.classList.toggle('menu--visible')
  })

  body.innerHTML = ''
  body.append(header, main)

  const select = document.querySelector('.js-choices')
  new Choices(select, {
    allowHTML: false,
    searchEnabled: false,
    shouldSort: false,
    itemSelectText: '',
  })
}
