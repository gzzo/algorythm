import React from 'react'

import css from './playControls.scss'

class PlayControls extends React.Component {
  constructor(props) {
    super(props)

    this.handleFirst = this.handleFirst.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleLast = this.handleLast.bind(this)
  }

  handleFirst() {
    const { changeStep } = this.props

    changeStep(0)
  }

  handlePrev() {
    const { changeStep, step } = this.props

    changeStep(step - 1)
  }

  handleNext() {
    const { changeStep, step } = this.props

    changeStep(step + 1)
  }

  handleLast() {
    const { changeStep, steps } = this.props

    changeStep(steps - 1)
  }

  render() {
    const { step, steps, play, pause, isPlaying } = this.props

    return (
      <div className={css.container}>
        <div
          className={css.progressBar}
          style={{ backgroundSize: `${(100 * step) / (steps - 1)}%` }}
        >
          {step}/{steps - 1}
        </div>
        <div className={css.controls}>
          <button onClick={this.handleFirst} disabled={step === 0}>
            {'<<'}
          </button>
          <button onClick={this.handlePrev} disabled={step === 0}>
            {'<'}
          </button>
          {isPlaying === true ? (
            <button className={css.playPause} onClick={pause}>
              pause
            </button>
          ) : (
            <button className={css.playPause} onClick={play}>
              play
            </button>
          )}
          <button onClick={this.handleNext} disabled={step === steps - 1}>
            {'>'}
          </button>
          <button onClick={this.handleLast} disabled={step === steps - 1}>
            {'>>'}
          </button>
        </div>
      </div>
    )
  }
}

export default PlayControls
