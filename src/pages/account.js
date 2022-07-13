// CSS
import 'normalize.css'
import '../common/common.scss'

// Libraries
import JustValidate from 'just-validate'

// Blocks
import createHeader from '../blocks/header/header'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createTopRow from '../blocks/top-row/top-row'
import createAccountInfo from '../blocks/account-info/account-info'
import createMoneyTransferForm from '../blocks/money-transfer-form/money-transfer-form'
import createBalanceChart from '../blocks/balance-chart/balance-chart'
import MoneyTransferHistory from '../blocks/money-transfer-history/money-transfer-history'
import Modal from '../blocks/modal/modal'

// API
import account from '../api/account'
import transferFunds from '../api/transfer-funds'

// Utilities
import reload from '../app'
import logout from '../utilities/logout'
import monthlyBalance from '../utilities/monthly-balance'
import chartInit from '../utilities/chart-init'
import handleError from '../utilities/handle-error'

// SVG
import Arrow from '../assets/images/arrow.svg'

export default async function renderAccountPage(id) {
  const body = document.body
  const header = createHeader([
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

  const topRow = createTopRow(['title', 'account', 'balance', 'button'], {
    title: 'Просмотр счёта',
    account: id,
    button: {
      text: 'Вернуться назад',
      icon: Arrow,
      handler: () => reload('/accounts'),
    },
  })
  mainContainer.append(topRow)

  const accountInfo = createAccountInfo()
  const moneyTransferForm = createMoneyTransferForm()

  const balanceChart = createBalanceChart('Динамика баланса')
  balanceChart.style.cursor = 'pointer'
  balanceChart.addEventListener('click', () =>
    reload(`/accounts/${id}/history`)
  )

  const moneyTransferHistory = new MoneyTransferHistory(null, 10)
  moneyTransferHistory.element.style.cursor = 'pointer'
  moneyTransferHistory.element.addEventListener('click', () =>
    reload(`/accounts/${id}/history`)
  )

  accountInfo.append(
    moneyTransferForm,
    balanceChart,
    moneyTransferHistory.element
  )
  mainContainer.append(accountInfo)
  main.append(mainContainer)

  body.innerHTML = ''
  body.append(header, main)

  const validation = new JustValidate(moneyTransferForm, {
    errorLabelStyle: {},
    errorLabelCssClass: 'money-transfer-form__label-text--invalid',
    errorFieldCssClass: 'money-transfer-form__input--invalid',
  })

  async function sendForm() {
    try {
      const response = await transferFunds(
        {
          from: id,
          to: moneyTransferForm.account.value,
          amount: moneyTransferForm.amount.value,
        },
        localStorage.token
      )
      if (response.error) {
        throw new Error(response.error)
      }
      const modal = new Modal({
        title: 'Перевод завершён',
        text: `Вы перевели ${moneyTransferForm.amount.value}₽ на счёт №${moneyTransferForm.account.value}`,
      })
      modal.open()
    } catch (error) {
      handleError(error)
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
          return id !== value
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

  account(id, localStorage.token)
    .then((response) => {
      if (response.error) {
        throw new Error(response.error)
      }
      return response.payload
    })
    .then((data) => {
      const newTopRow = createTopRow(
        ['title', 'account', 'balance', 'button'],
        {
          title: 'Просмотр счёта',
          account: id,
          balance: data.balance,
          button: {
            text: 'Вернуться назад',
            icon: Arrow,
            handler: () => reload('/accounts'),
          },
        }
      )
      mainContainer.replaceChild(newTopRow, topRow)

      const balanceChartCanvas = balanceChart.querySelector('canvas')
      balanceChartCanvas.classList.remove('balance-chart__canvas--skeleton')
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

      const newMoneyTransferHistory = new MoneyTransferHistory(data, 10)
      accountInfo.replaceChild(
        newMoneyTransferHistory.element,
        moneyTransferHistory.element
      )
    })
    .catch((error) => handleError(error))
}
