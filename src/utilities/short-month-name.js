// Вычисление скоращенного названия месяца по дате
export default function shortMonthName(date) {
  return date.toLocaleString('ru-RU', { month: 'short' }).slice(0, 3)
}
