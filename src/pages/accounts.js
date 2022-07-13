// CSS
import 'normalize.css'
import '../common/common.scss'
import '../../node_modules/choices.js/public/assets/styles/choices.min.css'

// Libraries
import Choices from 'choices.js'

// Blocks
import createHeader from '../blocks/header/header'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createTopRow from '../blocks/top-row/top-row'
import AccountsList from '../blocks/accounts-list/accounts-list'
import Modal from '../blocks/modal/modal'

// API
import createAccount from '../api/create-account'

// Pages
import logout from '../utilities/logout'

// SVG
import Plus from '../assets/images/plus.svg'

// Utilities
import reload from '../app'

export default async function renderAccountsPage(sort = '') {
  const body = document.body
  const header = createHeader([
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

      const modal = new Modal({
        title: 'Счёт создан',
        text: `№ ${data.payload.account}`,
        button: {
          text: 'Перейти к счёту',
          clickHandler: () => {
            document.body.style.removeProperty('overflow')
            reload(`/accounts/${data.payload.account}`)
          },
        },
      })
      modal.open()
    } catch {
      const modal = new Modal({
        title: 'Ошибка',
        text: 'Отстутствует подключение к серверу. Обратитесь в техническую поддержку',
      })
      modal.open()
    }
  })

  mainContainer.append(topRow, accountsList.element)

  main.append(mainContainer)

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
