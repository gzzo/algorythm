import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { all } from 'redux-saga/effects'

const sampleReducer = (state = {}) => state

function* sampleRootSaga() {}

export function* rootSaga() {
  yield all([sampleRootSaga()])
}

export const reducers = history =>
  combineReducers({
    sampleReducer,
    router: connectRouter(history),
  })
