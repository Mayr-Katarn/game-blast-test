import './interfaces';
import '../css/style.css';
import * as Phaser from 'phaser';

import Boot from './scenes/Boot';
import Preload from './scenes/Preload';
import Game from './scenes/Game';
import Modal from './scenes/Modal';
import MainMenu from './scenes/MainMenu';
import Hud from './scenes/Hud';


function gcd(num1: number, num2: number): number {
  while (num1 && num2) num1 > num2 ? num1 %= num2 : num2 %= num1
  num1 += num2
  return num1
}

// готовое DOM дерево
window.onload = (): void => {

  setTimeout((): void => {
    let width: number = 0
    let height: number = 0
    let root: any = document.querySelector('#root')
    let clientHeight: number = Math.round(document.body.clientHeight)
    let clientWidth: number = Math.round(document.body.clientWidth)
    let canvasWidth: number = 720
    let canvasHeight: number = 1200

    let x: number = canvasWidth / gcd(canvasHeight, canvasWidth)
    let y: number = canvasHeight / gcd(canvasHeight, canvasWidth)
  
    // размеры в зависимости от высоты и ширины
    if (clientHeight / y > clientWidth / x) {
      width = clientWidth
      height = clientWidth / x * y
    } else {
      width = clientHeight / y * x
      height = clientHeight
    }
  
    root.style.height = height + 'px'
    root.style.width = width + 'px'

    // конфиг игры
    let config = {
      type: Phaser.AUTO,
      width: canvasWidth,
      height: canvasHeight,
      parent: 'root',
      physics: {
        default: 'arcade',
        arcade: { debug: false }
      },
      render: {
        transparent: true // прозрачность канваса
      },
      scene: [
        Boot, Preload,
        MainMenu,
        Game, Hud,
        Modal,
      ]
    }
    
    const game: Phaser.Game = new Phaser.Game(config)
    window.addEventListener('resize', (): void => {
      game.scale.resize(canvasWidth, canvasHeight)
    }, false)

  }, 100)

}
