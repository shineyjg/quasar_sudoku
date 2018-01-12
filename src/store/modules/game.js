import Generator from './model/Generator'
import util from './model/util'

const sudokuGenerator = new Generator()

function judgeSolved (board) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          if (board[i][j][k][l].digit !== board[i][j][k][l].answer) {
            return false
          }
        }
      }
    }
  }
  return true
}

function genEmptyBoard () {
  let board = new Array(3)
  for (let i = 0; i < 3; i++) {
    board[i] = new Array(3)
    for (let j = 0; j < 3; j++) {
      board[i][j] = new Array(3)
      for (let k = 0; k < 3; k++) {
        board[i][j][k] = new Array(3)
        for (let l = 0; l < 3; l++) {
          board[i][j][k][l] = {
            origin: true,
            digit: 0
          }
        }
      }
    }
  }
  return board
}

const state = {
  board: genEmptyBoard(),
  level: 0,
  isSolved: false,
  check: false,
  currentCell: {
    gridIndex: {
      r: -1,
      c: -1
    },
    cellIndex: {
      r: -1,
      c: -1
    },
    digit: -1
  }
}

const getters = {
  dimrange: state => Array.from(Array(state.board.length), (v, k) => k),
  currentLevel: state => {
    return ['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very difficult'][state.level]
  }
}

const actions = {
  async newGame ({ commit, state }, level) {
    commit('setLevel', level)
    let game = await sudokuGenerator.gen(state.level)
    commit('setBoard', util.toGrid(game))
  },
  operate ({ commit, state }, o) {
    // console.log('operate', o)
    if (state.currentCell.gridIndex.r === -1 || state.currentCell.gridIndex.c === -1 || state.currentCell.cellIndex.r === -1 || state.currentCell.cellIndex.c === -1) {
      return
    }

    let cell = state.board[state.currentCell.gridIndex.r][state.currentCell.gridIndex.c][state.currentCell.cellIndex.r][state.currentCell.cellIndex.c]
    if (cell.origin) {
      return
    }

    commit('setCurrentCellDigit', o)

    if (cell.mode === 0) {
      commit('setDigit', state.currentCell)
    }
    else {
      if (o === 0) {
        commit('clearCandidate', state.currentCell)
      }
      else {
        commit('setCandidate', state.currentCell)
      }
    }
  },
  switchCurrentCellMode ({ commit, state }) {
    commit('switchMode', state.currentCell)
  }
}

const mutations = {
  setCurrentCellIndex (state, index) {
    // console.log(currentCell)
    state.currentCell.gridIndex = index.gridIndex
    state.currentCell.cellIndex = index.cellIndex
  },
  setCurrentCellDigit (state, digit) {
    state.currentCell.digit = digit
  },
  removeError (state) {
    let board = state.board
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          for (let l = 0; l < 3; l++) {
            if (board[i][j][k][l].digit > 0 && board[i][j][k][l].digit !== board[i][j][k][l].answer) {
              board[i][j][k][l].digit = 0
            }
          }
        }
      }
    }
  },
  setCheck (state) {
    state.check = !state.check
  },
  setBoard (state, board) {
    state.board = board
    state.isSolved = false
  },
  setLevel (state, level) {
    // console.log('game.mutation.setLevel', level)
    state.level = level
  },
  setDigit (state, digit) {
    // console.log('sudoku.mutation.setDigit', digit)
    let board = state.board[digit.gridIndex.r][digit.gridIndex.c][digit.cellIndex.r][digit.cellIndex.c]
    board.digit = digit.digit
    board.candidate = 0
    state.isSolved = judgeSolved(state.board)
    // console.log('isSolved', state.isSolved)
  },
  switchMode (state, index) {
    // console.log('game.mutation.switchMode', index)
    let cell = state.board[index.gridIndex.r][index.gridIndex.c][index.cellIndex.r][index.cellIndex.c]
    cell.mode = (cell.mode === 0 ? 1 : 0)
  },
  setCandidate (state, candidate) {
    // console.log('game.mutation.setCandidate', candidate)
    let cell = state.board[candidate.gridIndex.r][candidate.gridIndex.c][candidate.cellIndex.r][candidate.cellIndex.c]
    let d = 1 << (candidate.digit - 1)
    // console.log(cell.candidate, d, cell.candidate & d)
    if (cell.candidate & d) {
      cell.candidate = cell.candidate & (~d)
    }
    else {
      cell.candidate = cell.candidate | d
    }
    // console.log(cell.candidate)
  },
  clearCandidate (state, candidate) {
    let cell = state.board[candidate.gridIndex.r][candidate.gridIndex.c][candidate.cellIndex.r][candidate.cellIndex.c]
    cell.candidate = 0
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
