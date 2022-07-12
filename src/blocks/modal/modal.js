import { el } from 'redom'
import createPrimaryButton from '../button/--primary/button--primary'
import createSecondaryButton from '../button/--secondary/button--secondary'
import './modal.scss'

// data = { title, text, primaryButton, secondaryButton }
// Xbutton = { text, icon, clickHandler }
export default function createModal(data) {
  const backdrop = el('.modal')

  const modal = el('.modal__card')
  backdrop.append(modal)

  if (data.title) {
    const title = el('p.modal__title')
    title.textContent = data.title
    modal.append(title)
  }

  if (data.text) {
    const text = el('span.modal__text', data.text)
    modal.append(text)
  }

  if (data.primaryButton || data.secondaryButton) {
    const buttons = el('.modal__buttons')
    modal.append(buttons)

    if (data.primaryButton) {
      const primaryButton = createPrimaryButton({
        text: data.primaryButton.text,
        icon: data.primaryButton.icon,
      })
      primaryButton.addEventListener('click', data.primaryButton.clickHandler)
      buttons.append(primaryButton)
    }

    if (data.secondaryButton) {
      const secondaryButton = createSecondaryButton({
        text: data.secondaryButton.text,
        icon: data.secondaryButton.icon,
      })
      secondaryButton.addEventListener(
        'click',
        data.secondaryButton.clickHandler
      )
      buttons.append(secondaryButton)
    }
  }

  return backdrop
}
