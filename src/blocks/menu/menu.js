import { el } from 'redom'
import createSecondaryButton from '../button/--secondary/button--secondary'
import './menu.scss'

// items = [ item1, item2, ... ]
//   itemN = { text, disabled, handler }
export default function createMenu(items) {
  const nav = el('nav.menu')
  const list = el('ul.menu__list')

  items.forEach((item) => {
    const listItem = el('li.menu__item')
    const button = createSecondaryButton({ text: item.text })

    if (item.disabled) {
      button.disabled = true
    }

    if (item.handler) {
      button.addEventListener('click', item.handler)
    }
    listItem.append(button)
    list.append(listItem)
  })

  nav.append(list)
  return nav
}
