import React from 'react'
import { connect } from 'react-redux'

import { Graph } from 'components/graph'
import { Queue } from 'components/queue'
import { initBFS, nextStep, prevStep } from 'reducers/bfs'

class BFS extends React.Component {
  componentDidMount() {
    this.props.initBFS()
  }

  render() {
    const {
      activeNode,
      discovered,
      edges,
      nextStep,
      nodeQueue,
      prevStep,
      visited,
    } = this.props

    return (
      <div>
        <Queue items={nodeQueue} />
        <button onClick={nextStep}>next</button>
        <button onClick={prevStep}>prev</button>
        <Graph
          edges={edges}
          activeNodes={{ [activeNode]: true }}
          visitedNodes={visited}
          discoveredNodes={discovered}
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
    ...bfs.steps[bfs.step],
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { id, edges } = ownProps

  return {
    initBFS: () => dispatch(initBFS(id, edges)),
    nextStep: () => dispatch(nextStep(id)),
    prevStep: () => dispatch(prevStep(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BFS)
