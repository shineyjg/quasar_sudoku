// const util = require('./util')
// const chalk = require('chalk')

export default class Solver {
  setBoard (board) {
    if (board) {
      this.board = board
    }
    else {
      this.board = new Array(81)
      this.board.fill(0)
    }
    this.answer = this.board.slice()
    this.initCandidate()
  }

  initCandidate () {
    this.candidate = new Array(81)
    let i
    for (i = 0; i < 81; i++) {
      this.candidate[i] = (1 << 9) - 1
    }

    for (i = 0; i < 81; i++) {
      if (this.answer[i] > 0) {
        this.deleteCandidateFromAnswer(i)
      }
    }
  }

  deleteCandidateFromAnswer (index) {
    let currentCandidate = this.candidate[index]
    let cands = []
    let d = 1 << (this.answer[index] - 1)
    let row = parseInt(index / 9)
    let col = index % 9
    let i, j
    for (i = 0; i < 9; i++) {
      if (this.candidate[row * 9 + i] & d) {
        cands.push(row * 9 + i)
        this.candidate[row * 9 + i] &= ~d
      }
      if (this.candidate[i * 9 + col] & d) {
        cands.push(i * 9 + col)
        this.candidate[i * 9 + col] &= ~d
      }
    }

    let r = parseInt(row / 3)
    let c = parseInt(col / 3)

    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        if (this.candidate[r * 27 + i * 9 + c * 3 + j] & d) {
          cands.push(r * 27 + i * 9 + c * 3 + j)
          this.candidate[r * 27 + i * 9 + c * 3 + j] &= ~d
        }
      }
    }
    let ret = { deleteCandidates: cands, currentCandidate: currentCandidate }
    this.candidate[index] = 0
    return ret
  }

  isSolved () {
    return this.answer.every(item => item > 0)
  }

  isFailed () {
    for (let i = 0; i < 81; i++) {
      if (this.answer[i] === 0 && this.candidate[i] === 0) {
        // console.log('index:', i, 'failed')
        return true
      }
    }

    return false
  }

  solve () {
    let history = []
    let candidate, isFailed
    // let i = 1
    while (!this.isSolved()) {
      // i += 1
      // console.log('============================================', i)
      // this.printCandidate()

      isFailed = this.isFailed()
      candidate = this.findOneCandidate()
      if (isFailed || candidate.index === -1) {
        // console.log(isFailed?'candidate failed':'back')
        candidate = this.findCandidateFromHistory(history)
        if (candidate.index === -1) {
          // console.log('failed: can not find candidate from history')
          return false
        }
        // console.log('find candidate from history', candidate)
      }
      else {
        // console.log('find candidate', candidate)
      }

      this.answer[candidate.index] = candidate.data
      candidate['del'] = this.deleteCandidateFromAnswer(candidate.index)
      history.push(candidate)
      // this.printAnswer()
    }
    // console.log('tried: ', i)
    this.history = history
    this.firstAnswer = this.answer.slice()
    return true
  }

  solveAnother () {
    let candidate, isFailed
    let history = this.history.slice()
    candidate = this.findCandidateFromHistory(history)
    this.answer[candidate.index] = candidate.data
    candidate['del'] = this.deleteCandidateFromAnswer(candidate.index)
    history.push(candidate)

    // let i = 1
    while (!this.isSolved()) {
      // i += 1
      // console.log('============================================', i)
      // this.printCandidate()

      isFailed = this.isFailed()
      candidate = this.findOneCandidate()
      if (isFailed || candidate.index === -1) {
        // console.log(isFailed?'candidate failed':'back')
        candidate = this.findCandidateFromHistory(history)
        if (candidate.index === -1) {
          // console.log('failed: can not find candidate from history')
          return false
        }
        // console.log('find candidate from history', candidate)
      }
      else {
        // console.log('find candidate', candidate)
      }

      this.answer[candidate.index] = candidate.data
      candidate['del'] = this.deleteCandidateFromAnswer(candidate.index)
      history.push(candidate)
      // this.printAnswer()
    }
    // console.log('tried: ', i)
    this.anotherHistory = history
    this.secondAnswer = this.answer
    return true
  }

  restoreCandidates (candidate) {
    this.answer[candidate.index] = 0
    let d = 1 << (candidate.data - 1)
    for (let i = 0; i < candidate.del.deleteCandidates.length; i++) {
      this.candidate[candidate.del.deleteCandidates[i]] |= d
    }

    this.candidate[candidate.index] = candidate.del.currentCandidate
  }

  findCandidateFromHistory (history) {
    let lastMove, candidate
    while (history.length > 0) {
      lastMove = history.pop()
      this.restoreCandidates(lastMove)
      candidate = this.findOneCandidateFromSameCell(lastMove)
      if (candidate.index !== -1) {
        return candidate
      }
    }

    return {
      index: -1
    }
  }

  findOneCandidateFromSameCell (lastMove) {
    for (let i = lastMove.data; i < 9; i++) {
      if (this.candidate[lastMove.index] & (1 << i)) {
        return {
          index: lastMove.index,
          data: i + 1
        }
      }
    }

    return {
      index: -1
    }
  }

  findOneCandidate () {
    let c = this.candidate.map((value, index) => {
      return {
        index: index,
        value: value
      }
    })

    c = c.filter(item => item.value > 0)

    if (c.length === 0) {
      return {
        index: -1
      }
    }

    let c1, c2
    c.sort((a, b) => {
      c1 = this.countBit(a.value)
      c2 = this.countBit(b.value)
      if (c1 > c2) return 1
      if (c1 === c2) return 0
      if (c1 < c2) return -1
    })

    for (let i = 0; i < 9; i++) {
      if (c[0].value & (1 << i)) {
        return {
          index: c[0].index,
          data: i + 1
        }
      }
    }

    return {
      index: -1
    }
  }

  countBit (data) {
    let count = 0
    for (; data; ++count) {
      data &= (data - 1)
    }
    return count
  }

  printCandidate () {
    let i, j
    let row, col, cand, d, line
    for (i = 0; i < 27; i++) {
      line = ''
      for (j = 0; j < 27; j++) {
        row = parseInt(i / 3)
        col = parseInt(j / 3)
        cand = this.candidate[row * 9 + col]
        d = (i % 3) * 3 + (j % 3)
        if (cand & (1 << d)) {
          line += d + 1
        }
        else {
          line += ' '
        }
        if (j % 3 === 2) {
          line += ' '
        }

        if (j % 9 === 8) {
          line += ' | '
        }
      }
      console.log(line)
      if (i % 3 === 2) {
        console.log('-------------------------------------------')
      }
    }
  }

  // printCandidate() {
  //   console.log('candidate: ')
  //   let i, j, data, count
  //   for (i = 0; i < 81; i++) {
  //     data = ''
  //     for (j = 0; j < 9; j++) {
  //       if (this.candidate[i] & (1 << j)) {
  //         data += (j + 1)
  //       }
  //     }
  //     count = this.countBit(this.candidate[i])
  //     console.log(i, count, data)
  //   }
  // }
}

// board = new Array(81)
// board.fill(0)
// // board[0] = 1
// // board[1] = 2
// // board[2] = 3
// // board[9] = 4
// s = new Solver(board)
// r = s.solve()

// console.log(r)

// util.printGame(s.board, s.firstAnswer)

// export class Solver
