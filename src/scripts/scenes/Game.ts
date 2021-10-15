import langs from '../langs'
import Tile from '../components/Tile'
import Hud from './Hud';
import { config } from '../config';
import FlyAwayText from '../components/FlyAwayText';


export default class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  public lang: any
  public hud: Hud
  private camera: Phaser.Cameras.Scene2D.BaseCamera
  public cells: Icell[]
  public tiles: Tile[]

  public gameIsStarted: boolean
  public gameIsOver: boolean
  public win: boolean
  public colors: string[]
  public turns: number
  private debug: boolean

  private rows: number
  private cols: number 
  private cellWidth: number
  private cellHeight: number
  private fieldWidth: number
  private fieldHeight: number
  private fieldOriginX: number 
  private fieldOriginY: number

  public chain: Tile[]
  public pointerBall: Tile
  public clickPosition: { x: number, y: number }
  private fieldIsChecked: boolean
  private recreationTry: number
  // public activeBalls: Tile[]
  // public matchBalls: Tile[]
  // public checkingMatch: boolean

  public score: number
  public blowScore: number
  public scoreTarget: number

  public mask: Phaser.Display.Masks.BitmapMask
  private field: Phaser.GameObjects.Sprite

  public init(): void {
    console.log('Game'); 

    this.lang = langs.ru
    this.hud = this.game.scene.keys['Hud'] as Hud
    this.camera = this.cameras.main
    this.colors = ['red', 'blue', 'green', 'yellow', 'pink']

    this.gameIsStarted = false
    this.gameIsOver = false
    this.win = false
    this.rows = 8
    this.cols = 8
    this.cellWidth = 72
    this.cellHeight = 76
    this.fieldHeight = this.rows * this.cellHeight
    this.fieldWidth = this.cols * this.cellWidth

    this.fieldOriginX = this.cameras.main.centerX - this.fieldWidth / 2
    this.fieldOriginY = this.cameras.main.centerY + 60 + this.fieldHeight / 2

    this.cells = []
    this.tiles = []
    this.chain = []
    this.clickPosition = { x: 0, y: 0 }
    this.fieldIsChecked = false
    this.recreationTry = 0
    // this.activeBalls = []
    // this.checkingMatch = false

    this.turns = config.turns
    this.scoreTarget = config.targetScore
    this.blowScore = 0
    this.score = 0
    this.debug = false
  }


  public create(): void {
    this.cameras.main.setBackgroundColor('#b4feff')

    this.field = this.add.sprite(this.camera.centerX + 4, this.camera.centerY + 60, 'field').setScale(0.92, 0.97)
    const borders: Phaser.GameObjects.Sprite = this.add.sprite(this.field.x, this.field.y, 'field').setScale(0.87, 0.9).setVisible(false)
    this.mask = borders.createBitmapMask();

    this.createCells()
    this.createTiles()
    this.gameIsStarted = true

    if (this.debug) {
      this.input.keyboard.addKey('F').on('up', (): void => { this.fillCells() })
      this.input.keyboard.addKey('Z').on('up', (): void => { console.log(this.pointerBall.id) })
    }
    this.input.keyboard.addKey('W').on('up', (): void => { this.scene.launch('Modal', { type: 'gameOver', info: { win: false, reason: this.lang.noMatches } }) })
    this.input.keyboard.addKey('R').on('up', (): void => { this.recreateField() })
  }

  private createCells(): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.cells.push({
          id: `${col}-${row}`,
          x: this.fieldOriginX + (this.cellWidth * col),
          y: this.fieldOriginY - (this.cellHeight * row),
          col,
          row,
          empty: false
        })
      }
    }
  }

  private createTiles(): void {
    this.cells.forEach(cell => {
      this.tiles.push(new Tile(this, cell.x, cell.y - this.field.getBounds().height + 40, cell.col, cell.row, this.colors[Phaser.Math.Between(0, this.colors.length - 1)]))
      if (this.debug) this.add.text(cell.x + this.cellWidth / 2 + 4, cell.y - this.cellHeight / 2 + 6, cell.id, { font: '24px Marvin', color: 'black' }).setOrigin(0.5).setDepth(100)
    })
  }


  public shake(force: number = 1) {
    switch (force) {
      case 1: force = 0.001
        break
      case 2: force = 0.003
        break
      case 3: force = 0.006
        break
      default: return
    }
    this.cameras.main.shake(300, force)
  }

  public findCellByID(id: string): Icell { return this.cells.find(cell => cell.id === id) }
  public findTileByID(id: string): Tile { return this.tiles.find(tile => tile.id === id) }
  public isTilesMoving(): boolean { return this.tiles.some(tile => tile.moveAni.isPlaying()) }
  // public topTile(tile: Tile): Tile { return this.tiles.find(el => el.id === `${tile.col}-${tile.row + 1}`) }
  // public botTile(tile: Tile): Tile { return this.tiles.find(el => el.id === `${tile.col}-${tile.row - 1}`) }
  // public leftTile(tile: Tile): Tile { return this.tiles.find(el => el.id === `${tile.col - 1}-${tile.row}`) }
  // public rightTile(tile: Tile): Tile { return this.tiles.find(el => el.id === `${tile.col + 1}-${tile.row}`) }
  public sameColorNearbyTiles(tile: Tile): Tile[] {
    return this.tiles.filter(el =>
      (el.id === `${tile.col}-${tile.row + 1}` ||
      el.id === `${tile.col}-${tile.row - 1}` ||
      el.id === `${tile.col - 1}-${tile.row}` ||
      el.id === `${tile.col + 1}-${tile.row}`) &&
      el.color === tile.color
    )
  }
  // private isHave

  public blowChain(): void {
    console.log('Game ~ blowChain ~ this.chain', this.chain.map(tile => tile.id))
    this.calcScore(this.chain.length)
    this.spendTurn()
    this.chain.forEach(tile => tile.blow())
    this.tiles = this.tiles.filter(tile => tile.id)
    this.fillCells()
    this.checkGameOver()
    this.recreationTry = 0
    this.fieldIsChecked = false
  }

  // Заполение пустых ячеек
  public fillCells(): void {
    const emptyCells = this.cells.filter(cell => cell.empty).sort((a, b) => a.row - b.row)
    // console.log('1 ~ fillCells ~ emptyCells', emptyCells.map(cell => cell.id), emptyCells.every((cell1, i) => cell1?.id === this.lastEmptyCells[i]?.id))
    let emptyTopCounter = 0

    emptyCells.forEach(cell => {
      let tile: Tile
      for (let row = cell.row + 1; row < this.rows; row++) {
        tile = this.findTileByID(`${cell.col}-${row}`)
        if (tile) {
          tile.setNewCell(cell).moveToCell()
          break
        }
      }
      if (!tile) { emptyTopCounter++ }
    })

    if (emptyCells.length === emptyTopCounter) {
      const created = []
      emptyCells.forEach(cell => {
        this.tiles.push(new Tile(this, cell.x, this.field.getTopCenter().y - (this.cellHeight * created.filter(el => el.col === cell.col).length), cell.col, cell.row, this.colors[Phaser.Math.Between(0, this.colors.length - 1)]))
        created.push(cell)
      })
    }
    
    // console.log('2 ~ fillCells ~ emptyCells', emptyCells.length === emptyTopCounter)
    if (this.cells.some(cell => cell.empty)) this.fillCells()
  }

  private checkField(): void {
    this.fieldIsChecked = true
    if (this.tiles.every(tile => this.sameColorNearbyTiles(tile).length === 0)) this.recreateField()
  }

  private recreateField(): void {
    this.recreationTry++
    if (this.recreationTry < 2) {
      const fieldTilesColors = []
      this.tiles.forEach(tile => fieldTilesColors.push(tile.color))
      Phaser.Utils.Array.Shuffle(fieldTilesColors)
      this.tiles.forEach((tile, i) => tile.setColor(fieldTilesColors[i]))
    } else this.gameOver(this.lang.noMatches)
  }

  private calcScore(tiles: number): void {
    const defaultIncriment = 100
    this.blowScore = tiles * defaultIncriment
    this.score += this.blowScore
    const { x, y } = this.clickPosition
    new FlyAwayText(this, x, y)
    this.hud.updateScore()
  }

  private spendTurn(): void {
    this.turns--
    this.hud.updateTurns()
  }

  private checkGameOver(): void {
    if (this.score >= this.scoreTarget) {
      this.win = true
      this.gameOver(this.lang.targetReach)
    } else if (this.turns <= 0) {
      this.gameOver(this.lang.outOfTurns)
    }
  }
  
  private gameOver(reason: string): void {
    this.gameIsOver = true
    console.log('game over | win: ', this.win);
    this.scene.launch('Modal', { type: 'gameOver', info: { win: this.win, reason } })
  }

  public update(): void {
    if (!this.fieldIsChecked && !this.isTilesMoving && !this.gameIsOver) this.checkField()
  }
}
