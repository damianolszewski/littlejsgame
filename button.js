class Button extends EngineObject {
    // callback functions
    onEnter() {}
    onLeave() {}
    onPress() {}
    onClick() {}

    constructor(pos, size, text, hoverTextColor, textSize = 2) {
        super(pos, size, tile(0, vec2(2001, 1183), 9));

        this.startSize = size;
        this.text = text
        this.startTextSize = textSize;
        this.textSize = textSize;
        
        this.hoverTextColor = hoverTextColor;
        this.baseColor = new Color(1, 1, 1, 1);

        this.textColor = this.baseColor;
    }

    update() {
        super.update();
        if(this.hidden) return;

        const mouseWasOver = this.mouseIsOver;
        this.mouseIsOver = isMouseOver(this);
        if (this.mouseIsOver) {
            this.size = this.size.lerp(vec2(this.startSize.x + 0.2, this.startSize.y + 0.2), 0.1);
            //smoth transition to 2.5 without vector lerp because its single value
            this.textSize = this.textSize + ((this.startTextSize + 0.2) - this.textSize) * 0.1;
            this.textColor = this.hoverTextColor
        } else {
            this.size = this.size.lerp(this.startSize, 0.1);
            this.textSize = this.textSize + (this.startTextSize - this.textSize) * 0.1;
            this.textColor = this.baseColor;
        }

        if (this.mouseIsOver && !mouseWasOver) {
            console.log("Mouse is over button");
            this.onEnter();
        }
        if (!this.mouseIsOver && mouseWasOver) {
            console.log("Mouse is no longer over button");
            this.onLeave();
        }
        if (mouseWasPressed(0) && this.mouseIsOver)
        {
            console.log("Mouse was pressed over button");
            this.mouseIsHeld = true;
            this.onPress();
        }
        else if (this.mouseIsHeld && !mouseIsDown(0))
        {
            console.log("Mouse was released over button");
            this.mouseIsHeld = false;
            if (this.mouseIsOver)
                this.onClick();
        }
    }

    render() {
        super.render();
        this.renderText();
    }

    renderText() {
        if(!this.hidden) {
            drawText(this.text, this.pos, this.textSize, this.textColor, 0.12, 1, "center", "courier");
        }
    }

    hide() {
        this.hidden = true;
        this.size = vec2(0);
    }

    show() {
        this.hidden = false;
        this.size = this.startSize;
    }
}

class CostButton extends Button {

    constructor(cost, pos, size, text, hoverTextColor, textSize = 2, costTextSize = 2, addsGold = false) {
        super(pos, size, text, hoverTextColor, textSize);

        this.costTextSize = costTextSize;

        this.addsGold = addsGold;
        this.cost = cost;

        this.costIcon = new EngineObject(pos, vec2(0.7), tile(0, vec2(128, 128), 10));
        this.addChild(this.costIcon, vec2(0.5, -0.7));
    }

    renderText() {
        if(!this.hidden) {
            drawText(
                this.text, 
                vec2(this.pos.x, this.pos.y + 0.35), 
                this.textSize, 
                this.textColor,
                0.12, 
                1, 
                "center", 
                "courier"
            );
            drawText(
                this.addsGold ? "+" + this.cost * -1 : this.cost, 
                vec2(this.pos.x, this.pos.y - 0.75), 
                this.costTextSize, 
                this.addsGold ? GUI.UNCOMMON_COLOR : GUI.GOLD_COLOR, 
                0.12, 
                1, 
                "right", 
                "courier"
            );
        }
    }
}