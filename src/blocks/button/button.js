import { el } from 'redom'
import './button.scss'

// Создание кнопки
export default function createButton(data) {
  const button = el('button.button')

  if (data.icon) {
    const icon = el('.button__icon')
    icon.innerHTML = data.icon
    button.append(icon)
  }

  if (data.text) {
    const text = el('span.button__text', data.text)
    button.append(text)
  }

  if (data.handler) {
    button.addEventListener('click', data.handler)
  }

  return button
}
