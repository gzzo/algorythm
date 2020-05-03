import React from 'react'
import classNames from 'classnames'

import css from './node.scss'

class Node extends React.Component {
  render() {
    const { forwardRef, className, children, ...restProps } = this.props
    const classes = classNames(css.node, className)

    return (
      <div className={classes} ref={forwardRef} {...restProps}>
        {children}
      </div>
    )
  }
}

export default Node
