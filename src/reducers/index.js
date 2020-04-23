import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { all } from 'redux-saga/effects'

import { reducer as bfs } from './bfs'

function* sampleRootSaga() {}

export function* rootSaga() {
  yield all([sampleRootSaga()])
}

export const reducers = history =>
  combineReducers({
    router: connectRouter(history),
    bfs,
  })
