import React from 'react'
import _ from 'lodash'

import { Node } from 'components/node'
import { Edge } from 'components/edge'

import css from './graph.scss'

class Graph extends React.Component {
  static defaultProps = {
    width: 680,
    height: 680,
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
      temperature: width / 5,
      iterations: 20,
    }

    this.positionNodes = this.positionNodes.bind(this)
    this.updatePosition = this.updatePosition.bind(this)
  }

  componentDidMount() {
    this.positionNodes()
  }

  updatePosition(node, x, y) {
    const { pos } = this.state

    this.setState({
      pos: {
        ...pos,
        [node]: {
          x,
          y,
        },
      },
    })
  }

  positionNodes() {
    const { edges, width, height } = this.props
    const { temperature: temperature_start, iterations } = this.state

    const area = width * height
    const space = Math.sqrt(area / edges.length)

    const f_a = x => x ** 2 / space
    const f_r = x => space ** 2 / x

    const disp = {}

    let temperature = temperature_start

    const iterPosition = () => {
      const { pos } = this.state
      _.each(edges, (v_neighbors, vdx) => {
        disp[vdx] = { x: 0, y: 0 }

        _.each(edges, (u_neighbors, udx) => {
          if (udx === vdx) {
            return
          }

          const disp_x = pos[vdx].x - pos[udx].x
          const disp_y = pos[vdx].y - pos[udx].y

          const mag = Math.sqrt(disp_x ** 2 + disp_y ** 2) || 1

          disp[vdx] = {
            x: disp[vdx].x + (disp_x / mag) * f_r(mag),
            y: disp[vdx].y + (disp_y / mag) * f_r(mag),
          }
        })
      })

      const visited = {}
      _.each(edges, (v_neighbors, vdx) => {
        _.each(v_neighbors, udx => {
          if (visited[udx]) {
            return
          }

          const disp_x = pos[vdx].x - pos[udx].x
          const disp_y = pos[vdx].y - pos[udx].y

          const mag = Math.sqrt(disp_x ** 2 + disp_y ** 2) || 1

          disp[vdx] = {
            x: disp[vdx].x - (disp_x / mag) * f_a(mag),
            y: disp[vdx].y - (disp_y / mag) * f_a(mag),
          }

          disp[udx] = {
            x: disp[udx].x + (disp_x / mag) * f_a(mag),
            y: disp[udx].y + (disp_y / mag) * f_a(mag),
          }
        })

        visited[vdx] = true
      })

      const newPos = {}
      _.each(edges, (v_neighbors, vdx) => {
        const mag = Math.sqrt(disp[vdx].x ** 2 + disp[vdx].y ** 2) || 1

        newPos[vdx] = {
          x:
            pos[vdx].x +
            (disp[vdx].x / mag) * Math.min(Math.abs(disp[vdx].x), temperature),
          y:
            pos[vdx].y +
            (disp[vdx].y / mag) * Math.min(Math.abs(disp[vdx].y), temperature),
        }

        newPos[vdx] = {
          x: Math.min(width / 2, Math.max(-width / 2, newPos[vdx].x)),
          y: Math.min(height / 2, Math.max(-height / 2, newPos[vdx].y)),
        }
      })

      this.setState({
        pos: newPos,
      })

      temperature = temperature - (1 / iterations) * temperature_start
    }

    _.each(_.range(iterations), iter => {
      setTimeout(iterPosition, 100 * iter)
    })
  }

  render() {
    const { edges } = this.props
    const { pos, temperature, iterations } = this.state

    return (
      <div>
        <div
          className={css.graph}
          onDrop={event => {
            event.preventDefault()
            event.persist()
            const node = event.dataTransfer.getData('text/plain')
            this.updatePosition(
              parseInt(node),
              event.pageX - 340,
              event.pageY - 340
            )
            console.log()
          }}
          onDragOver={event => {
            event.preventDefault()
          }}
        >
          {_.map(edges, (neighbors, idx) => (
            <div key={idx}>
              <Node
                forwardRef={this.nodes[idx]}
                className={css.node}
                idx={idx}
                updatePosition={this.updatePosition}
                pos={pos[idx]}
              >
                {idx}
              </Node>
              {neighbors.map(neighbor => (
                <Edge key={neighbor} from={pos[idx]} to={pos[neighbor]} />
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
