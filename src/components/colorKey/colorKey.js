import React from 'react'
import _ from 'lodash'
import classNames from 'classnames'

import css from './colorKey.scss'

class ColorKey extends React.Component {
  render() {
    const { colors } = this.props
    return (
      <div className={css.container}>
        {_.map(colors, (className, colorName) => {
          const circleClasses = classNames(className, css.circle)

          return (
            <div className={css.color} key={colorName}>
              <div className={circleClasses} />
              <div>{colorName}</div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default ColorKey
