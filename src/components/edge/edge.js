import React from 'react'

import css from './edge.scss'

class Edge extends React.PureComponent {
  render() {
    const { from, to, posXDelta, posYDelta } = this.props

    const startX = from.x + posXDelta
    const startY = from.y + posYDelta

    const endX = to.x + posXDelta
    const endY = to.y + posYDelta

    return (
      <div className={css.line}>
        <svg className={css.svg}>
          <path
            d={`M${startX},${startY} L${endX},${endY}`}
            className={css.svgPath}
          />
        </svg>
      </div>
    )
  }
}

export default Edge
