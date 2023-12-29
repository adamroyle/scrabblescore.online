import { scoreListsMap } from './scoreLists'

let startTime

function msToMin(ms) {
  const min = Math.floor(ms / (1000 * 60))
  return min
}

export function setStartTime() {
  startTime = new Date().getTime()
}

export function resizeArray(array, desiredLength, defaultValue) {
  const output = array.slice(0, desiredLength)
  while (output.length < desiredLength) output.push(defaultValue)
  return output
}

export function indexesOf(array, value) {
  const result = []
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      result.push(i)
    }
  }
  return result
}

function __toggleSingleModifier(oldModifiers, modifier) {
  if (oldModifiers.length === 0) return [modifier]
  return oldModifiers[0] === modifier ? [] : [modifier]
}

export function toggleModifiers(oldModifiers, modifier) {
  let modifiersA = oldModifiers.filter((mod) => mod === 'blank' || mod === 'placed')
  let modifiersB = oldModifiers.filter((mod) => mod !== 'blank' && mod !== 'placed')

  if (modifier === 'blank' || modifier === 'placed') modifiersA = __toggleSingleModifier(modifiersA, modifier)
  else modifiersB = __toggleSingleModifier(modifiersB, modifier)

  return [...modifiersA, ...modifiersB]
}

export function isLetterAllowed(letter, language) {
  return letter.toLowerCase() in scoreListsMap[language].scores
}

export function scrabbleScore(word, modifiers, language) {
  let result = 0

  word.split('').forEach((letter, i) => {
    let score = scoreListsMap[language].scores[letter.toLowerCase()]
    for (let j = 0; j < modifiers[i].length; j++) {
      // eslint-disable-next-line
      switch (modifiers[i][j]) {
        case 'blank':
          score *= 0
          break
        case 'double-letter':
          score *= 2
          break
        case 'triple-letter':
          score *= 3
          break
      }
    }
    result += score
  })

  modifiers.forEach((modifier) => {
    for (let j = 0; j < modifier.length; j++) {
      // eslint-disable-next-line
      switch (modifier[j]) {
        case 'double-word':
          result *= 2
          break
        case 'triple-word':
          result *= 3
          break
      }
    }
  })
  return result
}

export function placedScore(word, modifiers, language) {
  let result = 0

  word.split('').forEach((letter, i) => {
    let score = scoreListsMap[language].scores[letter.toLowerCase()]
    if (modifiers[i].includes('placed')) {
      result += score
    }
  })

  return result
}

export function logEventInit() {}

export function isStaticBuild() {
  return navigator.userAgent === 'ReactSnap'
}

export function isCordova() {
  return navigator.userAgent.includes('cordova')
}

export function isProduction() {
  return process.env.NODE_ENV === 'production' // eslint-disable-line no-use-before-define
}

export function isTest() {
  return process.env.NODE_ENV === 'test'
}

export function loggableWord(word) {
  const modifiers = word.modifiers
    .map((mod, i) => {
      return mod.length === 0 ? null : `${i}:${mod.join()}`
    })
    .filter((mod) => !!mod)
    .join(', ')

  if (!modifiers) return word.value
  return `${word.value} (${modifiers})`
}

export function loggableGame(game) {
  const loggableTurn = (turn) => {
    if (turn.isPassed(game)) return 'PASS'

    let turnWords = turn.words.map((w) => w.value).join('+')
    if (turn.bingo) return `${turnWords} BINGO`

    return turnWords
  }
  const turns = game.playersTurns.map((playerTurn) => playerTurn.map(loggableTurn).join(','))

  const scores = game.playersTurns.map((_, i) => game.getTotalScore(i))

  const numTurns = game.playersTurns[0].length - 1

  const endTime = new Date().getTime()
  const durationMins = startTime ? msToMin(endTime - startTime) : undefined

  return { turns, scores, numTurns, durationMins }
}

export function logEvent(eventName, eventData) {}

export function scrollToTop() {
  const bodyElement = document.getElementsByTagName('body')
  bodyElement[0].scrollIntoView(true)
}

export function persistState(name, stateObj) {
  window.localStorage.setItem(name, JSON.stringify(stateObj))
}

export function getPersistedState(name) {
  const state = window.localStorage.getItem(name)
  return state ? JSON.parse(state) : null
}

export function clearPersistedState(name) {
  window.localStorage.removeItem(name)
}

export default null
