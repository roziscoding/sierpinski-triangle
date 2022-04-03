export function getRandomElement<T>(elements: T[]): T {
  return elements[Math.floor(Math.random() * elements.length)]
}

export function getTwoRandomElements<T>(elements: T[]): [T, T] {
  const [a, b] = [
    Math.floor(Math.random() * elements.length),
    Math.floor(Math.random() * elements.length)
  ]
  return a === b ? getTwoRandomElements(elements) : [elements[a], elements[b]]
}
