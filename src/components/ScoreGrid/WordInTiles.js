import React from 'react'
import { scrabbleScore } from '../../logic/util'
import ScrabbleTile from '../ScrabbleTile/ScrabbleTile'

class WordInTiles extends React.Component {
  tileEls = []
  dragStartIndex = null
  dragStartInitialPlaced = null
  dragLastTouchIndex = null
  initialModifiers = null

  handleClickTile = (letterIndex) => {
    const { game, word, language, onSetGame } = this.props
    onSetGame(game.togglePlaced(word, letterIndex, language))
  }

  setTileRef = (el, letterIndex) => {
    this.tileEls[letterIndex] = el
  }

  findTileUnderTouch = (touch) => {
    return this.tileEls.findIndex((el) => {
      const rect = el.getBoundingClientRect()
      return (
        rect.x <= touch.clientX &&
        rect.y <= touch.clientY &&
        rect.x + rect.width >= touch.clientX &&
        rect.y + rect.height >= touch.clientY
      )
    })
  }

  handleTouchStart = (event) => {
    const letterIndex = this.findTileUnderTouch(event.touches[0])
    this.dragStartIndex = letterIndex
    this.dragLastTouchIndex = letterIndex
    this.initialModifiers = this.props.word.modifiers
  }

  handleTouchMove = (event) => {
    const letterIndex = this.findTileUnderTouch(event.touches[0])
    if (this.dragLastTouchIndex === letterIndex) return
    this.dragLastTouchIndex = letterIndex
    // update the game modifiers
    const placed = !this.initialModifiers[this.dragStartIndex].includes('placed')
    const modifiers = this.initialModifiers.map((mod, i) => {
      if (
        letterIndex !== -1 &&
        i >= Math.min(this.dragStartIndex, letterIndex) &&
        i <= Math.max(this.dragStartIndex, letterIndex)
      ) {
        if (placed && !mod.includes('placed')) {
          return [...mod, 'placed']
        } else if (!placed && mod.includes('placed')) {
          return mod.filter((p) => p !== 'placed')
        }
      }
      return mod
    })
    const { game, word, language, onSetGame } = this.props
    onSetGame(game.updateModifiers(word, modifiers, language))
  }

  handleTouchEnd = () => {
    this.dragStartIndex = null
    this.dragStartInitialPlaced = null
    this.dragLastTouchIndex = null
    this.initialModifiers = null
  }

  render() {
    const { word, language } = this.props
    if (word.value === '__reaped_leftovers__') {
      return <span className="reaper">NO LEFTOVERS</span>
    }
    const letterTiles = word.value.split('').map((letter, i) => {
      const tile = (
        <ScrabbleTile
          ref={(el) => this.setTileRef(el, i)}
          key={i}
          letter={letter}
          modifier={word.modifiers[i]}
          score={scrabbleScore(letter, [[]], language)}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onClick={(event) => {
            event.stopPropagation()
            this.handleClickTile(i)
          }}
        />
      )
      return tile
    })
    return <div>{letterTiles}</div>
  }
}

export default WordInTiles
