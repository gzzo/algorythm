import { take, put, race, call, all, delay } from 'redux-saga/effects'

import { generateBFS, generateColoring, generateDFS } from 'utils/algos'

const INIT_BFS = 'graph/INIT_BFS'
const INIT_DFS = 'graph/INIT_DFS'
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

export const initDFS = (id, edges) => {
  return {
    type: INIT_DFS,
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

    case INIT_DFS: {
      return {
        ...state,
        [action.id]: {
          steps: generateDFS(action.edges),
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
