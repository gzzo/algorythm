import React from 'react'

import css from './edge.scss'

class Edge extends React.PureComponent {
  constructor(props) {
    super(props)

    this.updateRects = this.updateRects.bind(this)
    this.updateRects()
  }

  updateRects() {
    const { from, to } = this.props

    this.fromRect = from.current.getBoundingClientRect()
    this.toRect = to.current.getBoundingClientRect()
  }

  render() {
    const { fromRect, toRect } = this

    const startX = fromRect.x + fromRect.width / 2 + window.scrollX
    const startY = fromRect.y + fromRect.height / 2 + window.scrollY

    const endX = toRect.x + toRect.width / 2 + window.scrollX
    const endY = toRect.y + toRect.height / 2 + window.scrollY

    const startControlX = endX
    const startControlY = startY

    const endControlX = startX
    const endControlY = endY

    return (
      <div className={css.line}>
        <svg className={css.svg}>
          <path
            // d={`M${startX},${startY} C${startControlX},${startControlY} ${endControlX},${endControlY} ${endX},${endY}`}
            d={`M${startX},${startY} L${endX},${endY}`}
            className={css.svgPath}
          />
        </svg>
      </div>
    )
  }
}

export default Edge
