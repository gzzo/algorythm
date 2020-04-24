import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'

import { Graph } from 'components/graph'
import { Queue } from 'components/queue'
import { ColorKey } from 'components/colorKey'
import { PlayControls } from 'components/playControls'
import { initBFS, changeStep, play, pause } from 'reducers/bfs'

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
    const { bfs } = this.props
    const { discovered, activeNode, visited } = bfs

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
      bfs,
      step,
      steps,
      edges,
      changeStep,
      play,
      pause,
      isPlaying,
    } = this.props

    if (!bfs) {
      return null
    }

    const { nodeQueue } = bfs

    return (
      <div>
        <div>
          {step + 1}/{steps}
        </div>
        <Queue items={nodeQueue} />

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
  const bfs = state.bfs[id]

  if (!bfs) {
    return {}
  }

  return {
    bfs: bfs.steps[bfs.step],
    step: bfs.step,
    steps: bfs.steps.length,
    isPlaying: bfs.isPlaying,
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
