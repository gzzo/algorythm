import React from 'react'

import css from './edge.scss'

class Edge extends React.PureComponent {
  render() {
    const { from, to } = this.props

    const startX = from.x + 340 + 25 //+ fromRect.width / 2 + window.scrollX
    const startY = from.y + 340 + 25 //+ fromRect.height / 2 + window.scrollY

    const endX = to.x + 340 + 25 //+ toRect.width / 2 + window.scrollX
    const endY = to.y + 340 + 25 //+ toRect.height / 2 + window.scrollY

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
