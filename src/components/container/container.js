import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'

import { Node } from 'components/node'

import css from './container.scss'

class Container extends React.Component {
  render() {
    const { items, title, highglightNode } = this.props

    return (
      <div>
        <h4>{title}</h4>
        <div className={css.items}>
          {_.map(items, (item, idx) => {
            const nodeClasses = classNames(css.node, {
              [css.node_highlight]: highglightNode(idx),
            })

            return (
              <Node className={nodeClasses} key={item}>
                {item}
              </Node>
            )
          })}
          {_.isEmpty(items) && <div>Empty</div>}
        </div>
      </div>
    )
  }
}

export default Container
