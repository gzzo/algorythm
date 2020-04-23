import React from 'react'
import _ from 'lodash'

import { getTemperatureIter } from 'utils/graph'
import { Node } from 'components/node'
import { Edge } from 'components/edge'

import css from './graph.scss'

class Graph extends React.Component {
  static defaultProps = {
    activeNodes: {},
    discoveredNodes: {},
    height: 680,
    nodeSize: 50,
    visitedNodes: {},
    width: 680,
  }

  constructor(props) {
    super(props)
    const { edges, width, height } = props

    this.graph = React.createRef()
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

    const rect = this.graph.current.getBoundingClientRect()

    this.setState({
      pos: {
        ...pos,
        [idx]: {
          x:
            Math.min(
              width - nodeSize / 2,
              event.pageX +
                (nodeSize / 2 - offsetX) -
                rect.left -
                window.scrollX
            ) -
            width / 2,
          y:
            Math.min(
              height - nodeSize / 2,
              event.pageY + (nodeSize / 2 - offsetY) - rect.top - window.scrollY
            ) -
            height / 2,
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
    const {
      activeNodes,
      discoveredNodes,
      edges,
      height,
      nodeSize,
      visitedNodes,
      width,
    } = this.props
    const { pos } = this.state

    return (
      <div
        className={css.graph}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        ref={this.graph}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {_.map(edges, (neighbors, idx) => (
          <div key={idx}>
            <Node
              className={css.node}
              forwardRef={this.nodes[idx]}
              idx={idx}
              isActive={idx in activeNodes}
              isVisited={idx in visitedNodes}
              isDiscovered={idx in discoveredNodes}
              pos={pos[idx]}
              posXDelta={width / 2 - nodeSize / 2}
              posYDelta={height / 2 - nodeSize / 2}
              size={nodeSize}
              updatePosition={this.updatePosition}
            />
            {neighbors.map(neighbor => (
              <Edge
                from={pos[idx]}
                key={neighbor}
                posXDelta={width / 2}
                posYDelta={height / 2}
                to={pos[neighbor]}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }
}

export default Graph
