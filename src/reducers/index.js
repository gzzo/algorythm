import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { all } from 'redux-saga/effects'

import { reducer as graph, rootSaga as graphSaga } from 'reducers/graph'

export function* rootSaga() {
  yield all([graphSaga()])
}

export const reducers = history =>
  combineReducers({
    router: connectRouter(history),
    graph,
  })
