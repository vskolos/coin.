import createButton from '../button.js'
import './button--primary.scss'

// data = { text, icon }
export default function createPrimaryButton(data) {
  const button = createButton(data)
  button.classList.add('button--primary')

  return button
}
