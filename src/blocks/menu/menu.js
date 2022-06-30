import { el } from 'redom'
import createSecondaryButton from '../button/--secondary/button--secondary.js'
import './menu.scss'

export default function createMenu(items) {
  const nav = el('nav.menu')
  const list = el('ul.menu__list')

  items.forEach((item) => {
    list.append(el('li.menu__item', createSecondaryButton(item)))
  })

  nav.append(list)
  return nav
}
