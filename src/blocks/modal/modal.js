import { el } from 'redom'
import createPrimaryButton from '../button/--primary/button--primary'
import createSecondaryButton from '../button/--secondary/button--secondary'
import './modal.scss'

// Создание модального окна
export default class Modal {
  constructor(data) {
    this.element = el('.modal')

    const modal = el('.modal__card')
    this.element.append(modal)

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
      // Если передали данные основной кнопки, добавляем её
      const primaryButton = createPrimaryButton(data.button)
      buttons.append(primaryButton)

      const closeButton = createSecondaryButton({
        text: 'Закрыть',
        handler: () => this.close(),
      })
      buttons.append(closeButton)
    } else {
      // Иначе делаем кнопку "Закрыть" основной
      const closeButton = createPrimaryButton({
        text: 'Закрыть',
        handler: () => this.close(),
      })
      buttons.append(closeButton)
    }
  }

  // Открыть модальное окно
  open() {
    document.body.append(this.element)
    document.body.style.overflow = 'hidden'
  }

  // Закрыть модальное окно
  close() {
    this.element.remove()
    document.body.style.removeProperty('overflow')
  }
}
