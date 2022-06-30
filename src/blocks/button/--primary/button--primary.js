import createButton from '../button.js'
import './button--primary.scss'

export default function createPrimaryButton(text) {
  const button = createButton(text)
  button.classList.add('button--primary')

  return button
}
