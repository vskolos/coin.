import { el } from 'redom'
import './balance-chart.scss'

export default function createBalanceChart(name) {
  const div = el('.balance-chart')
  const title = el('p.balance-chart__title', name)
  const canvas = el('canvas.balance-chart__canvas')

  div.append(title, canvas)
  return div
}
