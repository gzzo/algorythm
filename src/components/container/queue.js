import React from 'react'

import Container from './container'

class Queue extends React.Component {
  constructor(props) {
    super(props)

    this.highlightNode = this.highlightNode.bind(this)
  }

  highlightNode(idx) {
    return idx === 0
  }

  render() {
    const { items } = this.props

    return (
      <Container
        items={items}
        title="Queue"
        highglightNode={this.highlightNode}
      />
    )
  }
}

export default Queue
