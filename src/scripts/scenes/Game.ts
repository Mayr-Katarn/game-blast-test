import langs from '../langs'
import Tile from '../components/Tile'
import Hud from './Hud';


export default class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  public lang: any
  public hud: Hud
  private camera: Phaser.Cameras.Scene2D.BaseCamera
  public cells: Icell[]
  public tiles: Tile[]

  public gameStarted: boolean
  public gameOver: boolean
  public win: boolean
  public colors: string[]
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
  // public activeBalls: Tile[]
  // public matchBalls: Tile[]
  // public checkingMatch: boolean

  // public scoreSum: number
  public score: number
  public scoreTarget: number

  public mask: Phaser.Display.Masks.BitmapMask
  private field: Phaser.GameObjects.Sprite

  public init(): void {
    console.log('Game'); 

    this.lang = langs.ru
    this.hud = this.game.scene.keys['Hud'] as Hud
    this.camera = this.cameras.main
    this.colors = ['red', 'blue', 'green', 'yellow', 'pink']

    this.gameStarted = false
    this.gameOver = false
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
    // this.activeBalls = []
    // this.checkingMatch = false

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
    this.gameStarted = true

    if (this.debug) {
      this.input.keyboard.addKey('W').on('up', (): void => { this.fillCells() })
      this.input.keyboard.addKey('Z').on('up', (): void => { console.log(this.pointerBall.id) })
    }
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
    this.chain.forEach(tile => tile.blow())
    this.tiles = this.tiles.filter(tile => tile.id)
    this.fillCells()
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
  

  public update(): void {
    // console.log();

    // Находим пустые ячейки
    // this.emptyCells = this.gameFieldCells.filter((cell: IgameFieldCell) => cell.empty === true)

    // ДИСТАНЦИЯ // Проверка на заполненность поля
    // this.fieldIsFill = this.gameFieldBalls.every(ball => {
    //   let cell: IgameFieldCell = this.gameFieldCells.find(cell => cell.id === ball.id)
    //   if (cell !== undefined) { return Phaser.Math.Distance.Between(ball.ball.x, ball.ball.y, cell.cell.x, cell.cell.y) < 13 }
    // }) && !this.resettingBalls

    // Прозрачность шаров при движении
    // if (!this.fieldIsFill) this.gameFieldBalls.forEach(ball => { if (ball.ball !== undefined) ball.ball.setAlpha(0.7) })
    // else this.gameFieldBalls.forEach(ball => ball.ball.setAlpha(1))

    // Заполнение пустых ячеек
    // if (this.emptyCells.length !== 0 && !this.filling) this.fillCells()
    // else if (this.fieldIsFill && !this.checkingMatch) {
    //   this.checkField()
    //   this.checkMatch()
    // }
  }
}
