import React from 'react';
import ScoreGridCell from './ScoreGridCell';
import CallPlayerToAction from '../ScrabbleScoreKeeper/CallPlayerToAction';
import './ScoreGrid.css';

class ScoreGridMobile extends React.Component {
  moveRowText(i) {
    const { game } = this.props;
    return game.isGameOver() &&  game.leftOversTurnNumber === i ? 'Leftovers Accounting' : `Move ${i+1}`
  }
  render() {
    const { playerNames, game, language } = this.props;
    const totalScores = [...Array(playerNames.length)].map((_, j) => {
      return game.getRunningTotals(j)
    });
    var toDisplayTotals = turn => {
      if(!game.areLeftOversSubmitted()) {
        return turn.isComplete(game)
      } else {
        return true
      }
    }
                                          
    var isCurrentPlayersTurn = (player, turnIndex) => player === game.getCurrentPlayer() &&
                                                      player[turnIndex].isEmpty() &&
                                                      !player[turnIndex].isPassed(game) &&
                                                      !player[turnIndex].bingo;
    return (
      <table className="table table-bordered">
        <thead>
          <tr className="thead-rows">
            <th className="playerNames" scope="col">Names<br />(Total)</th>
            <th className="playerTurn" scope="col">Player Turn</th>
           </tr>
        </thead>
        <tbody key='tbody' className="tbody-rows">
          {game.getCurrentPlayer().map((_, i) => {
            const moveRow = <tr key={`moverow${i}`} className="move-row">
                              <td colSpan="2">
                                {this.moveRowText(i)}
                              </td>
                            </tr>;
            const playerRows = game.playersTurns.map((player, j) => (
              player[i]
                ? <tr key={`move${i}_player${j}`} className="player-name">
                    <td>
                      {playerNames[j]}<br />{toDisplayTotals(player[i]) ? totalScores[j][i] : null}
                    </td>

                    <td>
                      {isCurrentPlayersTurn(player, i) 
                        ? <CallPlayerToAction game={game} playerNames={playerNames} isMobile={true}/>
                        : <ScoreGridCell turn={player[i]} language={language} game={game} />
                      }
                    </td>
                  </tr>     
                : null
              ))
            return [moveRow, playerRows]
          })}
        </tbody>
      </table>
    )
  }
}
export default ScoreGridMobile;