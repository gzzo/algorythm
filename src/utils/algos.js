import _ from 'lodash'

import { queue } from 'utils/queue'

export const generateColoring = edges => {
  const steps = []
  const colors = {}
  const nodeQueue = queue()

  const step = () => {
    steps.push({
      nodeQueue: nodeQueue.map(item => item),
      colors: { ...colors },
    })
  }

  const getNextColor = color => (color === 0 ? 1 : 0)

  step()

  nodeQueue.append(0)
  step()

  while (nodeQueue.length) {
    const currNode = nodeQueue.pop()

    colors[currNode] = colors[currNode] || 0
    step(currNode)

    const nextColor = getNextColor(colors[currNode])
    let canBeColored = true
    _.each(edges[currNode], neighbor => {
      if (neighbor in colors) {
        canBeColored = false
        return colors[neighbor] !== colors[currNode]
      }

      colors[neighbor] = nextColor
      nodeQueue.append(neighbor)
      step(currNode)

      return true
    })

    if (!canBeColored) {
      break
    }
  }

  return steps
}

export const generateBFS = edges => {
  const steps = []
  const visited = {}
  const discovered = {}
  const nodeQueue = queue()

  const step = activeNode => {
    steps.push({
      nodeQueue: nodeQueue.map(item => item),
      visited: { ...visited },
      discovered: { ...discovered },
      activeNode,
    })
  }

  step(null)

  nodeQueue.append(0)
  discovered[0] = true
  step(null)

  while (nodeQueue.length) {
    const currNode = nodeQueue.pop()
    visited[currNode] = true
    step(currNode)

    _.each(edges[currNode], neighbor => {
      if (discovered[neighbor]) {
        return
      }

      discovered[neighbor] = true
      nodeQueue.append(neighbor)
      step(currNode)
    })
  }

  step(null)
  return steps
}

export const generateDFS = edges => {
  const steps = []
  const visited = {}
  const discovered = {}
  const nodeStack = []

  const step = activeNode => {
    steps.push({
      nodeStack: [...nodeStack],
      visited: { ...visited },
      discovered: { ...discovered },
      activeNode,
    })
  }

  step(null)

  nodeStack.push(0)
  discovered[0] = true
  step(null)

  while (nodeStack.length) {
    const currNode = nodeStack.pop()
    visited[currNode] = true
    step(currNode)

    _.each(edges[currNode], neighbor => {
      if (discovered[neighbor]) {
        return
      }

      discovered[neighbor] = true
      nodeStack.push(neighbor)
      step(currNode)
    })
  }

  step(null)
  return steps
}
