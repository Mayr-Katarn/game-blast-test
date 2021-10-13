import Game from "../scenes/Game"

export default class Tile extends Phaser.GameObjects.Sprite {
  public scene: Game
  public x: number
  public y: number
  public col: number
  public row: number
  public id: string
  public color: string

  public moveAni: Phaser.Tweens.Tween

  constructor(
    scene: Game,
    x: number,
    y: number,
    col: number,
    row: number,
    color: string,
  ) {
    super(scene, x, y, color)
    this.scene = scene
    this.x = x
    this.y = y
    this.col = col
    this.row = row
    this.id = `${col}-${row}`
    this.color = color
    this.init()
  }

  private init(): void {
    this.scene.add.existing(this).setDepth(this.row).setOrigin(0, 1).setMask(this.scene.mask).setInteractive().setClick().moveToCell()
  }

  public moveToCell(): this {
    const cell = this.scene.findCellByID(this.id)
    if (cell.empty) cell.empty = false
    this.moveAni = this.scene.tweens.add({
      targets: this,
      y: cell.y,
      duration: 1000,
      ease: 'Cubic.easeIn'
    })
    return this
  }

  private setClick(): this {
    this.on('pointerup', (): void => {
      if (!this.scene.isTilesMoving()) {
        const sameColorNearbyTiles = this.scene.sameColorNearbyTiles(this)
        if (sameColorNearbyTiles.length > 0) {
          this.scene.chain = sameColorNearbyTiles
          this.scene.chain.push(this)
          this.pushChain(sameColorNearbyTiles)
        }
      }
    })

    this.on('pointerover', (): void => {
      this.scene.pointerBall = this
    })
    return this
  }

  private pushChain(arr: Tile[]): void {
    let chainNewElements = []
    arr.forEach(tile => {
      const sameColorNearbyTiles = this.scene.sameColorNearbyTiles(tile).filter(el => this.scene.chain.every(chainTile => chainTile.id !== el.id))
      if (sameColorNearbyTiles.length > 0) {
        this.scene.chain = this.scene.chain.concat(sameColorNearbyTiles)
        chainNewElements = chainNewElements.concat(sameColorNearbyTiles)
      }
    })
    if (chainNewElements.length > 0) this.pushChain(chainNewElements)
    else this.scene.blowChain()
  }

  public setNewCellID(id: string = ''): this {
    this.scene.findCellByID(this.id).empty = true
    this.id = id
    return this
  }

  public blow(): void {
    this.setNewCellID().destroy()
  }
}