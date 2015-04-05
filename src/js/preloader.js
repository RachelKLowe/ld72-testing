var window;

(function() {
  "use strict";

  class Preloader {
    constructor() {
      this.asset = null;
      this.ready = false;
    }

    preload() {
      this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, "preloader");

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);

      this.loadResources();
    }

    loadResources() {
      this.load.image("player", "assets/player.png");
      this.load.bitmapFont("minecraftia", "assets/minecraftia.png", "assets/minecraftia.xml");
    }

    create() {
      this.asset.cropEnabled = false;
    }

    update() {
      if (this.ready) {
        this.game.state.start("menu");
      }
    }

    onLoadComplete() {
      this.ready = true;
    }
  }

  window.ld72 = window.ld72 || {};
  window.ld72.Preloader = Preloader;

}());
