class Interactable extends EngineObject {
    // callback functions
    onEnter() {}
    onLeave() {}
    onPress() {}
    onClick() {}

    constructor(pos, scale, sprite, angle) {
        super(pos, scale, sprite, angle);
    }

    update() {
        super.update();

        const mouseWasOver = this.mouseIsOver;
        this.mouseIsOver = isMouseOver(this);

        if (this.mouseIsOver && !mouseWasOver) {
            this.onEnter();
        }
        if (!this.mouseIsOver && mouseWasOver) {
            this.onLeave();
        }
        if (mouseWasPressed(0) && this.mouseIsOver)
        {
            this.mouseIsHeld = true;
            this.onPress();
        }
        else if (this.mouseIsHeld && !mouseIsDown(0))
        {
            this.mouseIsHeld = false;
            if (this.mouseIsOver)
                this.onClick();
        }
    }

    render() {
        super.render();
    }
}