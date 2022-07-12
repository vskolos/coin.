import { el } from 'redom'

export default function autocomplete(input, array) {
  if (!array) return

  let currentFocus

  const events = ['focus', 'input']
  events.forEach((event) => {
    input.addEventListener(event, function () {
      closeAllLists()

      currentFocus = -1

      const list = el('ul.autocomplete-list')

      array.forEach((entry) => {
        if (!this.value || (entry.match(this.value) && entry !== this.value)) {
          const item = el('li.autocomplete-list__item', entry)
          const hiddenInput = el('input.autocomplete-list__item-input', {
            type: 'hidden',
            value: entry,
          })

          item.append(hiddenInput)
          item.addEventListener('click', () => {
            this.value = hiddenInput.value
            closeAllLists()
          })

          list.append(item)
        }
      })

      if (list.childElementCount > 0) {
        this.parentNode.append(list)
      }
    })
  })

  input.addEventListener('keydown', function (e) {
    const list = this.parentNode.querySelector('.autocomplete-list')
    if (!list) return
    const items = list.querySelectorAll('.autocomplete-list__item')
    if (e.keyCode == 40) {
      // Стрелка вниз
      currentFocus++
      addActive(items)
    } else if (e.keyCode == 38) {
      // Стрелка вверх
      currentFocus--
      addActive(items)
    } else if (e.keyCode == 13) {
      // Клавиша Enter
      e.preventDefault()
      if (currentFocus > -1) {
        if (items) items[currentFocus].click()
      }
    }
  })

  input.addEventListener('blur', () => setTimeout(closeAllLists, 100))

  function addActive(items) {
    if (!items) return false
    removeActive(items)

    if (currentFocus >= items.length) currentFocus = 0
    if (currentFocus < 0) currentFocus = items.length - 1
    items[currentFocus].classList.add('autocomplete-list__item--active')
  }

  function removeActive(items) {
    // a function to remove the "active" class from all autocomplete items
    items.forEach((item) => {
      item.classList.remove('autocomplete-list__item--active')
    })
  }

  function closeAllLists(element) {
    // close all autocomplete lists in the document, except the one passed as an argument
    const lists = document.querySelectorAll('.autocomplete-list')
    lists.forEach((list) => {
      if (element !== list && element !== input) {
        list.remove()
      }
    })
  }
}
