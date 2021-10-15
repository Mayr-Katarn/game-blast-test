import Game from "../scenes/Game";

export default class FlyAwayText {
  public scene: Game
  public x: number
  public y: number

  constructor(scene: Game, x: number, y: number) {
    this.scene = scene
    this.x = x
    this.y = y
    this.init()
  }

  private init(): void {
    const info: Phaser.GameObjects.Text = this.scene.add.text(this.x, this.y, `+${this.scene.blowScore}`, { font: '40px Marvin', color: '#97f088' }).setOrigin(0, 1).setStroke('black', 3).setShadow(0, 0, 'black', 5).setDepth(50)
    if (this.x > this.scene.cameras.main.width - info.getBounds().width + 50) info.setOrigin(1)
    const ani: Phaser.Tweens.Tween = this.scene.add.tween({
      targets: info,
      y: { value: '-=50', duration: 700, delay: 0 },
      alpha: { value: 0, duration: 100, delay: 500 },
      ease: 'Power1',
      onComplete: (): void => {
        info.destroy()
        ani.remove()
      }
    })
  }
}