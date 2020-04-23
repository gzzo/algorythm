import React from 'react'
import classNames from 'classnames'

import css from './node.scss'

class Node extends React.Component {
  static defaultProps = {
    size: 50,
  }

  constructor(props) {
    super(props)

    this.handleDragStart = this.handleDragStart.bind(this)
  }

  handleDragStart(event) {
    const { forwardRef, idx } = this.props

    event.dataTransfer.setData('text/plain', idx.toString())
    event.dataTransfer.setDragImage(forwardRef.current, 0, 0)
  }

  render() {
    const {
      className,
      forwardRef,
      idx,
      size,
      pos,
      posXDelta,
      posYDelta,
    } = this.props
    const classes = classNames(css.node, className)

    return (
      <div
        className={classes}
        ref={forwardRef}
        draggable
        onDragStart={this.handleDragStart}
        style={{
          left: pos.x + posXDelta,
          top: pos.y + posYDelta,
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {idx}
      </div>
    )
  }
}

export default Node
