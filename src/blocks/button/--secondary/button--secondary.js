import createButton from '../button'
import './button--secondary.scss'

// Создание дополнительной кнопки
export default function createSecondaryButton(data) {
  const button = createButton(data)
  button.classList.add('button--secondary')

  return button
}
