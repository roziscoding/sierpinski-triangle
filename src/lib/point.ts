import { Ref, unref } from 'vue'

type Point = {
  x: number
  y: number
}

export function point(x: Ref<number> | number, y: Ref<number> | number) {
  return {
    x: unref(x),
    y: unref(y)
  }
}

export function getMiddle(a: Point, b: Point): Point {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  }
}

export function getRandomPointBetween(a: Point, b: Point): Point {
  const x = Math.random() * (b.x - a.x) + a.x
  const y = Math.random() * (b.y - a.y) + a.y
  return { x, y }
}
