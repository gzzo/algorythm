import { queue } from 'utils/queue'
import _ from 'lodash'

const INIT_BFS = 'bfs/INIT_BFS'
const NEXT_STEP = 'bfs/NEXT_STEP'
const PREV_STEP = 'bfs/PREV_STEP'

export const initBFS = (id, edges) => {
  return {
    type: INIT_BFS,
    id,
    edges,
  }
}

export const nextStep = id => {
  return {
    type: NEXT_STEP,
    id,
  }
}

export const prevStep = id => {
  return {
    type: PREV_STEP,
    id,
  }
}

const addStep = ({ steps, activeNode, nodeQueue, visited, discovered }) => {
  steps.push({
    nodeQueue: nodeQueue.map(item => item),
    visited: { ...visited },
    discovered: { ...discovered },
    activeNode,
  })
}

const generateBFS = edges => {
  const steps = []
  const visited = {}
  const discovered = {}
  const nodeQueue = queue()

  const step = activeNode =>
    addStep({ steps, activeNode, nodeQueue, visited, discovered })

  nodeQueue.append(0)
  discovered[0] = true
  step(0)

  while (nodeQueue.length) {
    const nextNode = nodeQueue.pop()
    step(nextNode)

    visited[nextNode] = true
    step(nextNode)

    _.each(edges[nextNode], neighbor => {
      if (discovered[neighbor]) {
        return
      }

      discovered[neighbor] = true
      nodeQueue.append(neighbor)
      step(nextNode)
    })
  }

  step(null)

  return steps
}

const initialState = {}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_BFS: {
      return {
        ...state,
        [action.id]: {
          steps: generateBFS(action.edges),
          step: 0,
        },
      }
    }

    case NEXT_STEP: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          step: state[action.id].step + 1,
        },
      }
    }

    case PREV_STEP: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          step: state[action.id].step - 1,
        },
      }
    }

    default: {
      return state
    }
  }
}
