import React from 'react'
import './ScrabbleTile.css'

function ScrabbleTile(props, ref) {
  const { modifier, letter, score, onTouchStart, onTouchMove, onTouchEnd, onClick } = props
  const modifierClass = modifier.join(' ')
  return (
    <span
      ref={ref}
      className={`scrabble-letter ${modifierClass}`}
      role="button"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={onClick}
      onKeyDown={onClick}>
      {modifier.length !== 0 ? <span className="tile-modifier"></span> : null}
      <span className="letter">{letter.toUpperCase()}</span>
      <span className="score">{score}</span>
    </span>
  )
}
export default React.forwardRef(ScrabbleTile)
