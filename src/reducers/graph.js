import { queue } from 'utils/queue'
import { take, put, race, call, all, delay } from 'redux-saga/effects'
import _ from 'lodash'

const INIT_BFS = 'graph/INIT_BFS'
const INIT_COLORING = 'graph/INIT_COLORING'
const CHANGE_STEP = 'graph/CHANGE_STEP'
const UPDATE_STEP = 'graph/UPDATE_STEP'
const PLAY = 'graph/PLAY'
const PAUSE = 'graph/PAUSE'

const PLAY_DELAY = 500

export const initBFS = (id, edges) => {
  return {
    type: INIT_BFS,
    id,
    edges,
  }
}

export const initColoring = (id, edges) => {
  return {
    type: INIT_COLORING,
    id,
    edges,
  }
}

export const changeStep = (id, step) => {
  return {
    type: CHANGE_STEP,
    id,
    step,
  }
}

export const updateStep = (id, step) => {
  return {
    type: UPDATE_STEP,
    id,
    step,
  }
}

export const play = (id, step, steps) => {
  return {
    type: PLAY,
    id,
    step,
    steps,
  }
}

export const pause = id => {
  return {
    type: PAUSE,
    id,
  }
}

function* playGraph(action) {
  const { id, step, steps } = action

  let currStep = step
  while (currStep < steps - 1) {
    currStep++
    yield put(updateStep(id, currStep))
    yield delay(PLAY_DELAY)
  }
}

function* watchPlay() {
  while (true) {
    const play = yield take(PLAY)
    yield race({
      play: call(playGraph, play),
      pause: take(PAUSE),
      change: take(CHANGE_STEP),
    })
    yield put(pause(play.id))
  }
}

export function* rootSaga() {
  yield all([watchPlay()])
}

const generateColoring = edges => {
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

const generateBFS = edges => {
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

    case INIT_COLORING: {
      return {
        ...state,
        [action.id]: {
          steps: generateColoring(action.edges),
          step: 0,
        },
      }
    }

    case PLAY: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          isPlaying: true,
        },
      }
    }

    case PAUSE: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          isPlaying: false,
        },
      }
    }

    case UPDATE_STEP:
    case CHANGE_STEP: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          step: action.step,
        },
      }
    }

    default: {
      return state
    }
  }
}
