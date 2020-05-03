import React from 'react'

import Container from './container'

class Stack extends React.Component {
  constructor(props) {
    super(props)

    this.highlightNode = this.highlightNode.bind(this)
  }

  highlightNode(idx) {
    const { items } = this.props
    return idx === items.length - 1
  }

  render() {
    const { items } = this.props

    return (
      <Container
        items={items}
        title="Stack"
        highglightNode={this.highlightNode}
      />
    )
  }
}

export default Stack
