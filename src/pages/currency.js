// CSS
import 'normalize.css'
import '../common/common.scss'
import '../../node_modules/choices.js/public/assets/styles/choices.min.css'

// Libraries
import Choices from 'choices.js'
import JustValidate from 'just-validate'

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
import Modal from '../blocks/modal/modal'

// API
import allCurrencies from '../api/all-currencies'
import currencyBuy from '../api/currency-buy'

// SVG
import Burger from '../assets/images/burger.svg'

// Utilities
import logout from '../utilities/logout'
import reload from '../app'

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

  const maxCurrencyFeedRows = accountCurrency.list.childNodes.length + 6
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
      if (response.error === 'Unknown currency code') {
        const modal = new Modal({
          title: 'Ошибка',
          text: 'Что-то пошло не так. Передан неверный код валюты. Обратитесь в техническую поддержку',
        })
        modal.open()
      } else if (response.error === 'Invalid amount') {
        const modal = new Modal({
          title: 'Ошибка',
          text: 'Не указана сумма обмена, или она отрицательна',
        })
        modal.open()
      } else if (response.error === 'Not enough currency') {
        const modal = new Modal({
          title: 'Ошибка',
          text: 'На валютном счёте недостаточно средств. Уменьшите сумму перевода',
        })
        modal.open()
      } else if (response.error === 'Overdraft prevented') {
        const modal = new Modal({
          title: 'Ошибка',
          text: 'На счёте недостаточно средств. Уменьшите сумму перевода',
        })
        modal.open()
      } else {
        const modal = new Modal({
          title: 'Обмен завершён',
          text: `Вы обменяли ${currencyExchangeForm.amount.value} ${
            fromChoices.getValue().value
          } на ${toChoices.getValue().value}`,
        })
        modal.open()
        accountCurrency.reload(localStorage.token)
        currencyExchangeForm.amount.value = ''
      }
    } catch {
      const modal = new Modal({
        title: 'Ошибка',
        text: 'Отстутствует подключение к серверу. Обратитесь в техническую поддержку',
      })
      modal.open()
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
