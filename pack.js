'use strict';

class Pack extends Interactable {
  constructor(numberOfAnimals, pos, angle) {
    super(pos, vec2(14), tile(0, vec2(1024, 1024), 1), angle);
    this.numberOfAnimals = numberOfAnimals
    this.isOpened = false;
    this.isOpening = false;
    this.isTorn = false;
    this.isEndAnimation = false;

    this.animationTimer = new Timer();

    this.tearPart = new EngineObject(pos, vec2(14), tile(1, vec2(1024, 1024), 3), angle);
    this.addChild(this.tearPart);
  }

  openPack() {
    // open the pack
    if(this.isOpened) return;
    this.isOpening = true;
  }

  update() {
    super.update();

    if(this.isOpening && !this.isOpened) {
        this.tearPart.localPos = this.tearPart.localPos.lerp(vec2(0, 1.2), 0.2);
        
        if(this.tearPart.localPos.y >= 1 || this.isTorn) {
            if(!this.isTorn) {
                this.animationTimer.set(0.5);
            }
            this.isTorn = true;

            if(this.animationTimer.elapsed()) {
                this.endAnimation();
            }
        }
    }
  }

  endAnimation() {
    this.isEndAnimation = true;

    this.tearPart.size = this.tearPart.size.lerp(vec2(), 0.1);
    this.size = this.size.lerp(vec2(), 0.1);

    if(this.size.x < 0.1) {
        this.isOpening = false;
        this.isEndAnimation = false;
        this.isOpened = true;
        this.destroy();
    }
  }
}