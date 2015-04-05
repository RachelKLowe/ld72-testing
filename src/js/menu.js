var window;

(function() {
  "use strict";

  class Menu {
    constructor() {
      this.titleTxt = null;
      this.startTxt = null;
    }

    create() {
      var x = this.game.width / 2
        , y = this.game.height / 2;


      this.titleTxt = this.add.bitmapText(x, y, "minecraftia", "Example Game" );
      this.titleTxt.align = "center";
      this.titleTxt.x = this.game.width / 2 - this.titleTxt.textWidth / 2;

      y = y + this.titleTxt.height + 5;
      this.startTxt = this.add.bitmapText(x, y, "minecraftia", "START");
      this.startTxt.align = "center";
      this.startTxt.x = this.game.width / 2 - this.startTxt.textWidth / 2;

      this.input.onDown.add(this.onDown, this);
    }

    update() {

    }

    onDown() {
      this.game.state.start("game");
    }
  }

  window.ld72 = window.ld72 || {};
  window.ld72.Menu = Menu;

}());
