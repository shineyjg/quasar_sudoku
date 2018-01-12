import Solver from './Solver'
import util from './util'

export default class Generator {
  constructor () {
    this.solver = new Solver()
  }

  async gen (level) {
    if (level < 0) { level = 0 }
    if (level > 4) { level = 4 }
    // console.log('gen()', level)
    // const levels = ['very_easy', 'easy', 'moderate', 'difficult', 'very_difficult']
    const digNumbers = [40, 44, 48, 52, 54]
    let completeBoard = this.init()
    let board
    // let i = 1
    while (true) {
      // console.log(i++)
      board = this.dig(completeBoard, digNumbers[level])
      this.solver.setBoard(board)

      if (this.solver.solve() && !this.solver.solveAnother()) {
        break
      }
      await this.sleep(10)
    }

    return { board: board, answer: this.solver.firstAnswer }
  }

  sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  init () {
    let board = new Array(81)
    board.fill(0)
    board[parseInt(Math.random() * 81)] = parseInt(Math.random() * 9) + 1

    this.solver.setBoard(board)
    this.solver.solve()
    return this.solver.firstAnswer
  }

  dig (board, digNumber) {
    board = board.map((v, i) => { return { i: i, v: v } })
    util.shuffle(board)
    for (let i = 0; i < digNumber; i++) {
      board[i].v = 0
    }
    board.sort((a, b) => a.i - b.i)
    return board.map((v, i) => { return v.v })
  }

  // static genBatch (level, count) {
  //   if (level < 0) { level = 0 }
  //   if (level > 4) { level = 4 }
  //   const levels = ['very_easy', 'easy', 'moderate', 'difficult', 'very_difficult']
  //   const digNumbers = [40, 44, 48, 52, 57]

  //   let s = fs.createWriteStream(path.join('./puzzle', levels[level] + '_' + util.format(new Date(), 'yyyy-MM-dd-hh-mm-ss') + '.txt'))
  //   let g = new Generator()
  //   let i = 0
  //   let game
  //   while (i < count) {
  //     i++

  //     game = g.gen(digNumbers[level])
  //     // util.printGame(game.board, game.answer)
  //     s.write('---- ' + i + ' ----\n\n')
  //     this.saveGame(s, game)
  //   }
  //   s.end()
  // }
  // static saveGame (stream, game) {
  //   this.saveData(stream, game.board)
  //   stream.write('\n')
  //   this.saveData(stream, game.answer)
  //   stream.write('\n')
  // }
  // static saveData (stream, data) {
  //   let line
  //   for (let i = 0; i < 9; i++) {
  //     line = ''
  //     for (let j = 0; j < 9; j++) {
  //       if (j === 3 || j === 6) {
  //         line += ' '
  //       }
  //       line += data[i * 9 + j]
  //     }
  //     if (i === 3 || i === 6) {
  //       stream.write('\n')
  //     }
  //     stream.write(line + '\n')
  //   }
  // }
}
