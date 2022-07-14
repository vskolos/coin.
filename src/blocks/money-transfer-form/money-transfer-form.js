import { el } from 'redom'
import JustValidate from 'just-validate'
import createPrimaryButton from '../button/--primary/button--primary'
import setInputFilter from '../../utilities/set-input-filter'
import autocomplete from '../../utilities/autocomplete'
import Modal from '../modal/modal'
import transferFunds from '../../api/transfer-funds'
import handleError from '../../utilities/handle-error'
import Envelope from '../../assets/images/envelope.svg'
import './money-transfer-form.scss'

export default function createMoneyTransferForm(id) {
  const form = el('form.money-transfer-form', { autocomplete: 'off' })
  const title = el('p.money-transfer-form__title', 'Новый перевод')

  const account = el(
    'label.money-transfer-form__label',
    el('span.money-transfer-form__label-text', 'Номер счёта получателя')
  )
  const accountInput = el(
    'input.money-transfer-form__input.money-transfer-form__input--account',
    {
      placeholder: '80304641174040315022502625',
      name: 'account',
    }
  )
  account.append(accountInput)

  setInputFilter(accountInput, (value) => /^\d*$/.test(value))

  const amount = el(
    'label.money-transfer-form__label',
    el('span.money-transfer-form__label-text', 'Сумма перевода')
  )
  const amountInput = el(
    'input.money-transfer-form__input.money-transfer-form__input--amount',
    {
      placeholder: '1000 ₽',
      name: 'amount',
    }
  )
  amount.append(amountInput)

  setInputFilter(amountInput, (value) => /^\d*\.?\d*$/.test(value))

  const button = createPrimaryButton({ text: 'Отправить', icon: Envelope })
  button.type = 'submit'

  if (localStorage.accounts) {
    try {
      const data = JSON.parse(localStorage.accounts).filter((val) =>
        val.match(/^\d+$/)
      )
      autocomplete(accountInput, data)
    } catch {
      localStorage.accounts = '[]'
    }
  } else {
    localStorage.accounts = '[]'
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
  })

  form.append(title, account, amount, button)

  const validation = new JustValidate(form, {
    errorLabelStyle: {},
    errorLabelCssClass: 'money-transfer-form__label-text--invalid',
    errorFieldCssClass: 'money-transfer-form__input--invalid',
  })

  async function sendForm() {
    try {
      const response = await transferFunds(
        {
          from: id,
          to: form.account.value,
          amount: form.amount.value,
        },
        localStorage.token
      )
      if (response.error) {
        throw new Error(response.error)
      }
      const modal = new Modal({
        title: 'Перевод завершён',
        text: `Вы перевели ${form.amount.value}₽ на счёт №${form.account.value}`,
      })
      modal.open()

      if (localStorage.accounts) {
        try {
          const data = JSON.parse(localStorage.accounts).filter((val) =>
            val.match(/^\d+$/)
          )
          if (!data.includes(accountInput.value)) {
            data.push(accountInput.value)
          }
          localStorage.accounts = JSON.stringify(data)
        } catch {
          localStorage.accounts = `[${accountInput.value}]`
        }
      } else {
        localStorage.accounts = `[${accountInput.value}]`
      }
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
      {
        validator: (value) => {
          return value > 0
        },
        errorMessage: 'Сумма перевода должна быть больше 0',
      },
    ])
    .onSuccess(sendForm)

  return form
}
