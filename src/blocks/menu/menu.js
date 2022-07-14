import { el } from 'redom'
import createSecondaryButton from '../button/--secondary/button--secondary'
import './menu.scss'

// Создание блока меню
export default function createMenu(items) {
  const nav = el('nav.menu')
  const list = el('ul.menu__list')

  items.forEach((item) => {
    const listItem = el('li.menu__item')
    const button = createSecondaryButton({
      text: item.text,
      handler: item.handler,
    })

    if (item.disabled) {
      button.disabled = true
    }

    listItem.append(button)
    list.append(listItem)
  })

  nav.append(list)
  return nav
}
