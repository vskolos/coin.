import { el } from 'redom'
import createPrimaryButton from '../button/--primary/button--primary'
import createSecondaryButton from '../button/--secondary/button--secondary'
import './modal.scss'

// data = { title, text, button }
//   button = { text, icon, handler }
export default class Modal {
  constructor(data) {
    const backdrop = el('.modal')
    this.element = backdrop

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

    const buttons = el('.modal__buttons')
    modal.append(buttons)

    if (data.button) {
      const primaryButton = createPrimaryButton(data.button)
      buttons.append(primaryButton)

      const closeButton = createSecondaryButton({
        text: 'Закрыть',
        handler: () => this.close(),
      })
      buttons.append(closeButton)
    } else {
      const closeButton = createPrimaryButton({
        text: 'Закрыть',
        handler: () => this.close(),
      })
      buttons.append(closeButton)
    }
  }

  open() {
    document.body.append(this.element)
    document.body.style.overflow = 'hidden'
  }

  close() {
    this.element.remove()
    document.body.style.removeProperty('overflow')
  }
}
