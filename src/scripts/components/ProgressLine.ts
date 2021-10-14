import Hud from "../scenes/Hud";

export default class ProgressLine extends Phaser.GameObjects.Container {
  public scene: Hud
  public x: number
  public y: number

  private maxLineWidth: number
  private lineLeft: Phaser.GameObjects.Sprite
  private lineMid: Phaser.GameObjects.TileSprite
  private lineRight: Phaser.GameObjects.Sprite
  private setWidthAni: Phaser.Tweens.Tween

  constructor(scene: Hud, x: number, y: number) {
    super(scene, x, y)
    this.scene = scene
    this.x = x
    this.y = y
    this.init()
  }

  private init(): void {
    this.scene.add.existing(this)
    this.maxLineWidth = 429
    this.lineLeft = this.scene.add.sprite(0, 0, 'line-side').setOrigin(0, 0.5)
    this.lineMid = this.scene.add.tileSprite(this.lineLeft.getRightCenter().x, this.lineLeft.getRightCenter().y, 5, this.lineLeft.height,'line-mid').setOrigin(0, 0.5)
    this.lineRight = this.scene.add.sprite(this.lineMid.getRightCenter().x, this.lineMid.getRightCenter().y, 'line-side').setOrigin(0, 0.5).setFlipX(true)
    this.add([
      this.lineLeft,
      this.lineMid,
      this.lineRight,
    ])
  }

  public setProgress(percent: number): this {
    const width = this.maxLineWidth / 100 * percent
    this.setWidthAni = this.scene.add.tween({
      targets: this.lineMid,
      onUpdate: (): void => { this.lineRight.setX(this.lineMid.getRightCenter().x) },
      width,
      duration: 1000,
      delay: 1540,
      ease: 'Power3'
    })
    return this
  }
}