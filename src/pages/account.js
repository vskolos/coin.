// CSS
import 'normalize.css'
import '../common/common.scss'
import '../../node_modules/choices.js/public/assets/styles/choices.min.css'

// Libraries
// import Choices from 'choices.js'

// Blocks
import createHeader from '../blocks/header/header.js'
import createLogo from '../blocks/logo/logo.js'
import createMenu from '../blocks/menu/menu.js'
import createMain from '../blocks/main/main.js'
import createContainer from '../blocks/container/container.js'
import createButton from '../blocks/button/button.js'
import createTopRow from '../blocks/top-row/top-row.js'

// API
import account from '../api/account.js'

// Utilities
import logout from '../utilities/logout.js'
import reload from '../utilities/reload.js'

// SVG
import Burger from '../assets/images/burger.svg'
import Arrow from '../assets/images/arrow.svg'

export default function renderAccountPage(id) {
  const body = document.body
  const header = createHeader()
  const headerContainer = createContainer()
  const logo = createLogo()
  const burger = createButton({ icon: Burger })
  const menu = createMenu([
    { text: 'Банкоматы', disabled: false, handler: () => reload('?page=map') },
    { text: 'Счета', disabled: false, handler: () => reload('?page=accounts') },
    {
      text: 'Валюта',
      disabled: false,
      handler: () => reload('?page=currency'),
    },
    { text: 'Выйти', disabled: false, handler: logout },
  ])
  const main = createMain()
  const mainContainer = createContainer()

  let topRow
  account(id, localStorage.token).then((res) => {
    const data = res.payload
    topRow = createTopRow({
      title: 'Просмотр счёта',
      account: data.account,
      balance: data.balance,
      button: {
        text: 'Вернуться назад',
        icon: Arrow,
      },
    })

    const button = topRow.querySelector('.button')
    button.addEventListener('click', () => reload('?page=accounts'))

    mainContainer.append(topRow)
  })

  headerContainer.append(logo, burger, menu)
  header.append(headerContainer)

  main.append(mainContainer)

  burger.classList.add('button--burger')
  burger.addEventListener('click', () => {
    menu.classList.toggle('menu--visible')
  })

  body.innerHTML = ''
  body.append(header, main)
}
