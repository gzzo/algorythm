import React from 'react'
import _ from 'lodash'

import css from './queue.scss'

class Queue extends React.Component {
  render() {
    const { items } = this.props

    return (
      <div className={css.container}>
        <div className={css.items}>
          {_.map(items, item => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </div>
    )
  }
}

export default Queue
