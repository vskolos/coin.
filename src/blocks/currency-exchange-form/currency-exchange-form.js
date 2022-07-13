import { el } from 'redom'
import './currency-exchange-form.scss'
import createPrimaryButton from '../button/--primary/button--primary'
import setInputFilter from '../../utilities/set-input-filter'

export default function createCurrencyExchangeForm(currencies) {
  const form = el('form.currency-exchange-form')
  const title = el('p.currency-exchange-form__title', 'Обмен валюты')
  const options = el('.currency-exchange-form__options')

  const from = el(
    'label.currency-exchange-form__label',
    el('span.currency-exchange-form__label-text', 'Из')
  )
  const fromSelect = el(
    'select.currency-exchange-form__select.js-exchange-from'
  )
  const to = el(
    'label.currency-exchange-form__label',
    el('span.currency-exchange-form__label-text', 'в')
  )
  const toSelect = el('select.currency-exchange-form__select.js-exchange-to')

  currencies.forEach((currency) => {
    fromSelect.append(
      el('option.currency-exchange-form__option', currency, { value: currency })
    )
    toSelect.append(
      el('option.currency-exchange-form__option', currency, { value: currency })
    )
  })

  const amount = el('label.currency-exchange-form__label', 'Сумма')
  const amountInput = el(
    'input.currency-exchange-form__input.currency-exchange-form__input--amount',
    {
      placeholder: '0.1235421',
      name: 'amount',
    }
  )
  amount.append(amountInput)

  setInputFilter(amountInput, (value) => /^\d*\.?\d*$/.test(value))

  const button = createPrimaryButton({ text: 'Обменять' })
  button.type = 'submit'
  button.name = 'submit'

  from.append(fromSelect)
  to.append(toSelect)
  options.append(from, to, amount)
  form.append(title, options, button)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
  })

  return form
}
