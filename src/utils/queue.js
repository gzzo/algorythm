import { LinkedList } from './linkedList'

export class Queue {
  constructor() {
    this.linkedList = new LinkedList()
  }

  append(item) {
    return this.linkedList.append(item)
  }

  pop() {
    return this.linkedList.popLeft()
  }

  map(iter) {
    return this.linkedList.map(iter)
  }

  get length() {
    return this.linkedList.length
  }
}
