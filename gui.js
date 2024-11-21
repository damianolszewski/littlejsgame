class GUI {
    static instance = null;
    static getInstance() {
        if(GUI.instance == null) {
            GUI.instance = new GUI();
        }
        return GUI.instance;
    }

    static GOLD_COLOR = new Color(1, 0.8, 0.3, 1);
    static DARK_GOLD_COLOR = new Color(0.5, 0.2, 0.1, 1);

    static COMMON_COLOR = new Color(0.9, 0.9, 0.9, 1);
    static UNCOMMON_COLOR = new Color(0.1, 0.9, 0.2, 1);
    static RARE_COLOR = new Color(0.1, 0.2, 0.9, 1);
    static EPIC_COLOR = new Color(0.8, 0.1, 0.7, 1);
    static LEGENDARY_COLOR = new Color(0.95, 0.5, 0.2, 1);

    static DARK_COMMON_COLOR = new Color(0.45, 0.45, 0.45, 1);
    static DARK_UNCOMMON_COLOR = new Color(0.05, 0.45, 0.1, 1);
    static DARK_RARE_COLOR = new Color(0.05, 0.1, 0.45, 1);
    static DARK_EPIC_COLOR = new Color(0.4, 0.05, 0.35, 1);
    static DARK_LEGENDARY_COLOR = new Color(0.475, 0.25, 0.1, 1);

    buttons = [];

    constructor() {
        this.buyPackButton = this.createCostButton(
            12,
            vec2(-15, 5), 
            vec2(7, 3), 
            "Buy Pack", 
            new Color(0.6, 0.6, 1, 1),
            1,
            0.8
        );
        this.buyPackButton.onClick = () => {
            if(GameManager.getInstance().state !== GameState.IDLE) {
                console.log('Cannot buy pack while in state: ' + GameManager.getInstance().state);
                return;
            }
            if(GameManager.getInstance().gold < this.buyPackButton.cost) {
                console.log('Not enough gold to buy pack');
                return;
            }

            GameManager.getInstance().gold -= this.buyPackButton.cost;
            GameManager.getInstance().createPack();
        }

        this.upgradePackButton = this.createCostButton(
            "???",
            vec2(-15, 0), 
            vec2(7, 3), 
            "Upgrade Chances", 
            new Color(0.8, 0.5, 1, 1),
            0.65,
            0.8
        );
        this.upgradePackButton.onClick = () => {
            if(GameManager.getInstance().gold < this.upgradePackButton.cost) {
                console.log('Not enough gold to upgrade pack');
                return;
            }

            GameManager.getInstance().gold -= this.upgradePackButton.cost;
            GameManager.getInstance().currentPackUpgrade++;
            this.upgradePackButton.cost = (GameManager.getInstance().currentPackUpgrade * 25) + 25;
            soundManager.playUpgradeSound();
        }

        this.upgradeAmountButton = this.createCostButton(
            150,
            vec2(-15, -5), 
            vec2(7, 3), 
            "Upgrade Amount", 
            new Color(0.2, 0.9, 0.5, 1),
            0.65,
            0.8
        );
        this.upgradeAmountButton.onClick = () => {
            if(GameManager.getInstance().gold < this.upgradeAmountButton.cost) {
                console.log('Not enough gold to upgrade amount');
                return;
            }

            GameManager.getInstance().gold -= this.upgradeAmountButton.cost;
            GameManager.getInstance().numberOfAnimals++;
            this.upgradeAmountButton.cost *= 2;
            soundManager.playUpgradeSound();
        }

        this.mineGoldButton = this.createCostButton(
            -1,
            vec2(15, 5), 
            vec2(7, 3), 
            "Mine Gold", 
            new Color(1, 0.8, 0.3, 1),
            1,
            0.9,
            true
        );
        this.goldEmitter = new ParticleEmitter(
            this.mineGoldButton.pos, 0,	//position, angle
            1.2,	// emitSize
            0,	// emitTime
            100,	// emitRate
            3.14,	// emitConeAngle
            tile(0, 128, 10),	// tileIndex
            new Color(0.914, 0.902, 0.647, 1),	// colorStartA
            new Color(0.988, 1, 0.22, 1),	// colorStartB
            new Color(0.996, 0.792, 0.443, 0),	// colorEndA
            new Color(1, 0.847, 0.302, 0),	// colorEndB
            1.1,	// particleTime
            0.1,	// sizeStart
            1.6,	// sizeEnd
            0.1,	// speed
            0.15,	// angleSpeed
            0.96,	// damping
            1,	// angleDamping
            0,	// gravityScale
            3.14,	// particleConeAngle
            0.2,	// fadeRate
            0.2,	// randomness
            0,	// collideTiles
            0,	// additive
            1,	// randomColorLinear
        ); // particle emitter
        this.goldEmitter.emitRate = 0;
        this.mineGoldButton.onClick = async () => {
            soundManager.playPopSound();
            console.log('Mining gold');
            GameManager.getInstance().gold++;
            this.goldEmitter.emitRate = 100;
            setTimeout(() => {
                this.goldEmitter.emitRate = 0;
            }, 50);
        }

        this.sellAllButton = this.createButton(vec2(15, 0), vec2(7, 3), "Sell All", new Color(1, 0.9, 0.2, 1), 1.2);
        this.sellAllButton.onClick = () => {
            GameManager.getInstance().sellAllAnimals();
        }
        this.sellAllButton.hide();

        this.keepAllButton = this.createButton(vec2(15, -5), vec2(7, 3), "Keep All", new Color(0.1, 0.9, 0.2, 1), 1.2);
        this.keepAllButton.onClick = () => {
            GameManager.getInstance().keepAllAnimals();
        }
        this.keepAllButton.hide();

        this.sellButton = this.createButton(vec2(-4, -11), vec2(7, 3), "Sell", new Color(1, 0.9, 0.2, 1));
        this.sellButton.onClick = () => {
            GameManager.getInstance().sellAnimal();
        }
        this.sellButton.hide();

        this.keepButton = this.createButton(vec2(4, -11), vec2(7, 3), "Keep", new Color(0.1, 0.9, 0.2, 1));
        this.keepButton.onClick = () => {
            GameManager.getInstance().keepAnimal();
        }
        this.keepButton.hide();

        console.log('GUI created');
    }

    createButton(pos, size, text, hoverTextColor, textSize) {
        let button = new Button(pos, size, text, hoverTextColor, textSize);
        this.buttons.push(button);
        return button;
    }

    createCostButton(cost, pos, size, text, hoverTextColor, textSize, costTextSize, addsGold = false) {
        let button = new CostButton(cost, pos, size, text, hoverTextColor, textSize, costTextSize, addsGold);
        this.buttons.push(button);
        return button;
    }

    update() {

    }

    render() {
        this.drawGoldText();
        this.drawChancesText();
        let selectedAnimal = GameManager.getInstance().selectedAnimal;
        if(selectedAnimal) {
            this.drawSelectedAnimalName(selectedAnimal.name);
            this.drawSelectedAnimalRarityText(selectedAnimal.rarity);
            this.drawSelectedAnimalCostText(selectedAnimal.cost);
        } else {
            switch(GameManager.getInstance().state) {
                case GameState.PACK_OPENING:
                    this.drawPackOpeningText();
                    break;
                case GameState.ANIMALS_CREATED:
                    this.drawAnimalsCreatedText();
                    break;
            }
        }
    }

    showAllAnimalButtons() {
        this.sellAllButton.show();
        this.keepAllButton.show();
    }

    hideAllAnimalButtons() {
        this.sellAllButton.hide();
        this.keepAllButton.hide();
    }

    showSingularAnimalButtons() {
        this.sellButton.show();
        this.keepButton.show();
    }

    hideSingularAnimalButtons() {
        this.sellButton.hide();
        this.keepButton.hide();
    }

    static getColorForRarity(rarity) {
        switch (rarity) {
            case "common":
                return GUI.COMMON_COLOR;
            case "uncommon":
                return GUI.UNCOMMON_COLOR;
            case "rare":
                return GUI.RARE_COLOR;
            case "epic":
                return GUI.EPIC_COLOR;
            case "legendary":
                return GUI.LEGENDARY_COLOR;
            default:
                //throw error
                console.error("Invalid rarity: " + rarity);
        }
    }

    static getDarkerColorForRarity(rarity) {
        switch (rarity) {
            case "common":
                return GUI.DARK_COMMON_COLOR;
            case "uncommon":
                return GUI.DARK_UNCOMMON_COLOR;
            case "rare":
                return GUI.DARK_RARE_COLOR;
            case "epic":
                return GUI.DARK_EPIC_COLOR;
            case "legendary":
                return GUI.DARK_LEGENDARY_COLOR;
            default:
                //throw error
                console.error("Invalid rarity: " + rarity);
        }
    }

    drawGoldText() {
        drawTextScreen(
            GameManager.getInstance().gold,
            vec2(mainCanvasSize.x/4, 70), //position
            50,   // size
            GUI.GOLD_COLOR,
            2,
            GUI.DARK_GOLD_COLOR,
            "right",
            "courier"
        );

        let tileImage = textureInfos[10].image 
        mainContext.drawImage(tileImage, mainCanvasSize.x/4 + 15, 50, 36, 36);
    }

    drawChancesText() {
        drawTextScreen(
            'Chances:', 
            vec2(mainCanvasSize.x/1.4, 70), //position
            36,   // size
            Color.WHITE,
            5,
            Color.BLACK,
            "left",
            "courier"
        );

        let chances = GameManager.getInstance().getChances();
        let x = mainCanvasSize.x/1.4;
        let y = 100;
        let size = 30;
        let spacing = 24;

        for(let rarity in chances) {
            drawTextScreen(
                rarity.charAt(0).toUpperCase() + rarity.slice(1) + ': ' + Math.floor(chances[rarity] * 100) + '%', 
                vec2(x, y), //position
                size,   // size
                GUI.getColorForRarity(rarity),
                2,
                Color.BLACK,
                "left",
                "courier"
            );
            y += spacing;
        }
    }

    drawSelectedAnimalName(selectedAnimalName) {
        drawTextScreen(
            selectedAnimalName.charAt(0).toUpperCase() + selectedAnimalName.slice(1), 
            vec2(mainCanvasSize.x/2, 70),
            50,
            Color.WHITE,
            5,
            Color.BLACK,
            "center",
            "courier"
        );
    }

    drawSelectedAnimalRarityText(rarity) {
        drawTextScreen(
            rarity,
            vec2(mainCanvasSize.x/2, 110),
            30,
            GUI.getColorForRarity(rarity),
            3,
            GUI.getDarkerColorForRarity(rarity),
            "center",
            "courier"
        );
    }

    drawSelectedAnimalCostText(cost) {
        drawTextScreen(
            cost + " gold",
            vec2(mainCanvasSize.x/2, 150),
            40,
            GUI.GOLD_COLOR,
            2,
            GUI.DARK_GOLD_COLOR,
            "center",
            "courier"
        );
    }

    drawPackOpeningText() {
        drawTextScreen(
            'Open your pack.', 
            vec2(mainCanvasSize.x/2, 70), //position
            50,   // size
            Color.WHITE,
            5,
            Color.BLACK,
            "center",
            "courier"
        );
    }

    drawAnimalsCreatedText() {
        drawTextScreen(
            'Wow!', 
            vec2(mainCanvasSize.x/2, 70), //position
            50,   // size
            Color.WHITE,
            5,
            Color.BLACK,
            "center",
            "courier"
        );
    }
    
}