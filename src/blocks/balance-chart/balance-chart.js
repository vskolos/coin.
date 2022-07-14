import { el } from 'redom'
import './balance-chart.scss'

// Создание блока для отрисовки графика
export default function createBalanceChart(name) {
  const div = el('.balance-chart')
  const title = el('p.balance-chart__title', name)
  const canvas = el(
    'canvas.balance-chart__canvas.balance-chart__canvas--skeleton'
  )

  div.append(title, canvas)
  return div
}
