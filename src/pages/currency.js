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
import createCurrencyInfo from '../blocks/currency-info/currency-info'
import AccountCurrency from '../blocks/account-currency/account-currency'
import createCurrencyExchangeForm from '../blocks/currency-exchange-form/currency-exchange-form'
import CurrencyFeed from '../blocks/currency-feed/currency-feed'

// API
import allCurrencies from '../api/all-currencies'
import currencyBuy from '../api/currency-buy'

// SVG
import Burger from '../assets/images/burger.svg'

// Utilities
import logout from '../utilities/logout'
import reload from '../utilities/reload'

export default async function renderCurrencyPage() {
  const response = await allCurrencies()
  const allCurrenciesList = response.payload

  const body = document.body
  const header = createHeader()
  const headerContainer = createContainer()
  const logo = createLogo()
  const burger = createButton({ icon: Burger })
  const menu = createMenu([
    { text: 'Банкоматы', disabled: false, handler: () => reload('/banks') },
    { text: 'Счета', disabled: false, handler: () => reload('/accounts') },
    {
      text: 'Валюта',
      disabled: true,
      handler: () => reload('/currency'),
    },
    { text: 'Выйти', disabled: false, handler: logout },
  ])
  const main = createMain()
  const mainContainer = createContainer()
  const topRow = createTopRow({
    title: 'Валютный обмен',
  })
  const currencyInfo = createCurrencyInfo()
  const accountCurrency = await AccountCurrency.create()
  const currencyExchangeForm = createCurrencyExchangeForm(allCurrenciesList)

  const maxCurrencyFeedRows = 21
  const currencyFeed = new CurrencyFeed(maxCurrencyFeedRows)

  headerContainer.append(logo, burger, menu)
  header.append(headerContainer)

  currencyInfo.append(
    accountCurrency.element,
    currencyExchangeForm,
    currencyFeed.element
  )
  mainContainer.append(topRow, currencyInfo)

  main.append(mainContainer)

  burger.classList.add('button--burger')
  burger.addEventListener('click', () => {
    menu.classList.toggle('menu--visible')
  })

  body.innerHTML = ''
  body.append(header, main)

  const fromSelect = currencyExchangeForm.querySelector('.js-exchange-from')
  const fromChoices = new Choices(fromSelect, {
    allowHTML: false,
    searchEnabled: false,
    itemSelectText: '',
  })
  fromChoices.setChoiceByValue('BTC')

  const toSelect = currencyExchangeForm.querySelector('.js-exchange-to')
  const toChoices = new Choices(toSelect, {
    allowHTML: false,
    searchEnabled: false,
    itemSelectText: '',
  })
  toChoices.setChoiceByValue('ETH')

  currencyExchangeForm.addEventListener('submit', async () => {
    await currencyBuy(
      {
        from: fromChoices.getValue().value,
        to: toChoices.getValue().value,
        amount: currencyExchangeForm.amount.value,
      },
      localStorage.token
    )
    accountCurrency.reload(localStorage.token)
  })
}
