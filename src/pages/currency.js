// CSS
import 'normalize.css'
import '../common/common.scss'
import '../../node_modules/choices.js/public/assets/styles/choices.min.css'

// Libraries
import Choices from 'choices.js'
import JustValidate from 'just-validate'

// Blocks
import createHeader from '../blocks/header/header'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createTopRow from '../blocks/top-row/top-row'
import createCurrencyInfo from '../blocks/currency-info/currency-info'
import AccountCurrency from '../blocks/account-currency/account-currency'
import createCurrencyExchangeForm from '../blocks/currency-exchange-form/currency-exchange-form'
import CurrencyFeed from '../blocks/currency-feed/currency-feed'
import Modal from '../blocks/modal/modal'

// API
import allCurrencies from '../api/all-currencies'
import currencyBuy from '../api/currency-buy'

// Utilities
import logout from '../utilities/logout'
import reload from '../app'
import handleError from '../utilities/handle-error'

export default async function renderCurrencyPage() {
  const response = await allCurrencies()
  const allCurrenciesList = response.payload

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
  const accountCurrency = new AccountCurrency()
  const currencyExchangeForm = createCurrencyExchangeForm(allCurrenciesList)

  const currencyFeed = new CurrencyFeed()
  accountCurrency.rows.then((rows) => {
    console.log(accountCurrency.rows)
    currencyFeed.rows = rows + 6
  })

  currencyInfo.append(
    accountCurrency.element,
    currencyExchangeForm,
    currencyFeed.element
  )
  mainContainer.append(topRow, currencyInfo)

  main.append(mainContainer)

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

  const validation = new JustValidate(currencyExchangeForm, {
    errorLabelStyle: {},
    errorLabelCssClass: 'currency-exchange-form__label-text--invalid',
    errorFieldCssClass: 'currency-exchange-form__input--invalid',
  })

  async function sendForm() {
    try {
      const response = await currencyBuy(
        {
          from: fromChoices.getValue().value,
          to: toChoices.getValue().value,
          amount: currencyExchangeForm.amount.value,
        },
        localStorage.token
      )
      if (response.error) {
        throw new Error(response.error)
      }
      const modal = new Modal({
        title: 'Обмен завершён',
        text: `Вы обменяли ${currencyExchangeForm.amount.value} ${
          fromChoices.getValue().value
        } на ${toChoices.getValue().value}`,
      })
      modal.open()
      accountCurrency.fetch()
      currencyExchangeForm.amount.value = ''
    } catch (error) {
      handleError(error)
    }
  }

  validation
    .addField('.currency-exchange-form__input--amount', [
      {
        rule: 'required',
        errorMessage: 'Введите сумму перевода',
      },
    ])
    .onSuccess(sendForm)
}
