import React from 'react'

import Page from 'components/page'
import { Coloring } from 'components/coloring'
import { Header } from 'components/header'
import { BFS } from 'components/bfs'

import css from './home.scss'

class Home extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Page>
          <div className={css.section}>
            <h1>BFS</h1>
            <BFS
              id="bfs"
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
          <div className={css.section}>
            <h1>2-Coloring</h1>
            <Coloring
              id="coloring"
              edges={[
                [1, 3, 5],
                [0, 2, 4],
                [1, 3, 5],
                [0, 2, 4],
                [1, 3, 5],
                [0, 2, 4],
              ]}
            />
          </div>
        </Page>
      </div>
    )
  }
}

export default Home
