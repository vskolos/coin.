import Modal from '../blocks/modal/modal'

const errorMessage = {
  Unauthorized:
    'В запросе отсутствует токен. Обратитесь в техническую поддержку',
  'No such user': 'Пользователя с таким логином не существует',
  'Invalid password': 'Введен неверный пароль',
  'No token':
    'В ответе сервера отсутствует токен. Обратитесь в техническую поддержку',
  'Failed to fetch':
    'Отстутствует подключение к серверу. Обратитесь в техническую поддержку',
  'Invalid account from':
    'Номер счёта, с которого осуществляется перевод, не принадлежит вам',
  'Invalid account to':
    'Счёт, на который осуществляется перевод, не существует',
  'Invalid amount': 'Не указана сумма, или она отрицательна',
  'Overdraft prevented':
    'На счёте недостаточно средств. Уменьшите сумму перевода',
  'Unknown currency code':
    'Передан неверный код валюты. Обратитесь в техническую поддержку',
  'Not enough currency':
    'На валютном счёте недостаточно средств. Уменьшите сумму перевода',
}

export default function handleError(error) {
  console.log(error)
  const modal = new Modal({
    title: 'Ошибка',
    text: errorMessage[error.message]
      ? errorMessage[error.message]
      : error.message,
  })
  modal.open()
}
