import React from 'react'
import Game from '../../logic/game'
import ScoreGrid from '../ScoreGrid/ScoreGrid'
import ScoreGridMobile from '../ScoreGrid/ScoreGridMobile'
import CallPlayerToAction from './CallPlayerToAction'
import InGameControls from './InGameControls'
import InGameOverControls from './InGameOverControls'
import { getPersistedState, persistState } from '../../logic/util'

class ScoreKeeper extends React.Component {
  constructor(props) {
    super(props)
    this.handleUndo = this.handleUndo.bind(this)
    this.handleSetGame = this.handleSetGame.bind(this)
    this.renderWinner = this.renderWinner.bind(this)

    const { playerNames } = this.props
    const restoredState = getPersistedState('gameState')
    this.state = restoredState
      ? {
          game: Game.fromPlain(restoredState.game),
          games: restoredState.games.map(Game.fromPlain),
        }
      : {
          game: Game.createNewGame(playerNames.length),
          games: [],
        }
  }

  handleSetGame(currentGame) {
    const { game, games } = this.state
    const { playerNames } = this.props
    const newState = { game: currentGame, games: [...games.slice(), game] }
    this.setState(newState)
    persistState('gameState', { playerNames: playerNames, ...newState })
  }

  handleUndo() {
    const { games } = this.state
    const { playerNames } = this.props
    const ignoreLastGame = this.undoShouldIgnoreLastGame()
    const previousGames = games.slice(0, ignoreLastGame ? -2 : -1)
    const game = games[games.length - (ignoreLastGame ? 2 : 1)]
    const newState = { game, games: previousGames }
    this.setState(newState)
    persistState('gameState', { playerNames: playerNames, ...newState })
  }

  /**
   * This is a bit of a weird one. If there are no changes to the current player's
   * turns in the two last games, we ignore the last game. If we don't, we end
   * up duplicating the last word for the current player. This situation occurs
   * when The user clicks "End Turn" after clicking "Add Word" and not actually
   * adding a word.
   */
  undoShouldIgnoreLastGame() {
    const { game, games } = this.state
    const lastGame = games[games.length - 1]
    if (!lastGame) return false
    const playerIndex = lastGame.getCurrentPlayerIndex()
    const lastPlayerTurn = lastGame.playersTurns[playerIndex].slice(-1)[0]
    const currentPlayerTurn = game.playersTurns[playerIndex].slice(-1)[0]
    if (!lastPlayerTurn.words.length) return false
    return JSON.stringify(lastPlayerTurn) === JSON.stringify(currentPlayerTurn)
  }

  renderWinner() {
    const { game } = this.state
    const { playerNames } = this.props
    const turnBeforeLeftOvers = game.leftOversTurnNumber - 1
    const winners = game.getWinners()
    if (winners.length > 1) {
      const winnersTie = game.getWinners(turnBeforeLeftOvers)
      return winnersTie
        .map((winnerIndex) =>
          winnersTie.length > 1
            ? `${playerNames[winnerIndex]}: ${game.getTotalScore(winnerIndex, turnBeforeLeftOvers)} points`
            : `${playerNames[winnerIndex]} won with ${game.getTotalScore(winnerIndex, turnBeforeLeftOvers)} points!`
        )
        .join(', ')
    }
    return `${playerNames[winners[0]]} won with ${game.getTotalScore(winners[0])} points!`
  }

  render() {
    const { game, games } = this.state
    const { playerNames, language, isMobile, onNewGame } = this.props

    const controlProps = {
      onSetGame: this.handleSetGame,
      onUndo: this.handleUndo,
      undoDisabled: games.length === 0,
      onNewGame,
      isMobile,
      game,
      language,
    }

    const toDisplayCallPlayerToAction = () => {
      if (!isMobile) {
        return <CallPlayerToAction game={game} playerNames={playerNames} isMobile={isMobile} />
      }
    }

    return (
      <div className="score-keeper">
        <div className="container">
          <div id="small-logo" onClick={onNewGame}>
            <img src="logo.png" alt="Scrabble score logo" />
          </div>
          <h1 className="title">Score Sheet</h1>
          {isMobile ? (
            <ScoreGridMobile playerNames={playerNames} game={game} language={language} />
          ) : (
            <ScoreGrid playerNames={playerNames} game={game} language={language} />
          )}
          {!game.areLeftOversSubmitted() ? (
            toDisplayCallPlayerToAction()
          ) : (
            <div className="winner">
              <h1>{this.renderWinner()}</h1>
            </div>
          )}
          {!game.isGameOver() ? <InGameControls {...controlProps} /> : <InGameOverControls {...controlProps} />}
        </div>
      </div>
    )
  }
}

export default ScoreKeeper
