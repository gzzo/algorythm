import { linkedList } from './linkedList'

export const queue = () => {
  const list = linkedList()

  return {
    get length() {
      return list.length
    },
    append: list.append,
    pop: () => {
      return list.popLeft()
    },
    map: list.map,
  }
}
