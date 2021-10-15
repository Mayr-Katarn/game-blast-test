const red: any = require("./../../assets/images/tiles/red.png");
const blue: any = require("./../../assets/images/tiles/blue.png");
const green: any = require("./../../assets/images/tiles/green.png");
const yellow: any = require("./../../assets/images/tiles/yellow.png");
const pink: any = require("./../../assets/images/tiles/pink.png");
const bomb: any = require("./../../assets/images/tiles/bomb.png");
const tileTint: any = require("./../../assets/images/tiles/tile-tint.png");

const field: any = require("./../../assets/images/field.png");
const btnPink: any = require("./../../assets/images/btn-pink.png");

const lineSide: any = require("./../../assets/images/hud/line-side.png");
const lineMid: any = require("./../../assets/images/hud/line-mid.png");
const lineMask: any = require("./../../assets/images/hud/line-mask.png");
const progressBarBg: any = require("./../../assets/images/hud/progress-bar-bg.png");
const progressBarLine: any = require("./../../assets/images/hud/progress-bar-line.png");
const scoreBar: any = require("./../../assets/images/hud/score-bar.png");
const ball: any = require("./../../assets/images/hud/ball.png");
const busterBtn: any = require("./../../assets/images/hud/buster-btn.png");


export default class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  public preload(): void {

    // прогресс загрузки
    this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'pixel').setTint(0x4E2393).setOrigin(0)
    let text: Phaser.GameObjects.Text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 120, '0%', {
      font: '24px Marvin',
      color: '#54D7BD'
    }).setDepth(1).setOrigin(0.5, 0.5);
  
    let progress: Phaser.GameObjects.TileSprite = this.add.tileSprite(this.cameras.main.centerX - 230, this.cameras.main.centerY - 100, 0, 130, 'load').setOrigin(0, 0.5);

    this.load.on('progress', (value: number): void => {
      let percent: number = Math.round(value * 100);
      let onePercent: number = 420 / 90;
      let bar: number = Math.round(percent * onePercent);
  
      progress.setDisplaySize(bar, 10)
      text.setText(percent + '%');
    });

    
    this.load.image('red', red)
    this.load.image('blue', blue)
    this.load.image('green', green)
    this.load.image('yellow', yellow)
    this.load.image('pink', pink)
    this.load.image('bomb', bomb)
    this.load.image('tile-tint', tileTint)
    this.load.image('line-side', lineSide)
    this.load.image('line-mid', lineMid)
    this.load.image('line-mask', lineMask)

    this.load.image('field', field)
    this.load.image('btn-pink', btnPink)

    this.load.image('progress-bar-bg', progressBarBg)
    this.load.image('progress-bar-line', progressBarLine)
    this.load.image('score-bar', scoreBar)
    this.load.image('ball-bar', ball)
    this.load.image('buster-btn', busterBtn)
  }

  public create(): void {
    this.scene.stop()
    // this.scene.start('MainMenu')
    this.scene.start('Game')
    this.scene.start('Hud')
  }
}