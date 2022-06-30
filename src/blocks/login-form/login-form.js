import { el } from 'redom'
import createPrimaryButton from '../button/--primary/button--primary.js'
import './login-form.scss'

export default function createLoginForm() {
  const form = el('form.login-form')
  const title = el('p.login-form__title', 'Вход в аккаунт')
  const login = el(
    'label.login-form__label',
    el('span.login-form__label-text', 'Логин'),
    el('input.login-form__input', {
      placeholder: 'Введите логин',
      type: 'text',
    })
  )
  const password = el(
    'label.login-form__label',
    el('span.login-form__label-text', 'Пароль'),
    el('input.login-form__input', {
      placeholder: 'Введите пароль',
      type: 'password',
    })
  )
  const button = createPrimaryButton('Войти')
  button.type = 'submit'

  form.append(title, login, password, button)
  return form
}
