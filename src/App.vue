<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { nextTick, onMounted, ref, watch } from 'vue'
import { getRandomElement, getTwoRandomElements } from './lib/array'
import { sleep } from './lib/async'
import { getMiddle, getRandomPointBetween, point } from './lib/point'

/* Params */
const delay = ref(0)
const maxPoints = ref(10000)
const pointSize = ref(1)
const [ax, ay] = [ref(240), ref(150)]
const [bx, by] = [ref(50), ref(400)]
const [cx, cy] = [ref(450), ref(400)]

/* Controls */
const running = ref(false)
const pointsCount = ref(0)

/* Template Refs */

const canvas = ref<HTMLCanvasElement | null>(null)

const context = computed(() =>
  canvas.value ? canvas.value.getContext('2d') : null
)

/* UI */

let [A, B, C] = [point(ax, ay), point(bx, by), point(cx, cy)]
const lastPoint = {
  x: 0,
  y: 0
}

function defaults() {
  ax.value = 240
  ay.value = 150
  bx.value = 50
  by.value = 400
  cx.value = 450
  cy.value = 400
  init()
}

async function randomize() {
  ax.value = Math.random() * 500
  ay.value = Math.random() * 500
  bx.value = Math.random() * 500
  by.value = Math.random() * 500
  cx.value = Math.random() * 500
  cy.value = Math.random() * 500
  init()
  nextTick(start)
}

async function start() {
  if (!context.value || !canvas.value) return
  running.value = true

  const ctx = context.value

  while (pointsCount.value < maxPoints.value && running.value) {
    if (delay.value) await sleep(delay.value)
    if (!running.value) break
    const vertex = getRandomElement([A, B, C])
    const nextPoint = getMiddle(vertex, lastPoint)
    ctx.fillRect(nextPoint.x, nextPoint.y, pointSize.value, pointSize.value)
    lastPoint.x = nextPoint.x
    lastPoint.y = nextPoint.y
    pointsCount.value++
  }

  running.value = false
}

async function stop() {
  running.value = false
}

function init() {
  running.value = false
  pointsCount.value = 0

  if (!canvas.value || !context.value) return
  ;[A, B, C] = [point(ax, ay), point(bx, by), point(cx, cy)]

  const ctx = context.value

  ctx.fillStyle = '#cfcfcf'
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)

  ctx.fillStyle = 'red'
  ctx.fillRect(A.x, A.y, 5, 5)
  ctx.fillRect(B.x, B.y, 5, 5)
  ctx.fillRect(C.x, C.y, 5, 5)

  ctx.fillStyle = 'blue'

  const firstPoint = getRandomPointBetween(...getTwoRandomElements([A, B, C]))

  ctx.fillRect(firstPoint.x, firstPoint.y, 5, 5)

  ctx.fillStyle = 'orange'

  lastPoint.x = firstPoint.x
  lastPoint.y = firstPoint.y

  watch([running, ax, ay, bx, by, cx, cy], async () => {
    while (pointsCount.value < maxPoints.value && running.value) {
      if (delay.value) await sleep(delay.value)
      if (!running.value) break
      const vertex = getRandomElement([A, B, C])
      const nextPoint = getMiddle(vertex, lastPoint)
      ctx.fillRect(nextPoint.x, nextPoint.y, pointSize.value, pointSize.value)
      lastPoint.x = nextPoint.x
      lastPoint.y = nextPoint.y
      pointsCount.value++
    }

    running.value = false
  })
}

onMounted(() => {
  init()
  watch([ax, ay, bx, by, cx, cy, delay, maxPoints, pointSize], init)
})
</script>

<template>
  <div class="center">
    <h1>Sierpinski Triangle Drawer</h1>
    <div class="input">
      <div class="input-group" id="a-cords">
        <label>A</label>
        <label for="ax">x:</label>
        <input :disabled="running" type="number" v-model="ax" id="ax" />
        <label for="ay">y:</label>
        <input :disabled="running" type="number" v-model="ay" id="ay" />
        <label>B</label>
        <label for="bx">x:</label>
        <input :disabled="running" type="number" v-model="bx" id="bx" />
        <label for="by">y:</label>
        <input :disabled="running" type="number" v-model="by" id="by" />
        <label>C</label>
        <label for="cx">x:</label>
        <input :disabled="running" type="number" v-model="cx" id="cx" />
        <label for="cy">y:</label>
        <input :disabled="running" type="number" v-model="cy" id="cy" />
        <button @click="randomize">Randomize</button>
        <button @click="defaults">Reset</button>
      </div>
      <div class="input-group">
        <label for="delay">Delay:</label>
        <input :disabled="running" type="number" id="delay" v-model="delay" />
        <label for="points-count">Max points:</label>
        <input
          :disabled="running"
          type="number"
          id="maxPoints"
          v-model="maxPoints"
        />
        <label for="points-count">Point size:</label>
        <input
          :disabled="running"
          type="number"
          id="pointSize"
          v-model="pointSize"
        />
      </div>
      <div class="input-group">
        <button
          @click="running ? stop() : start()"
          :disabled="pointsCount === maxPoints"
        >
          {{ running ? 'Stop' : pointsCount > 0 ? 'Resume' : 'Start' }}
        </button>
        <button @click="init" :disabled="running">Reset</button>
      </div>
    </div>
    <div class="center">
      <canvas id="canvas" ref="canvas" height="500" width="500"></canvas>
      <h2>Points: {{ pointsCount }}</h2>
    </div>
    <p>
      The <span class="red">red</span> points are the vertices of the
      triangle.<br />
      The <span class="blue">blue</span> point is a random point between two
      random vertices.<br />
      To draw each <span class="orange">orange</span> point, we take the middle
      point between the last point and a random vertex.<br />
      No matter what triangle or starting point we chose, we always end up with
      a
      <a href="https://mathigon.org/course/fractals/sierpinski" target="_blank">
        Sierpinski Triangle </a
      >.
    </p>
    <p>
      Inspired by
      <a href="https://vm.tiktok.com/ZMLxkUbkb/" target="_blank">a TikTok</a>
    </p>
  </div>
  <a
    class="github-fork-ribbon"
    href="https://github.com/roziscoding/sierpinski-triangle"
    data-ribbon="Fork me on GitHub"
    title="Fork me on GitHub"
    target="_blank"
    >Fork me on GitHub</a
  >
</template>

<style lang="scss">
.github-fork-ribbon:before {
  background-color: #333;
}

.red {
  color: red;
}

.blue {
  color: blue;
}

.orange {
  color: orange;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.input {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  label {
    margin-bottom: 5px;
  }

  &-group {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;

    label {
      margin: 0 5px 0 10px;
    }

    button,
    input {
      margin-right: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      text-align: center;
    }

    input {
      width: 50px;
      height: 30px;
    }
  }
}
</style>
