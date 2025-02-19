import React from 'react'
import { scrabbleScore, logEvent, scrollToTop, loggableWord, loggableGame } from '../../logic/util'
import ScrabbleInputBox from '../ScrabbleInputBox/ScrabbleInputBox'

const emptyWord = { value: '', modifiers: [], score: 0 }

class InGameControls extends React.Component {
  input = React.createRef()
  form = React.createRef()

  state = {
    currentWord: emptyWord,
  }

  _scrollToTop = () => {
    const { isMobile } = this.props

    if (!isMobile) return

    scrollToTop()
  }

  componentDidMount() {
    const { game } = this.props

    if (this.input.current) this.input.current.focus()
    if (game.getCurrentTurnNumber() === 0) this._scrollToTop()
  }

  getSnapshotBeforeUpdate(_prevProps, _prevState) {
    return { rect: this.getBoundingClientRect() }
  }

  componentDidUpdate(_prevProps, _prevState, snapshot) {
    this.adjustScrollPosition(snapshot.rect)
  }

  getBoundingClientRect() {
    return this.form.current.getBoundingClientRect()
  }

  adjustScrollPosition(prevRect) {
    const rect = this.getBoundingClientRect()
    window.scrollBy(0, rect.top - prevRect.top)
  }

  onSetGame(game) {
    const { onSetGame } = this.props
    onSetGame(game)
    this.resetCurrentWord()
  }

  resetCurrentWord() {
    this.setState({ currentWord: emptyWord })
    if (this.input.current) this.input.current.focus()
  }

  reloadLastWord() {
    const { game } = this.props
    this.setState({ currentWord: game.getLastWord() || emptyWord })
    if (this.input.current) this.input.current.focus()
  }

  handleChange = (word) => {
    const { language } = this.props
    const currentWord = {
      ...word,
      score: scrabbleScore(word.value, word.modifiers, language),
    }
    this.setState({ currentWord })
  }

  handleUndo = () => {
    const { onUndo } = this.props
    onUndo()
    this.reloadLastWord()

    logEvent('undo')
  }

  handleAddWord = () => {
    const { currentWord } = this.state
    const { game } = this.props
    this.onSetGame(game.addWord(currentWord))

    logEvent('add-word', { word: loggableWord(this.state.currentWord) })
  }

  handleEndTurn = (e) => {
    const { currentWord } = this.state
    let { game } = this.props
    if (currentWord.value.length !== 0) game = game.addWord(currentWord)
    this.onSetGame(game.endTurn())

    const data = currentWord.value.length !== 0 ? { word: loggableWord(this.state.currentWord) } : { passed: true }
    logEvent('end-turn', data)
  }

  handleBingo = () => {
    const { game, onSetGame } = this.props
    onSetGame(game.setBingo(!game.getCurrentTurn().bingo))
    this.input.current.focus()

    logEvent('toggle-bingo')
  }

  handleEndGame = () => {
    const { game, onSetGame } = this.props
    onSetGame(game.endGame())

    logEvent('end-game', loggableGame(game))
  }

  render() {
    const { currentWord } = this.state
    const { game, language, undoDisabled } = this.props
    const isCurrentWordEmpty = game.getCurrentTurn().isEmpty() && currentWord.value === ''
    const endTurnButtonText = isCurrentWordEmpty ? 'PASS' : 'END TURN'
    const isEndGameDisabled =
      game.currentPlayerIndex !== 0 ||
      currentWord.value !== '' ||
      game.getCurrentTurn().score > 0 ||
      game.playersTurns[game.getCurrentPlayerIndex()].length === 1
    const isBingoDisabled = ![...game.getCurrentTurn().words, currentWord].some((word) => word.value.length >= 7)

    const isModifierChosen = currentWord.modifiers.some((modifier) => modifier.length !== 0)
    const isInstructionShown =
      game.getCurrentTurnNumber() === 0 &&
      game.getCurrentPlayerIndex() === 0 &&
      !isModifierChosen &&
      currentWord.value !== ''
    const isFirstTurn = game.getCurrentTurnNumber() === 0 && game.getCurrentPlayerIndex() === 0
    const isEndTurnDisabled = !isModifierChosen && !isCurrentWordEmpty && isFirstTurn
    const props = {
      ref: this.input,
      onChange: this.handleChange,
      word: currentWord,
      language,
    }

    return (
      <form ref={this.form} className={isFirstTurn ? 'first-turn' : null} onSubmit={(e) => e.preventDefault()}>
        <ScrabbleInputBox {...props} />
        <div className={`instruction-message ${isInstructionShown ? '' : 'hide'}`}>↑ Press on a letter</div>

        <div className="buttons">
          <div className="row">
            <div className="col">
              <button onClick={this.handleEndTurn} type="submit" className="btn" disabled={isEndTurnDisabled}>
                {endTurnButtonText}
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <button
                onClick={this.handleAddWord}
                type="button"
                className="btn middle-scroll-anchor"
                disabled={currentWord.value === '' || isFirstTurn}>
                + ADD A WORD
              </button>
            </div>
            <div className="col">
              <input
                onChange={this.handleBingo}
                type="checkbox"
                id="bingoToggle"
                checked={game.getCurrentTurn().bingo}
                disabled={isBingoDisabled}
              />
              <label className={`btn bingo ${isBingoDisabled ? 'disabled' : ''}`} htmlFor="bingoToggle">
                BINGO
              </label>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <button onClick={this.handleUndo} type="button" className="btn" disabled={undoDisabled}>
                UNDO
              </button>
            </div>
            <div className="col">
              <button onClick={this.handleEndGame} type="button" className="btn" disabled={isEndGameDisabled}>
                END GAME
              </button>
            </div>
          </div>
        </div>
      </form>
    )
  }
}
export default InGameControls
