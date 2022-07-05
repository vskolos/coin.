import { el } from 'redom'
import createPrimaryButton from '../button/--primary/button--primary'
import './money-transfer-form.scss'
import Envelope from '../../assets/images/envelope.svg'

export default function createMoneyTransferForm() {
  const form = el('form.money-transfer-form')
  const title = el('p.money-transfer-form__title', 'Новый перевод')
  const account = el(
    'label.money-transfer-form__label',
    el('span.money-transfer-form__label-text', 'Номер счёта получателя'),
    el('input.money-transfer-form__input', {
      placeholder: '80304641174040315022502625',
      type: 'number',
      name: 'account',
    })
  )
  const amount = el(
    'label.money-transfer-form__label',
    el('span.money-transfer-form__label-text', 'Сумма перевода'),
    el('input.money-transfer-form__input', {
      placeholder: '1000 ₽',
      type: 'number',
      name: 'amount',
    })
  )
  const button = createPrimaryButton({ text: 'Отправить', icon: Envelope })
  button.type = 'submit'

  form.addEventListener('submit', (e) => {
    e.preventDefault()
  })

  form.append(title, account, amount, button)
  return form
}
