import React from 'react'

import Page from 'components/page'
import { BFS } from 'components/bfs'

import css from './home.scss'

class Home extends React.Component {
  render() {
    return (
      <Page>
        <div className={css.graph}>
          <BFS
            id="word"
            edges={[
              [1, 2, 7],
              [0, 2, 3, 4],
              [0, 1, 5, 6],
              [1],
              [1],
              [2],
              [2],
              [0, 8, 9],
              [7],
              [7],
            ]}
          />
        </div>
      </Page>
    )
  }
}

export default Home
