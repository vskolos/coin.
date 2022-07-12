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

// TODO: Add 1/4 of array for history page

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
    if (canvas.offsetWidth >= 320) {
      Chart.defaults.font.size = 20
    } else {
      Chart.defaults.font.size = 14
    }
  }

  function ticksCallback(val) {
    if (canvas.offsetWidth >= 480) {
      return val === 0 ||
        val === Math.max(...arrayForMid) ||
        val === Math.max(...arrayForMax)
        ? Math.ceil(val).toLocaleString('ru-RU').replace(',', '.')
        : ''
    } else {
      return val === 0 ||
        val === Math.max(...secondHalfOf(arrayForMid)) ||
        val === Math.max(...secondHalfOf(arrayForMax))
        ? Math.ceil(val).toLocaleString('ru-RU').replace(',', '.')
        : ''
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
      min:
        canvas.offsetWidth >= 480
          ? Math.min(Math.min(...arrayForMin), 0)
          : Math.min(Math.min(...secondHalfOf(arrayForMin)), 0),
      max:
        canvas.offsetWidth >= 480
          ? Math.max(...arrayForMax)
          : Math.max(...secondHalfOf(arrayForMax)),
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

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: canvas.offsetWidth >= 480 ? labels : secondHalfOf(labels),
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
