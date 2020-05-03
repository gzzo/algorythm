import { ListNode } from './node'

export class LinkedList {
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }

  append(item) {
    const newNode = new ListNode(item)
    if (this.head === null) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.tail.next = newNode
      newNode.prev = this.tail
      this.tail = newNode
    }

    this.length++
  }

  pop() {
    if (this.tail === null) {
      throw Error('LinkedList is empty')
    }

    const lastItem = this.tail
    this.tail = this.tail.prev

    if (this.tail === null) {
      this.head = null
    } else {
      this.tail.next = null
    }

    this.length--
    return lastItem.val
  }

  popLeft() {
    if (this.head === null) {
      throw Error('LinkedList is empty')
    }

    const firstItem = this.head
    this.head = this.head.next

    if (this.head === null) {
      this.tail = null
    } else {
      this.head.prev = null
    }

    this.length--
    return firstItem.val
  }

  map(iter) {
    let curr = this.head
    const output = []

    while (curr) {
      output.push(iter(curr.val))
      curr = curr.next
    }

    return output
  }
}
