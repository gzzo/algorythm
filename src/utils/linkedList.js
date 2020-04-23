import { node } from './node'

export const linkedList = () => {
  let head = null
  let tail = null
  let length = 0

  return {
    head,
    tail,
    get length() {
      return length
    },
    append: item => {
      const newNode = node({ val: item })
      if (head === null) {
        head = newNode
        tail = newNode
      } else {
        tail.next = newNode
        newNode.prev = tail
        tail = newNode
      }

      length++
    },
    pop: () => {
      if (tail === null) {
        throw Error('LinkedList is empty')
      }

      const lastItem = tail
      tail = tail.prev

      if (tail === null) {
        head = null
      } else {
        tail.next = null
      }

      length--
      return lastItem.val
    },
    popLeft: () => {
      if (head === null) {
        throw Error('LinkedList is empty')
      }

      const firstItem = head
      head = head.next

      if (head === null) {
        tail = null
      } else {
        head.prev = null
      }

      length--
      return firstItem.val
    },
    map: iter => {
      let curr = head
      const output = []

      while (curr) {
        output.push(iter(curr.val))
        curr = curr.next
      }

      return output
    },
  }
}
