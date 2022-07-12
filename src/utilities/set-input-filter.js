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
    input.addEventListener(event, function (e) {
      if (filter(this.value)) {
        // Accepted value
        this.oldValue = this.value
        this.oldSelectionStart = this.selectionStart
        this.oldSelectionEnd = this.selectionEnd
      } else if (Object.prototype.hasOwnProperty.call(this, 'oldValue')) {
        // Rejected value - restore the previous one
        this.value = this.oldValue
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd)
      } else {
        // Rejected value - nothing to restore
        this.value = ''
      }
    })
  })
}
