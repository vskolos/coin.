// CSS
import 'normalize.css'
import '../common/common.scss'

// Blocks
import createHeader from '../blocks/header/header'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createTopRow from '../blocks/top-row/top-row'
import createCurrencyInfo from '../blocks/currency-info/currency-info'
import AccountCurrency from '../blocks/account-currency/account-currency'
import CurrencyExchangeForm from '../blocks/currency-exchange-form/currency-exchange-form'
import CurrencyFeed from '../blocks/currency-feed/currency-feed'

// Utilities
import logout from '../utilities/logout'
import reload from '../app'

export default function renderCurrencyPage() {
  const body = document.body
  const header = createHeader([
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
  const topRow = createTopRow(['title'], {
    title: 'Валютный обмен',
  })
  const currencyInfo = createCurrencyInfo()

  const currencyFeed = new CurrencyFeed({ parent: currencyInfo })
  const accountCurrency = new AccountCurrency({
    parent: currencyInfo,
    currencyFeed: currencyFeed,
  })
  const currencyExchangeForm = new CurrencyExchangeForm({
    parent: currencyInfo,
    accountCurrency: accountCurrency,
  })

  accountCurrency.mount()
  currencyExchangeForm.mount()
  currencyFeed.mount(currencyInfo)

  mainContainer.append(topRow, currencyInfo)

  main.append(mainContainer)

  body.innerHTML = ''
  body.append(header, main)
}
