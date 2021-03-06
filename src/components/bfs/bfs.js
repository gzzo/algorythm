import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'

import { Graph } from 'components/graph'
import { Queue } from 'components/container'
import { ColorKey } from 'components/colorKey'
import { PlayControls } from 'components/playControls'
import { initBFS, changeStep, play, pause } from 'reducers/graph'

import css from './bfs.scss'

class BFS extends React.Component {
  constructor(props) {
    super(props)

    this.getNodeColors = this.getNodeColors.bind(this)
  }

  componentDidMount() {
    this.props.initBFS()
  }

  getNodeColors() {
    const { graph } = this.props
    const { discovered, activeNode, visited } = graph

    const nodeColors = {}

    _.each(_.keys(discovered), node => {
      nodeColors[node] = css.node_discovered
    })

    _.each(_.keys(visited), node => {
      nodeColors[node] = css.node_visited
    })

    nodeColors[activeNode] = css.node_active

    return nodeColors
  }

  render() {
    const {
      graph,
      step,
      steps,
      edges,
      changeStep,
      play,
      pause,
      isPlaying,
    } = this.props

    if (!graph) {
      return null
    }

    const { nodeQueue } = graph

    return (
      <div>
        <div className={css.graph}>
          <div className={css.colorKey}>
            <ColorKey
              colors={{
                Active: css.node_active,
                Visited: css.node_visited,
                Discovered: css.node_discovered,
              }}
            />
          </div>
          <Graph
            edges={edges}
            width={500}
            height={500}
            nodeColors={this.getNodeColors()}
          />
        </div>
        <div className={css.container}>
          <Queue items={nodeQueue} />
        </div>
        <PlayControls
          step={step}
          steps={steps}
          changeStep={changeStep}
          play={play}
          pause={pause}
          isPlaying={isPlaying}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps
  const graph = state.graph[id]

  if (!graph) {
    return {}
  }

  return {
    graph: graph.steps[graph.step],
    step: graph.step,
    steps: graph.steps.length,
    isPlaying: graph.isPlaying,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { id, edges } = ownProps

  return {
    changeStep: step => dispatch(changeStep(id, step)),
    initBFS: () => dispatch(initBFS(id, edges)),
    pause: () => dispatch(pause(id)),
    play: (step, steps) => () => dispatch(play(id, step, steps)),
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { step, steps } = stateProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    play: dispatchProps.play(step, steps),
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(BFS)
