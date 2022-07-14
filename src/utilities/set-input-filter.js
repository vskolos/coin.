// Добавление фильтра filter на ввод в поле input
export default function setInputFilter(input, filter) {
  const events = [
    'input',
    'keydown',
    'keyup',
    'mousedown',
    'mouseup',
    'select',
    'focusout',
  ]
  events.forEach((event) => {
    input.addEventListener(event, function () {
      if (filter(this.value)) {
        // Если фильтр пройден
        this.oldValue = this.value
        this.oldSelectionStart = this.selectionStart
        this.oldSelectionEnd = this.selectionEnd
      } else if (Object.prototype.hasOwnProperty.call(this, 'oldValue')) {
        // Если фильтр не пройден, восстанавливаем предыдущее значение
        this.value = this.oldValue
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd)
      } else {
        // Если фильтр не пройден, и нечего восстанавливать
        this.value = ''
      }
    })
  })
}
