import React from 'react'
import _ from 'lodash'

import { getTemperatureIter } from 'utils/graph'
import { Node } from 'components/node'
import { Edge } from 'components/edge'

import css from './graph.scss'

class Graph extends React.Component {
  static defaultProps = {
    width: 680,
    height: 680,
    nodeSize: 50,
  }

  constructor(props) {
    super(props)
    const { edges, width, height } = props

    this.nodes = {}
    const pos = {}

    _.each(edges, (neighbors, idx) => {
      this.nodes[idx] = React.createRef()
      pos[idx] = {
        x: Math.round(Math.random() * width) - width / 2,
        y: Math.round(Math.random() * height) - height / 2,
      }
    })

    this.state = {
      pos,
      temperature: width / 8,
      iterations: 20,
    }

    this.positionNodes = this.positionNodes.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
  }

  componentDidMount() {
    this.positionNodes()
  }

  handleDrop(event) {
    event.preventDefault()

    const { width, height, nodeSize } = this.props
    const { pos } = this.state

    const { idx, offsetX, offsetY } = JSON.parse(
      event.dataTransfer.getData('text/plain')
    )

    const rect = event.target.getBoundingClientRect()

    this.setState({
      pos: {
        ...pos,
        [idx]: {
          x: event.pageX + (nodeSize / 2 - offsetX) - width / 2 - rect.left,
          y: event.pageY + (nodeSize / 2 - offsetY) - height / 2 - rect.top,
        },
      },
    })
  }

  handleDragOver(event) {
    event.preventDefault()
  }

  positionNodes() {
    const { edges, width, height, nodeSize } = this.props
    const { temperature, iterations } = this.state

    const positionIter = getTemperatureIter({
      edges,
      temperature,
      iterations,
      width: width - nodeSize,
      height: height - nodeSize,
    })

    _.each(_.range(iterations), iter => {
      setTimeout(() => {
        const { pos } = this.state

        this.setState({
          pos: positionIter({ pos }),
        })
      }, 100 * iter)
    })
  }

  render() {
    const { edges, width, height, nodeSize } = this.props
    const { pos, temperature, iterations } = this.state

    return (
      <div>
        <div
          className={css.graph}
          onDrop={this.handleDrop}
          onDragOver={this.handleDragOver}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          {_.map(edges, (neighbors, idx) => (
            <div key={idx}>
              <Node
                forwardRef={this.nodes[idx]}
                className={css.node}
                idx={idx}
                updatePosition={this.updatePosition}
                pos={pos[idx]}
                posXDelta={width / 2 - nodeSize / 2}
                posYDelta={height / 2 - nodeSize / 2}
                size={nodeSize}
              />
              {neighbors.map(neighbor => (
                <Edge
                  key={neighbor}
                  from={pos[idx]}
                  to={pos[neighbor]}
                  posXDelta={width / 2}
                  posYDelta={height / 2}
                />
              ))}
            </div>
          ))}
        </div>
        <button onClick={this.positionNodes}>Position</button>
        <input
          onChange={event => {
            this.setState({ temperature: parseInt(event.target.value) || 0 })
          }}
          value={temperature}
        />
        <input
          onChange={event => {
            this.setState({ iterations: parseInt(event.target.value) || 0 })
          }}
          value={iterations}
        />
      </div>
    )
  }
}

export default Graph
