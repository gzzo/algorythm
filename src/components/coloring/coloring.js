import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'

import { Graph } from 'components/graph'
import { Queue } from 'components/container'
import { PlayControls } from 'components/playControls'
import { initColoring, changeStep, play, pause } from 'reducers/graph'

import css from 'components/coloring/coloring.scss'

const COLORS = {
  0: css.node_blue,
  1: css.node_red,
}

class Coloring extends React.Component {
  constructor(props) {
    super(props)

    this.getNodeColors = this.getNodeColors.bind(this)
  }

  componentDidMount() {
    this.props.initColoring()
  }

  getNodeColors() {
    const { graph } = this.props
    const { colors } = graph

    const nodeColors = {}

    _.each(colors, (color, node) => {
      nodeColors[node] = COLORS[color]
    })

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
        <Graph
          edges={edges}
          width={500}
          height={500}
          nodeColors={this.getNodeColors()}
        />
        <Queue items={nodeQueue} />
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
    initColoring: () => dispatch(initColoring(id, edges)),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Coloring)
