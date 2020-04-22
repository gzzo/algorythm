import React from 'react'
import classNames from 'classnames'

import css from './node.scss'

class Node extends React.Component {
  render() {
    const { children, className, forwardRef, pos, idx } = this.props
    const classes = classNames(css.node, className)

    return (
      <div
        className={classes}
        ref={forwardRef}
        draggable
        onDragStart={event => {
          event.dataTransfer.setData('text/plain', idx.toString())
          event.dataTransfer.effectAllowed = 'move'
          event.dataTransfer.setDragImage(forwardRef.current, 0, 0)
        }}
        style={{ top: 340 + pos.y, left: 340 + pos.x }}
      >
        {children}
      </div>
    )
  }
}

export default Node
