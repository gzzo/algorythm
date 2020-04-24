import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { all } from 'redux-saga/effects'

import { reducer as bfs, rootSaga as bfsSaga } from './bfs'

export function* rootSaga() {
  yield all([bfsSaga()])
}

export const reducers = history =>
  combineReducers({
    router: connectRouter(history),
    bfs,
  })
