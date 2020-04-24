import { queue } from 'utils/queue'
import { take, put, race, call, all, delay } from 'redux-saga/effects'
import _ from 'lodash'

const INIT_BFS = 'bfs/INIT_BFS'
const CHANGE_STEP = 'bfs/CHANGE_STEP'
const UPDATE_STEP = 'bfs/UPDATE_STEP'
const PLAY = 'bfs/PLAY'
const PAUSE = 'bfs/PAUSE'

const PLAY_DELAY = 500

export const initBFS = (id, edges) => {
  return {
    type: INIT_BFS,
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

function* playBFS(action) {
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
      play: call(playBFS, play),
      pause: take(PAUSE),
      change: take(CHANGE_STEP),
    })
    yield put(pause(play.id))
  }
}

export function* rootSaga() {
  yield all([watchPlay()])
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

  step(null)

  nodeQueue.append(0)
  discovered[0] = true
  step(null)

  while (nodeQueue.length) {
    const nextNode = nodeQueue.pop()
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
