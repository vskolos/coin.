import { el } from 'redom'
import createPrimaryButton from '../button/--primary/button--primary'
import setInputFilter from '../../utilities/set-input-filter'
import autocomplete from '../../utilities/autocomplete'
import './money-transfer-form.scss'
import Envelope from '../../assets/images/envelope.svg'

// TODO: Add account number history using localStorage

export default function createMoneyTransferForm() {
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

  if (localStorage.autocompleteAccounts) {
    const data = JSON.parse(localStorage.autocompleteAccounts)
    autocomplete(accountInput, data)
  } else {
    localStorage.autocompleteAccounts = '[]'
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (localStorage.autocompleteAccounts) {
      const data = JSON.parse(localStorage.autocompleteAccounts)
      if (!data.includes(accountInput.value)) {
        data.push(accountInput.value)
      }
      localStorage.autocompleteAccounts = JSON.stringify(data)
    } else {
      localStorage.autocompleteAccounts = `[${accountInput.value}]`
    }
  })

  form.append(title, account, amount, button)
  return form
}
