import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
} from 'chart.js'

function secondHalfOf(array) {
  const halfLength = Math.floor(array.length / 2)
  return array.slice(-halfLength).length > 0 ? array.slice(-halfLength) : array
}

// data = { labels, datasets }
// datasets = [ dataset1, dataset2, ... ]
// datasetN = { data, backgroundColor }
// options = { arrayForMin, arrayForMid, arrayForMax }
export default function chartInit(canvas, data, options) {
  const labels = data.labels
  const datasets = data.datasets
  const arrayForMin = options.arrayForMin ? options.arrayForMin : []
  const arrayForMid = options.arrayForMid ? options.arrayForMid : []
  const arrayForMax = options.arrayForMax ? options.arrayForMax : []

  Chart.register(BarElement, BarController, CategoryScale, LinearScale)
  Chart.defaults.font = {
    family: '"Work Sans", Helvetica, sans-serif',
    size: window.innerWidth >= 768 ? 20 : 10,
    lineHeight: 1.1,
    weight: 500,
  }
  Chart.defaults.color = '#000'

  const datasetsConfig = []
  datasets.forEach((dataset) => {
    datasetsConfig.push({
      data:
        canvas.offsetWidth >= 480 ? dataset.data : secondHalfOf(dataset.data),
      backgroundColor: dataset.backgroundColor,
    })
  })

  function onResize(chart) {
    if (labels.length > 6) {
      if (canvas.offsetWidth >= 800) {
        chart.data.labels = labels
        chart.data.datasets.forEach((dataset, index) => {
          dataset.data = datasets[index].data
        })
      } else if (canvas.offsetWidth >= 480) {
        chart.data.labels = secondHalfOf(labels)
        chart.data.datasets.forEach((dataset, index) => {
          dataset.data = secondHalfOf(datasets[index].data)
        })
      } else {
        chart.data.labels = secondHalfOf(secondHalfOf(labels))
        chart.data.datasets.forEach((dataset, index) => {
          dataset.data = secondHalfOf(secondHalfOf(datasets[index].data))
        })
      }
    } else {
      if (canvas.offsetWidth >= 480) {
        chart.data.labels = labels
        chart.data.datasets.forEach((dataset, index) => {
          dataset.data = datasets[index].data
        })
      } else {
        chart.data.labels = secondHalfOf(labels)
        chart.data.datasets.forEach((dataset, index) => {
          dataset.data = secondHalfOf(datasets[index].data)
        })
      }
    }
    if (canvas.offsetWidth >= 320) {
      Chart.defaults.font.size = 20
    } else {
      Chart.defaults.font.size = 14
    }
  }

  function tickLabel(val, mid, max) {
    return val === 0 || val === mid || val === max
      ? Math.ceil(val).toLocaleString('ru-RU').replace(',', '.')
      : ''
  }

  function ticksCallback(val) {
    if (labels.length > 6) {
      if (canvas.offsetWidth >= 800) {
        return tickLabel(
          val,
          Math.max(...arrayForMid),
          Math.max(...arrayForMax)
        )
      } else if (canvas.offsetWidth >= 480) {
        return tickLabel(
          val,
          Math.max(...secondHalfOf(arrayForMid)),
          Math.max(...secondHalfOf(arrayForMax))
        )
      } else {
        return tickLabel(
          val,
          Math.max(...secondHalfOf(secondHalfOf(arrayForMid))),
          Math.max(...secondHalfOf(secondHalfOf(arrayForMax)))
        )
      }
    } else {
      if (canvas.offsetWidth >= 480) {
        return tickLabel(
          val,
          Math.max(...arrayForMid),
          Math.max(...arrayForMax)
        )
      } else {
        return tickLabel(
          val,
          Math.max(...secondHalfOf(arrayForMid)),
          Math.max(...secondHalfOf(arrayForMax))
        )
      }
    }
  }

  function minY(array) {
    if (labels.length > 6) {
      if (canvas.offsetWidth >= 800) {
        return Math.min(Math.min(...array), 0)
      } else if (canvas.offsetWidth >= 480) {
        return Math.min(Math.min(...secondHalfOf(array)), 0)
      } else {
        return Math.min(Math.min(...secondHalfOf(secondHalfOf(array))), 0)
      }
    } else {
      if (canvas.offsetWidth >= 480) {
        return Math.min(Math.min(...array), 0)
      } else {
        return Math.min(Math.min(...secondHalfOf(array)), 0)
      }
    }
  }

  function maxY(array) {
    if (labels.length > 6) {
      if (canvas.offsetWidth >= 800) {
        return Math.max(...array)
      } else if (canvas.offsetWidth >= 480) {
        return Math.max(...secondHalfOf(array))
      } else {
        return Math.max(...secondHalfOf(secondHalfOf(array)))
      }
    } else {
      if (canvas.offsetWidth >= 480) {
        return Math.max(...array)
      } else {
        return Math.max(...secondHalfOf(array))
      }
    }
  }

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

  function initialLabels(array) {
    if (labels.length > 6) {
      if (canvas.offsetWidth >= 800) {
        return array
      } else if (canvas.offsetWidth >= 480) {
        return secondHalfOf(array)
      } else {
        return secondHalfOf(secondHalfOf(array))
      }
    } else {
      if (canvas.offsetWidth >= 480) {
        return array
      } else {
        return secondHalfOf(array)
      }
    }
  }

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
