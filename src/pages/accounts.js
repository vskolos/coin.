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
import AccountsList from '../blocks/accounts-list/accounts-list'
import createModal from '../blocks/modal/modal'

// API
import createAccount from '../api/create-account'

// Pages
import logout from '../utilities/logout'

// SVG
import Burger from '../assets/images/burger.svg'
import Plus from '../assets/images/plus.svg'

// Utilities
import reload from '../app'

export default async function renderAccountsPage(sort = '') {
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

  const accountsList = await AccountsList.create(localStorage.token)
  accountsList.sort(sort)

  const button = topRow.querySelector('.button')

  button.addEventListener('click', async () => {
    try {
      const data = await createAccount(localStorage.token)
      accountsList.add(data.payload)
      accountsList.accounts.push(data.payload)

      const modal = createModal({
        title: 'Счёт создан',
        text: `№ ${data.payload.account}`,
        primaryButton: {
          text: 'Перейти к счёту',
          clickHandler: () => {
            document.body.style.removeProperty('overflow')
            reload(`/accounts/${data.payload.account}`)
          },
        },
        secondaryButton: {
          text: 'Закрыть',
          clickHandler: () => {
            document.querySelector('.modal').remove()
            document.body.style.removeProperty('overflow')
          },
        },
      })
      document.body.append(modal)
      document.body.style.overflow = 'hidden'
    } catch {
      const modal = createModal({
        title: 'Ошибка',
        text: 'Отстутствует подключение к серверу. Обратитесь в техническую поддержку',
        primaryButton: {
          text: 'Закрыть',
          clickHandler: () => {
            document.querySelector('.modal').remove()
            document.body.style.removeProperty('overflow')
          },
        },
      })
      document.body.append(modal)
      document.body.style.overflow = 'hidden'
    }
  })

  headerContainer.append(logo, burger, menu)
  header.append(headerContainer)

  mainContainer.append(topRow, accountsList.element)

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

  select.addEventListener('change', (event) =>
    accountsList.sort(event.detail.value)
  )
}
