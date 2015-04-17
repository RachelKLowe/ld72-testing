/* global global */

'use strict';

const Phaser = require('phaser');

const Boot = require('boot');
const Menu = require('menu');
const Game = require('game');
const Preloader = require('preloader');


global.initGame = function () {
  console.debug('bootstrapping...');
  const game = new Phaser.Game(640, 480, Phaser.AUTO, "ld72-game");
  game.state.add("boot", Boot);
  game.state.add("preloader", Preloader);
  game.state.add("menu", Menu);
  game.state.add("game", Game);
  game.state.start("boot");
  console.debug('bootstrapping complete!');
};