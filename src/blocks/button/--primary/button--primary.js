import createButton from '../button'
import './button--primary.scss'

// Создание основной кнопки
export default function createPrimaryButton(data) {
  const button = createButton(data)
  button.classList.add('button--primary')

  return button
}
