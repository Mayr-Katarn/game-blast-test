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
  private pulseAni: Phaser.Tweens.Tween
  private pulseSprite: Phaser.GameObjects.Sprite

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
    this.pulseSprite = this.scene.add.sprite(0, 0, this.color).setDepth(this.depth + 1).setVisible(false)
  }

  public moveToCell(): this {
    const cell = this.scene.findCellByID(this.id)
    let duration = !this.scene.gameIsStarted ? 900 : 350
    if (cell.empty) cell.empty = false
    this.moveAni = this.scene.tweens.add({
      targets: this,
      y: cell.y,
      duration,
      ease: 'Quad.easeIn'
    })
    return this
  }

  private setClick(): this {
    this.on('pointerup', (): void => {
      if (!this.scene.isTilesMoving() && !this.scene.gameIsOver) {
        this.scene.clickPosition = { x: this.getCenter().x, y: this.getCenter().y }
        if (this.scene.bombBoosterIsActive) {
          this.scene.chain = this.scene.tilesForBlow(this)
          this.scene.bombToggle()
          this.scene.blowChain()
        } else {
          const sameColorNearbyTiles = this.scene.nearbyTilesSameColor(this)
          if (sameColorNearbyTiles.length > 0) {
            this.scene.chain = sameColorNearbyTiles
            this.scene.chain.push(this)
            this.pushChain(sameColorNearbyTiles)
          }
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
      const sameColorNearbyTiles = this.scene.nearbyTilesSameColor(tile).filter(el => this.scene.chain.every(chainTile => chainTile.id !== el.id))
      if (sameColorNearbyTiles.length > 0) {
        this.scene.chain = this.scene.chain.concat(sameColorNearbyTiles)
        chainNewElements = chainNewElements.concat(sameColorNearbyTiles)
      }
    })
    if (chainNewElements.length > 0) this.pushChain(chainNewElements)
    else this.scene.blowChain()
  }

  public pulse(): this {
    this.stopPulse()
    this.pulseAni = this.scene.tweens.add({
      onStart: (): void => { this.pulseSprite.setPosition(this.getCenter().x, this.getCenter().y).setVisible(true) },
      targets: this.pulseSprite,
      scale: 1.1,
      alpha: 0,
      duration: 1000,
      loopDelay: 100,
      loop: -1
    })
    return this
  }

  public stopPulse(): this {
    this.pulseAni?.remove()
    this.pulseSprite.setScale(this.scale).setAlpha(1).setVisible(false)
    return this
  }

  public setColor(color: string): void {
    this.color = color
    this.setTexture(color)
  }

  public setNewCell(cell: Icell): this {
    this.scene.findCellByID(this.id).empty = true
    cell.empty = false
    this.col = cell.col
    this.row = cell.row
    this.id = cell.id
    this.setDepth(this.row)
    this.pulseSprite.setDepth(this.depth + 1)
    return this
  }

  public blow(): void {
    this.scene.findCellByID(this.id).empty = true
    this.col = null
    this.row = null
    this.id = ''
    this.stopPulse()
    this.pulseSprite.destroy()
    this.setVisible(false)
    this.blowAnimation()
  }

  private blowAnimation(): void {
    const tile: Phaser.GameObjects.Sprite = this.scene.add.sprite(this.getCenter().x, this.getCenter().y, this.color).setDepth(this.row + 20)
    const tileTint: Phaser.GameObjects.Sprite = this.scene.add.sprite(this.getCenter().x, this.getCenter().y, 'tile-tint').setDepth(this.row + 21).setTint(0xffffff).setAlpha(0)
    this.scene.tweens.add({
      targets: [ tile, tileTint ],
      scale: 1.15,
      alpha: { value: 1, duration: 70, delay: 50 },
      duration: 120,
      ease: 'Quad.easeIn',
      onComplete: (): void => {
        tile.destroy()
        tileTint.destroy()
        this.destroy()
      }
    })
  }
}