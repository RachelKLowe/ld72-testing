var window;
var Phaser;

window.onload = () => {
  "use strict";

  var game
    , ns = window.ld72;

  game = new Phaser.Game(640, 480, Phaser.AUTO, "ld72-game");
  game.state.add("boot", ns.Boot);
  game.state.add("preloader", ns.Preloader);
  game.state.add("menu", ns.Menu);
  game.state.add("game", ns.Game);
  /* yo phaser:state new-state-files-put-here */

  game.state.start("boot");
};
