// CSS
import 'normalize.css'
import '../common/common.scss'

// Libraries
import JustValidate from 'just-validate'

// Blocks
import createHeader from '../blocks/header/header'
import createLogo from '../blocks/logo/logo'
import createMenu from '../blocks/menu/menu'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createButton from '../blocks/button/button'
import createTopRow from '../blocks/top-row/top-row'
import createAccountInfo from '../blocks/account-info/account-info'
import createMoneyTransferForm from '../blocks/money-transfer-form/money-transfer-form'
import createBalanceChart from '../blocks/balance-chart/balance-chart'
import createMoneyTransferHistory from '../blocks/money-transfer-history/money-transfer-history'
import createModal from '../blocks/modal/modal'

// API
import account from '../api/account'
import transferFunds from '../api/transfer-funds'

// Utilities
import reload from '../app'
import logout from '../utilities/logout'
import monthlyBalance from '../utilities/monthly-balance'
import chartInit from '../utilities/chart-init'

// SVG
import Burger from '../assets/images/burger.svg'
import Arrow from '../assets/images/arrow.svg'

export default async function renderAccountPage(id) {
  const response = await account(id, localStorage.token)
  const data = response.payload

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
      disabled: false,
      handler: () => reload('/currency'),
    },
    { text: 'Выйти', disabled: false, handler: logout },
  ])
  const main = createMain()
  const mainContainer = createContainer()

  const topRow = createTopRow({
    title: 'Просмотр счёта',
    account: data.account,
    balance: data.balance,
    button: {
      text: 'Вернуться назад',
      icon: Arrow,
    },
  })

  const backButton = topRow.querySelector('.button')
  backButton.addEventListener('click', () => reload('/accounts'))

  const accountInfo = createAccountInfo()
  const moneyTransferForm = createMoneyTransferForm()

  const balanceChart = createBalanceChart('Динамика баланса')
  balanceChart.style.cursor = 'pointer'
  balanceChart.addEventListener('click', () =>
    reload(`/accounts/${data.account}/history`)
  )

  const moneyTransferHistory = createMoneyTransferHistory(data, 10)
  moneyTransferHistory.style.cursor = 'pointer'
  moneyTransferHistory.addEventListener('click', () =>
    reload(`/accounts/${data.account}/history`)
  )

  headerContainer.append(logo, burger, menu)
  header.append(headerContainer)

  accountInfo.append(moneyTransferForm, balanceChart, moneyTransferHistory)
  mainContainer.append(topRow, accountInfo)
  main.append(mainContainer)

  burger.classList.add('button--burger')
  burger.addEventListener('click', () => {
    menu.classList.toggle('menu--visible')
  })

  body.innerHTML = ''
  body.append(header, main)

  const validation = new JustValidate(moneyTransferForm, {
    errorLabelStyle: {},
    errorLabelCssClass: 'money-transfer-form__label-text--invalid',
    errorFieldCssClass: 'money-transfer-form__input--invalid',
  })

  function closeModal() {
    document.querySelector('.modal').remove()
    document.body.style.removeProperty('overflow')
  }

  async function sendForm() {
    try {
      const response = await transferFunds(
        {
          from: data.account,
          to: moneyTransferForm.account.value,
          amount: moneyTransferForm.amount.value,
        },
        localStorage.token
      )
      console.log(response)
      if (response.error === 'Invalid account from') {
        const modal = createModal({
          title: 'Ошибка',
          text: 'Номер счёта, с которого осуществляется перевод, не принадлежит вам',
          primaryButton: {
            text: 'Закрыть',
            clickHandler: closeModal,
          },
        })
        document.body.append(modal)
        document.body.style.overflow = 'hidden'
      } else if (response.error === 'Invalid account to') {
        const modal = createModal({
          title: 'Ошибка',
          text: 'Счёт, на который осуществляется перевод, не существует',
          primaryButton: {
            text: 'Закрыть',
            clickHandler: closeModal,
          },
        })
        document.body.append(modal)
        document.body.style.overflow = 'hidden'
      } else if (response.error === 'Invalid amount') {
        const modal = createModal({
          title: 'Ошибка',
          text: 'Не указана сумма перевода, или она отрицательна',
          primaryButton: {
            text: 'Закрыть',
            clickHandler: closeModal,
          },
        })
        document.body.append(modal)
        document.body.style.overflow = 'hidden'
      } else if (response.error === 'Overdraft prevented') {
        const modal = createModal({
          title: 'Ошибка',
          text: 'На счёте недостаточно средств. Уменьшите сумму перевода',
          primaryButton: {
            text: 'Закрыть',
            clickHandler: closeModal,
          },
        })
        document.body.append(modal)
        document.body.style.overflow = 'hidden'
      } else {
        const modal = createModal({
          title: 'Перевод завершён',
          text: `Вы перевели ${moneyTransferForm.amount.value}₽ на счёт №${moneyTransferForm.account.value}`,
          primaryButton: {
            text: 'Закрыть',
            clickHandler: () => reload(`/accounts/${data.account}`),
          },
        })
        document.body.append(modal)
        document.body.style.overflow = 'hidden'
      }
    } catch {
      const modal = createModal({
        title: 'Ошибка',
        text: 'Отстутствует подключение к серверу. Обратитесь в техническую поддержку',
        primaryButton: {
          text: 'Закрыть',
          clickHandler: closeModal,
        },
      })
      document.body.append(modal)
      document.body.style.overflow = 'hidden'
    }
  }

  validation
    .addField('.money-transfer-form__input--account', [
      {
        rule: 'required',
        errorMessage: 'Введите номер счёта',
      },
      {
        validator: (value) => {
          return data.account !== value
        },
        errorMessage: 'Перевод самому себе невозможен',
      },
    ])
    .addField('.money-transfer-form__input--amount', [
      {
        rule: 'required',
        errorMessage: 'Введите сумму перевода',
      },
    ])
    .onSuccess(sendForm)

  const balanceChartCanvas = balanceChart.querySelector('canvas')
  const monthlyBalanceData = monthlyBalance(data, 6)

  chartInit(
    balanceChartCanvas,
    {
      labels: monthlyBalanceData.map((entry) => entry.month),
      datasets: [
        {
          data: monthlyBalanceData.map((entry) => entry.balance),
          backgroundColor: '#116ACC',
        },
      ],
    },
    {
      arrayForMin: monthlyBalanceData.map((entry) => entry.balance),
      arrayForMax: monthlyBalanceData.map((entry) => entry.balance),
    }
  )
}
