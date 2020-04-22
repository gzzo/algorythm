import React from 'react'

import Page from 'components/page'
import { Graph } from 'components/graph'

import css from './home.scss'

class Home extends React.Component {
  render() {
    return (
      <Page>
        <div className={css.graph}>
          <Graph
            edges={[
              [4, 1, 5],
              [0, 2, 6],
              [1, 3, 7],
              [2, 4, 8],
              [3, 0, 9],
              [0, 7, 8],
              [1, 8, 9],
              [2, 9, 5],
              [3, 5, 6],
              [4, 6, 7],
            ]}
          />
        </div>
      </Page>
    )
  }
}

export default Home
