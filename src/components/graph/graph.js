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
        x: Math.round(Math.random() * width),
        y: Math.round(Math.random() * height),
      }
    })

    this.state = {
      mounted: false,
      pos,
    }

    this.positionNodes = this.positionNodes.bind(this)
  }

  componentDidMount() {
    this.positionNodes()
  }

  placeNodes() {
    const { nodes, state } = this
    const { pos } = state

    _.each(nodes, (neighbors, idx) => {
      nodes[idx].current.style.left = pos[idx].x
      nodes[idx].current.style.right = pos[idx].y
    })
  }

  positionNodes() {
    const { edges, width, height } = this.props

    const area = width * height
    const space = Math.sqrt(area / edges.length)

    const f_a = x => x ** 2 / space
    const f_r = x => space ** 2 / x

    const pos = {}
    const disp = {}

    const iterations = 100
    const temperature_start = width / 5
    let temperature = temperature_start

    _.each(edges, (v_neighbors, vdx) => {
      this.nodes[vdx].current.style.left = `${Math.round(
        Math.random() * width
      )}px`
      this.nodes[vdx].current.style.top = `${Math.round(
        Math.random() * height
      )}px`

      const rect = this.nodes[vdx].current.getBoundingClientRect()

      pos[vdx] = {
        x: rect.x,
        y: rect.y,
      }
    })

    const iterPosition = () => {
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

      _.each(edges, (v_neighbors, vdx) => {
        const mag = Math.sqrt(disp[vdx].x ** 2 + disp[vdx].y ** 2) || 1

        pos[vdx] = {
          x:
            pos[vdx].x +
            (disp[vdx].x / mag) * Math.min(Math.abs(disp[vdx].x), temperature),
          y:
            pos[vdx].y +
            (disp[vdx].y / mag) * Math.min(Math.abs(disp[vdx].y), temperature),
        }

        pos[vdx] = {
          x: Math.min(width / 2, Math.max(-width / 2, pos[vdx].x)),
          y: Math.min(height / 2, Math.max(-height / 2, pos[vdx].y)),
        }
      })

      temperature = temperature - (1 / iterations) * temperature_start

      _.each(edges, (v_neighbors, vdx) => {
        this.nodes[vdx].current.style.left = `${width / 2 + pos[vdx].x}px`
        this.nodes[vdx].current.style.top = `${height / 2 + pos[vdx].y}px`
      })
    }

    _.each(_.range(iterations), iter => {
      setTimeout(iterPosition, 100 * iter)
    })

    setTimeout(() => {
      this.setState({
        mounted: true,
      })
    }, iterations * 100)
  }

  render() {
    const { edges } = this.props
    const { mounted } = this.state

    return (
      <div className={css.graph}>
        {_.map(edges, (neighbors, idx) => (
          <div key={idx}>
            <Node forwardRef={this.nodes[idx]} className={css.node}>
              {idx}
            </Node>
            {mounted &&
              neighbors.map(neighbor => (
                <Edge
                  key={neighbor}
                  from={this.nodes[idx]}
                  to={this.nodes[neighbor]}
                />
              ))}
          </div>
        ))}
      </div>
    )
  }
}

export default Graph
