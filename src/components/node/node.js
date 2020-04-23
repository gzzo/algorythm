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

    const rect = event.target.getBoundingClientRect()

    const offsetX = event.pageX - rect.left - window.scrollX
    const offsetY = event.pageY - rect.top - window.scrollY
    const dataObj = {
      idx,
      offsetX,
      offsetY,
    }

    event.dataTransfer.setData('text/plain', JSON.stringify(dataObj))
    event.dataTransfer.setDragImage(forwardRef.current, offsetX, offsetY)
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
