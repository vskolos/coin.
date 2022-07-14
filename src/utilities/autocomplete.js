import { el } from 'redom'

export default function autocomplete(input, array) {
  // Если не передан массив с данными для автодополнения или он пуст, завершаем работу
  if (!array) return

  // Переменная для навигации по вариантам автодополнения
  let currentFocus

  const events = ['focus', 'input']
  events.forEach((event) => {
    input.addEventListener(event, function () {
      // Закрываем все всплывающие списки, если они были открыты
      closeAllLists()

      // Сбрасываем фокус для навигации
      currentFocus = -1

      const list = el('ul.autocomplete-list')

      array.forEach((entry) => {
        if (!this.value || (entry.match(this.value) && entry !== this.value)) {
          // Добавляем только те элементы, которые начинаются с текста из поля ввода
          const item = el('li.autocomplete-list__item', entry)

          // Скрытый input для хранения значения подсказки
          const hiddenInput = el('input.autocomplete-list__item-input', {
            type: 'hidden',
            value: entry,
          })

          item.append(hiddenInput)
          item.addEventListener('click', () => {
            // Подставляем значение из скрытого поля в основное
            this.value = hiddenInput.value
            closeAllLists()
          })

          list.append(item)
        }
      })

      if (list.childElementCount > 0) {
        // Добавляем прошедшие фильтрацию элементы в список
        this.parentNode.append(list)
      }
    })
  })

  // Обрабатываем навигацию с клавиатуры
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

  // Скрываем список подсказок при потере фокуса
  input.addEventListener('blur', () => setTimeout(closeAllLists, 100))

  // Добавить класс активного элемента для подсвечивания
  function addActive(items) {
    if (!items) return false

    // Убираем класс активного элемента со всех элементов
    removeActive(items)

    // Корректируем индекс активного элемента на границах списка
    if (currentFocus >= items.length) currentFocus = 0
    if (currentFocus < 0) currentFocus = items.length - 1

    // Добавляем класс выбранному элементу
    items[currentFocus].classList.add('autocomplete-list__item--active')
  }

  // Убрать класс активного элемента со всех элементов
  function removeActive(items) {
    items.forEach((item) => {
      item.classList.remove('autocomplete-list__item--active')
    })
  }

  // Закрыть все открытые списки автодополнения, кроме текущего
  function closeAllLists(element) {
    const lists = document.querySelectorAll('.autocomplete-list')
    lists.forEach((list) => {
      if (element !== list && element !== input) {
        list.remove()
      }
    })
  }
}
