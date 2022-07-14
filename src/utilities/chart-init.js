import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
} from 'chart.js'

// Вернуть вторую половину переданного массива
function secondHalfOf(array) {
  const halfLength = Math.floor(array.length / 2)
  return array.slice(-halfLength).length > 0 ? array.slice(-halfLength) : array
}

// Инициализировать Chart.js в переданном canvas
export default function chartInit(canvas, data, options) {
  const labels = data.labels
  const datasets = data.datasets

  // Массивы для вычисления минимального, среднего и максимального значения
  const arrayForMin = options.arrayForMin ? options.arrayForMin : []
  const arrayForMid = options.arrayForMid ? options.arrayForMid : []
  const arrayForMax = options.arrayForMax ? options.arrayForMax : []

  Chart.register(BarElement, BarController, CategoryScale, LinearScale)

  // Конфигурация стандартного шрифта
  Chart.defaults.font = {
    family: '"Work Sans", Helvetica, sans-serif',
    size: window.innerWidth >= 768 ? 20 : 10,
    lineHeight: 1.1,
    weight: 500,
  }
  Chart.defaults.color = '#000'

  // Конфигурация отображаемых данных
  const datasetsConfig = []
  datasets.forEach((dataset) => {
    datasetsConfig.push({
      data:
        canvas.offsetWidth >= 480 ? dataset.data : secondHalfOf(dataset.data),
      backgroundColor: dataset.backgroundColor,
    })
  })

  // Конфигурация размеров шрифта и отображаемых данных при изменении размера экрана
  function onResize(chart) {
    if (labels.length > 6) {
      // Если нужно отобразить больше шести столбцов
      if (canvas.offsetWidth >= 800) {
        // В зависимости от ширины canvas выводим либо их все
        chart.data.labels = labels
        chart.data.datasets.forEach((dataset, index) => {
          dataset.data = datasets[index].data
        })
      } else if (canvas.offsetWidth >= 480) {
        // Либо половину
        chart.data.labels = secondHalfOf(labels)
        chart.data.datasets.forEach((dataset, index) => {
          dataset.data = secondHalfOf(datasets[index].data)
        })
      } else {
        // Либо четверть
        chart.data.labels = secondHalfOf(secondHalfOf(labels))
        chart.data.datasets.forEach((dataset, index) => {
          dataset.data = secondHalfOf(secondHalfOf(datasets[index].data))
        })
      }
    } else {
      // Если же столбиков шесть или меньше
      if (canvas.offsetWidth >= 480) {
        // В зависимости от ширины canvas выводим либо их все
        chart.data.labels = labels
        chart.data.datasets.forEach((dataset, index) => {
          dataset.data = datasets[index].data
        })
      } else {
        // Либо половину
        chart.data.labels = secondHalfOf(labels)
        chart.data.datasets.forEach((dataset, index) => {
          dataset.data = secondHalfOf(datasets[index].data)
        })
      }
    }
    // В зависимости от ширины canvas изменяем размер шрифта
    if (canvas.offsetWidth >= 320) {
      Chart.defaults.font.size = 20
    } else {
      Chart.defaults.font.size = 14
    }
  }

  // Вычисляем отображаемые точки на оси Y графика
  function tickLabel(val, mid, max) {
    return val === 0 || val === mid || val === max
      ? Math.ceil(val).toLocaleString('ru-RU').replace(',', '.')
      : ''
  }

  // Конфигурация отображаемых точек на оси Y
  function ticksCallback(val) {
    if (labels.length > 6) {
      // Если нужно отобразить больше шести столбцов
      if (canvas.offsetWidth >= 800) {
        // В зависимости от ширины canvas вычисляем точки через полные массивы
        return tickLabel(
          val,
          Math.max(...arrayForMid),
          Math.max(...arrayForMax)
        )
      } else if (canvas.offsetWidth >= 480) {
        // Или через половину
        return tickLabel(
          val,
          Math.max(...secondHalfOf(arrayForMid)),
          Math.max(...secondHalfOf(arrayForMax))
        )
      } else {
        // Или через четверть
        return tickLabel(
          val,
          Math.max(...secondHalfOf(secondHalfOf(arrayForMid))),
          Math.max(...secondHalfOf(secondHalfOf(arrayForMax)))
        )
      }
    } else {
      // Если же столбиков шесть или меньше
      if (canvas.offsetWidth >= 480) {
        // В зависимости от ширины canvas вычисляем точки через полные массивы
        return tickLabel(
          val,
          Math.max(...arrayForMid),
          Math.max(...arrayForMax)
        )
      } else {
        // Или через половину
        return tickLabel(
          val,
          Math.max(...secondHalfOf(arrayForMid)),
          Math.max(...secondHalfOf(arrayForMax))
        )
      }
    }
  }

  // Вычисляем нижнюю границу графика (на случай, если она отрицательна)
  function minY(array) {
    if (labels.length > 6) {
      // Если нужно отобразить больше шести столбцов
      if (canvas.offsetWidth >= 800) {
        // В зависимости от ширины canvas вычисляем границу через весь массив
        return Math.min(Math.min(...array), 0)
      } else if (canvas.offsetWidth >= 480) {
        // Или через половину
        return Math.min(Math.min(...secondHalfOf(array)), 0)
      } else {
        // Или через четверть
        return Math.min(Math.min(...secondHalfOf(secondHalfOf(array))), 0)
      }
    } else {
      // Если же столбиков шесть или меньше
      if (canvas.offsetWidth >= 480) {
        // В зависимости от ширины canvas вычисляем границу через весь массив
        return Math.min(Math.min(...array), 0)
      } else {
        // Или через половину
        return Math.min(Math.min(...secondHalfOf(array)), 0)
      }
    }
  }

  function maxY(array) {
    if (labels.length > 6) {
      // Если нужно отобразить больше шести столбцов
      if (canvas.offsetWidth >= 800) {
        // В зависимости от ширины canvas вычисляем границу через весь массив
        return Math.max(...array)
      } else if (canvas.offsetWidth >= 480) {
        // Или через половину
        return Math.max(...secondHalfOf(array))
      } else {
        // Или через четверть
        return Math.max(...secondHalfOf(secondHalfOf(array)))
      }
    } else {
      // Если же столбиков шесть или меньше
      if (canvas.offsetWidth >= 480) {
        // В зависимости от ширины canvas вычисляем границу через весь массив
        return Math.max(...array)
      } else {
        // Или через половину
        return Math.max(...secondHalfOf(array))
      }
    }
  }

  // Конфигурация осей графика
  const scalesConfig = {
    x: {
      grid: {
        drawOnChartArea: false,
        drawBorder: false,
        drawTicks: false,
      },
      ticks: {
        font: {
          weight: 700,
        },
      },
      stacked: true,
    },
    y: {
      min: minY(arrayForMin),
      max: maxY(arrayForMax),
      grid: {
        drawOnChartArea: false,
        drawBorder: false,
        drawTicks: false,
      },
      position: 'right',
      ticks: {
        callback: ticksCallback,
        padding: 24,
      },
      stacked: true,
    },
  }

  // Нарисовать границу вокруг графика
  const chartAreaBorder = {
    id: 'chartAreaBorder',
    beforeDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { left, top, width, height },
      } = chart
      ctx.save()
      ctx.strokeStyle = options.borderColor
      ctx.lineWidth = options.borderWidth
      ctx.setLineDash(options.borderDash || [])
      ctx.lineDashOffset = options.borderDashOffset
      ctx.strokeRect(left, top, width, height)
      ctx.restore()
    },
  }

  // Конфигурация подписей оси X по умолчанию
  function initialLabels(array) {
    if (labels.length > 6) {
      // Если нужно отобразить больше шести столбцов
      if (canvas.offsetWidth >= 800) {
        // В зависимости от ширины canvas отображаем все подписки
        return array
      } else if (canvas.offsetWidth >= 480) {
        // Или половину
        return secondHalfOf(array)
      } else {
        // Или четверть
        return secondHalfOf(secondHalfOf(array))
      }
    } else {
      // Если же столбиков шесть или меньше
      if (canvas.offsetWidth >= 480) {
        // В зависимости от ширины canvas отображаем все подписки
        return array
      } else {
        // Или половину
        return secondHalfOf(array)
      }
    }
  }

  // Инициализируем Chart.js с описанной конфигурацией
  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: initialLabels(labels),
      datasets: datasetsConfig,
    },
    options: {
      maintainAspectRatio: false,
      onResize: onResize,
      maxBarThickness: 50,
      scales: scalesConfig,
      layout: {
        padding: 10,
      },
    },
    plugins: [chartAreaBorder],
  })
}
