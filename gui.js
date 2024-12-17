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

    static BRAIDED_COLOR = new Color(0.1, 0.3, 0.8, 1);
    static BRAIDED_OUTLINE_COLOR = new Color(0.2, 0.4, 0.9, 0.4);
    static NEON_COLOR = new Color(0.15, 0.4, 0.2, 0.7);
    static NEON_OUTLINE_COLOR = new Color(0.2, 0.9, 0.3, 0.5);
    static _3D_COLOR = new Color(0, 0, 0, 1);
    static _3D_OUTLINE_COLOR = new Color(1, 1, 1, 1);
    static BLACK_AND_WHITE_COLOR = new Color(0, 0, 0, 1);

    buttons = [];

    constructor() {
        this.buyPackButton = this.createCostButton(
            12,
            vec2(-15, 5), 
            vec2(8, 4), 
            "Buy Pack", 
            new Color(0.6, 0.6, 1, 1),
            0.8,
            0.8,
            false,
            15
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
            vec2(8, 4), 
            "Upgrade Chances", 
            new Color(0.8, 0.5, 1, 1),
            0.65,
            0.8,
            false,
            6
        );
        this.upgradePackButton.onClick = () => {
            if(GameManager.getInstance().gold < this.upgradePackButton.cost) {
                console.log('Not enough gold to upgrade pack');
                return;
            }

            GameManager.getInstance().gold -= this.upgradePackButton.cost;
            GameManager.getInstance().currentPackUpgrade++;

            if(GameManager.getInstance().currentPackUpgrade > GameManager.getInstance().maxPackUpgrades) {
                GameManager.getInstance().currentPackUpgrade = GameManager.getInstance().maxPackUpgrades;
                this.upgradePackButton.cost = "Maxed";
                this.upgradePackButton.onClick = () => {
                    console.log('Pack already maxed');
                }
            } else {
                this.upgradePackButton.cost = this.upgradePackButton.cost + Math.floor(((GameManager.getInstance().currentPackUpgrade * 25) + 25));
                soundManager.playUpgradeSound();
            }
        }

        this.upgradeAmountButton = this.createCostButton(
            100,
            vec2(-15, -5), 
            vec2(8, 4), 
            "Upgrade Amount", 
            new Color(0.2, 0.9, 0.5, 1),
            0.65,
            0.8,
            false,
            16
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

        this.upgradeSellValueButton = this.createCostButton(
            50,
            vec2(-15, -10), 
            vec2(8, 4), 
            "Upgrade Sell Value", 
            new Color(0.2, 0.9, 0.5, 1),
            0.65,
            0.8,
            false,
            19
        );
        this.upgradeSellValueButton.onClick = () => {
            if(GameManager.getInstance().gold < this.upgradeSellValueButton.cost) {
                console.log('Not enough gold to upgrade sell value');
                return;
            }

            GameManager.getInstance().gold -= this.upgradeSellValueButton.cost;
            GameManager.getInstance().sellMultiplier += 0.2;
            this.upgradeSellValueButton.cost = Number(this.upgradeSellValueButton.cost * 1.2).toFixed(0);
            soundManager.playUpgradeSound();
            this.keepUnownedSellRestButton.cost = -1 * GameManager.getInstance().getKeepAndSellValue();
        }

        this.upgradeBlackAndWhite = this.createCostButton(
            25,
            vec2(-23, 5), 
            vec2(8, 4), 
            "Upgrade Black and White", 
            new Color(0.9, 0.9, 0.9, 1),
            0.65,
            0.8,
            false,
            13
        );
        this.upgradeBlackAndWhite.onClick = () => {
            if(GameManager.getInstance().gold < this.upgradeBlackAndWhite.cost) {
                console.log('Not enough gold to upgrade black and white');
                return;
            }

            GameManager.getInstance().gold -= this.upgradeBlackAndWhite.cost;
            GameManager.getInstance().upgradeBlackAndWhite();
            if(GameManager.getInstance().blackAndWhiteChance >= GameManager.getInstance().maxBlackAndWhite) {
                this.upgradeBlackAndWhite.cost = "Maxed";
                this.upgradeBlackAndWhite.onClick = () => {
                    console.log('Black and White already maxed');
                }
            } else {
                this.upgradeBlackAndWhite.cost = this.upgradeBlackAndWhite.cost + 25;
            }
            soundManager.playUpgradeSound();
        }

        this.upgradeBraided = this.createCostButton(
            50,
            vec2(-23, 0), 
            vec2(8, 4), 
            "Upgrade Braided", 
            new Color(0.9, 0.9, 0.9, 1),
            0.65,
            0.8,
            false,
            18
        );
        this.upgradeBraided.onClick = () => {
            if(GameManager.getInstance().gold < this.upgradeBraided.cost) {
                console.log('Not enough gold to upgrade braided');
                return;
            }

            GameManager.getInstance().gold -= this.upgradeBraided.cost;
            GameManager.getInstance().upgradeBraided();
            if(GameManager.getInstance().braidedChance >= GameManager.getInstance().maxBraided) {
                this.upgradeBraided.cost = "Maxed";
                this.upgradeBraided.onClick = () => {
                    console.log('Braided already maxed');
                }
            } else {
                this.upgradeBraided.cost = this.upgradeBraided.cost + 50;
            }
            soundManager.playUpgradeSound();
        }

        this.upgrade3D = this.createCostButton(
            100,
            vec2(-23, -5), 
            vec2(8, 4), 
            "Upgrade 3D", 
            new Color(0.9, 0.9, 0.9, 1),
            0.65,
            0.8,
            false,
            14
        );
        this.upgrade3D.onClick = () => {
            if(GameManager.getInstance().gold < this.upgrade3D.cost) {
                console.log('Not enough gold to upgrade 3D');
                return;
            }

            GameManager.getInstance().gold -= this.upgrade3D.cost;
            GameManager.getInstance().upgrade3D();
            if(GameManager.getInstance()._3DChance >= GameManager.getInstance().max3d) {
                this.upgrade3D.cost = "Maxed";
                this.upgrade3D.onClick = () => {
                    console.log('3D already maxed');
                }
            } else {
                this.upgrade3D.cost = this.upgrade3D.cost + 100;
            }
            soundManager.playUpgradeSound();
        }

        this.upgradeNeon = this.createCostButton(
            200,
            vec2(-23, -10), 
            vec2(8, 4), 
            "Upgrade Neon", 
            new Color(0.9, 0.9, 0.9, 1),
            0.65,
            0.8,
            false,
            17
        );
        this.upgradeNeon.onClick = () => {
            if(GameManager.getInstance().gold < this.upgradeNeon.cost) {
                console.log('Not enough gold to upgrade neon');
                return;
            }

            GameManager.getInstance().gold -= this.upgradeNeon.cost;
            GameManager.getInstance().upgradeNeon();
            if(GameManager.getInstance().neonChance >= GameManager.getInstance().maxNeon) {
                this.upgradeNeon.cost = "Maxed";
                this.upgradeNeon.onClick = () => {
                    console.log('Neon already maxed');
                }
            } else {
                this.upgradeNeon.cost = this.upgradeNeon.cost + 200;
            }
            soundManager.playUpgradeSound();
        }

        this.mineGoldButton = this.createCostButton(
            -1,
            vec2(15, 5), 
            vec2(8, 4), 
            "Free Gold", 
            new Color(1, 0.8, 0.3, 1),
            0.8,
            0.9,
            true,
            3
        );
        this.goldEmitter = new ParticleEmitter(
            this.mineGoldButton.pos, 0,	//position, angle
            1.2,	// emitSize
            0,	// emitTime
            200,	// emitRate
            6,	// emitConeAngle
            tile(0, 128, 10),	// tileIndex
            new Color(0.914, 0.902, 0.647, 1),	// colorStartA
            new Color(0.988, 1, 0.22, 1),	// colorStartB
            new Color(0.914, 0.902, 0.647, 1),	// colorStartA
            new Color(0.988, 1, 0.22, 1),	// colorEndB
            1.1,	// particleTime
            0.1,	// sizeStart
            1,	// sizeEnd
            0.2,	// speed
            0,	// angleSpeed
            0.97,	// damping
            1,	// angleDamping
            1,	// gravityScale
            0,	// particleConeAngle
            0.2,	// fadeRate
            0,	// randomness
            0,	// collideTiles
            0,	// additive
            0,	// randomColorLinear
        ); // particle emitter
        this.goldEmitter.emitRate = 0;
        this.mineGoldButton.onClick = async () => {
            soundManager.playPopSound();
            GameManager.getInstance().gold++;
            this.goldEmitter.emitRate = 100;
            setTimeout(() => {
                this.goldEmitter.emitRate = 0;
            }, 50);
        }

        // this.sellAllButton = this.createCostButton(0, vec2(15, 0), vec2(7, 3.5), "Sell All", new Color(1, 0.9, 0.2, 1), 0.9, 0.8, true, 13);
        // this.sellAllButton.onClick = () => {
        //     GameManager.getInstance().sellAllAnimals();
        // }
        // this.sellAllButton.onShow = () => {
        //     this.sellAllButton.cost = -1 * GameManager.getInstance().getAllAnimalsSellValue();
        // }
        // this.sellAllButton.hide();

        // this.keepAllButton = this.createButton(vec2(15, -5), vec2(7, 3.5), "Keep All", new Color(0.1, 0.9, 0.2, 1), 0.85, 9);
        // this.keepAllButton.onClick = () => {
        //     GameManager.getInstance().keepAllAnimals();
        // }
        // this.keepAllButton.hide();

        this.keepUnownedSellRestButton = this.createCostButton(0, vec2(15, 0), vec2(7, 3.5), "Keep and Sell", new Color(0.1, 0.9, 0.2, 1), 0.8, 0.8, true, 12);
        this.keepUnownedSellRestButton.onClick = () => {
            GameManager.getInstance().keepUnownedSellRest();
        }
        this.keepUnownedSellRestButton.onShow = () => {
            this.keepUnownedSellRestButton.cost = -1 * GameManager.getInstance().getKeepAndSellValue();
        }
        this.keepUnownedSellRestButton.hide();

        this.sellButton = this.createButton(vec2(-4, -11), vec2(7, 3.5), "Sell", new Color(1, 0.9, 0.2, 1), 1.2, 10);
        this.sellButton.onClick = () => {
            GameManager.getInstance().sellAnimal();
            this.keepUnownedSellRestButton.cost = -1 * GameManager.getInstance().getKeepAndSellValue();
        }
        this.sellButton.hide();

        this.keepButton = this.createButton(vec2(4, -11), vec2(7, 3.5), "Keep", new Color(0.1, 0.9, 0.2, 1), 1.2, 11);
        this.keepButton.onClick = () => {
            GameManager.getInstance().keepAnimal();
            this.keepUnownedSellRestButton.cost = -1 * GameManager.getInstance().getKeepAndSellValue();
        }
        this.keepButton.hide();

        this.disableParticlesButton = this.createButton(vec2(15, -8), vec2(5, 2), "Disable Particles", new Color(0.9, 0.9, 0.5, 1), 0.55, 9);
        this.disableParticlesButton.onClick = () => {
            GameManager.getInstance().particlesEnabled = !GameManager.getInstance().particlesEnabled;
            this.disableParticlesButton.text = GameManager.getInstance().particlesEnabled ? "Disable Particles" : "Enable Particles";
            //go over all animals and enable/disable particles
            for(let animal of GameManager.getInstance().animals) {
                if(animal.emitter) {
                    animal.emitter.emitRate = GameManager.getInstance().particlesEnabled ? 6 : 0;
                }
            }
        }

        this.muteButton = this.createButton(vec2(15, -10), vec2(5, 2), "Mute Sounds", new Color(0.9, 0.9, 0.5, 1), 0.55, 7);
        this.muteButton.onClick = () => {
            soundManager.toggleMute();
            this.muteButton.text = soundManager.muted ? "Unmute Sounds" : "Mute Sounds";
        }

        this.postProcessingButton = this.createButton(vec2(15, -12), vec2(5, 2), "Disable Post Processing", new Color(0.9, 0.9, 0.5, 1), 0.55, 8);
        this.postProcessingButton.onClick = () => {
            postProcessEnabled = !postProcessEnabled;
            this.postProcessingButton.text = postProcessEnabled ? "Disable Post Processing" : "Enable Post Processing";
        }

        console.log('GUI created');
    }

    createButton(pos, size, text, hoverTextColor, textSize, imageIndex = 0) {
        let button = new Button(pos, size, text, hoverTextColor, textSize, imageIndex);
        this.buttons.push(button);
        return button;
    }

    createCostButton(cost, pos, size, text, hoverTextColor, textSize, costTextSize, addsGold = false, imageIndex = 0) {
        let button = new CostButton(cost, pos, size, text, hoverTextColor, textSize, costTextSize, addsGold, imageIndex);
        this.buttons.push(button);
        return button;
    }

    update() {

    }

    render() {
        this.drawGoldText();
        this.drawCompletionText();
        this.drawChancesText();
        this.drawEffectChancesText();
        this.drawCurrentAmountOfAnimals();
        this.drawCurrentSellValue();
        let selectedAnimal = GameManager.getInstance().selectedAnimal;
        if(selectedAnimal) {
            this.drawSelectedAnimalName(selectedAnimal.name);
            this.drawSelectedAnimalRarityText(selectedAnimal.rarity);
            this.drawSelectedAnimalCostText(GameManager.getInstance().getSellValue(selectedAnimal));
            this.drawSelectedAnimalTypeText(selectedAnimal.type);
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
        this.keepUnownedSellRestButton.show();
    }

    hideAllAnimalButtons() {
        this.keepUnownedSellRestButton.hide();
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

    static getRarityForIndex(index) {
        switch (index) {
            case "0":
                return "common";
            case "1":
                return "uncommon";
            case "2":
                return "rare";
            case "3":
                return "epic";
            case "4":
                return "legendary";
            default:
                //throw error
                console.error("Invalid index: " + index);
        }
    }

    static getIndexForRarity(rarity) {
        switch (rarity) {
            case "common":
                return 0;
            case "uncommon":
                return 1;
            case "rare":
                return 2;
            case "epic":
                return 3;
            case "legendary":
                return 4;
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

    drawCompletionText() {
        let ownedAnimals = GameManager.getInstance().zoo.size;
        let totalAnimals = Object.keys(GameManager.getInstance().data.animals).length * 5;
        let percentage = Number(ownedAnimals / totalAnimals * 100).toFixed(2)
        drawTextScreen(
            "Completed " + percentage + "% [" + ownedAnimals + "/" + totalAnimals + "]",
            vec2(mainCanvasSize.x/4, 120), //position
            25,   // size
            GUI.LEGENDARY_COLOR,
            2,
            GUI.DARK_LEGENDARY_COLOR,
            "right",
            "courier"
        );
    }

    drawChancesText() {
        let chances = GameManager.getInstance().getChances();
        let x = mainCanvasSize.x/1.53;
        let y = 100;
        let size = 25;
        let spacing = 20;

        for(let rarity in chances) {
            let rarityText = GUI.getRarityForIndex(rarity);
            drawTextScreen(
                rarityText + ': ' + Math.floor(chances[rarity] * 100) + '%', 
                vec2(x, y), //position
                size,   // size
                GUI.getColorForRarity(rarityText),
                2,
                Color.BLACK,
                "left",
                "courier"
            );
            y += spacing;
        }
    }

    drawEffectChancesText() {
        let x = mainCanvasSize.x/1.53 + 210;
        let y = 100;
        let size = 24;
        let spacing = 20;

        //AnimalType
        let blackAndWhiteChance = GameManager.getInstance().blackAndWhiteChance;
        let braidedChance = GameManager.getInstance().braidedChance;
        let _3DChance = GameManager.getInstance()._3DChance;
        let neonChance = GameManager.getInstance().neonChance;
        let normalChance = 1 - (blackAndWhiteChance + _3DChance + neonChance + braidedChance);
        drawTextScreen(
            "normal: " + precisionRound(normalChance * 100, 2) + '%', 
            vec2(x, y), //position
            size,   // size
            GUI.DARK_COMMON_COLOR,
            1.6,
            Color.BLACK,
            "left",
            "courier"
        );
        y += spacing;
        drawTextScreen(
            "black and white: " + precisionRound(blackAndWhiteChance * 100, 2) + '%', 
            vec2(x, y), //position
            size,   // size
            GUI.BLACK_AND_WHITE_COLOR,
            1.6,
            Color.WHITE,
            "left",
            "courier"
        );
        y += spacing;
        drawTextScreen(
            "braided: " + precisionRound(braidedChance * 100, 2) + '%', 
            vec2(x, y), //position
            size,   // size
            GUI.BRAIDED_COLOR,
            1.1,
            Color.BLACK,
            "left",
            "courier"
        );
        y += spacing;
        drawTextScreen(
            "3D: " + precisionRound(_3DChance  * 100, 2) + '%', 
            vec2(x, y), //position
            size,   // size
            GUI._3D_COLOR,
            4,
            GUI._3D_OUTLINE_COLOR,
            "left",
            "courier"
        );
        y += spacing;
        drawTextScreen(
            "neon: " + precisionRound(neonChance * 100, 2) + '%', 
            vec2(x, y), //position
            size,   // size
            GUI.NEON_COLOR,
            4,
            GUI.NEON_OUTLINE_COLOR,
            "left",
            "courier"
        );
        y += spacing;
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

    drawSelectedAnimalTypeText(type) {
        let typeText = "";
        let font = "";
        let color = Color.WHITE;
        let outlineColor = Color.BLACK;
        switch(type) {
            case AnimalType.BLACK_AND_WHITE:
                typeText = "Black and White";
                font = "courier";
                break;
            case AnimalType.BRAIDED:
                typeText = "Braided";
                font = "impact";
                color = GUI.BRAIDED_COLOR
                outlineColor = GUI.BRAIDED_OUTLINE_COLOR
                break;
            case AnimalType._3D:
                typeText = "3D";
                font = "impact";
                color = GUI._3D_COLOR
                outlineColor = GUI._3D_OUTLINE_COLOR
                break;
            case AnimalType.NEON:
                typeText = "Neon";
                font = "comic sans ms";
                color = GUI.NEON_COLOR
                outlineColor = GUI.NEON_OUTLINE_COLOR
                break;
        }
        drawTextScreen(
            typeText,
            vec2(mainCanvasSize.x/2, 30),
            22,
            color,
            7,
            outlineColor,
            "center",
            font
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

    drawCurrentAmountOfAnimals() {
        drawTextScreen(
            "stickers in pack: " + GameManager.getInstance().numberOfAnimals,
            vec2(mainCanvasSize.x/1.53, 50), //position
            20,   // size
            Color.BLACK,
            3.5,
            GUI.DARK_GOLD_COLOR,
            "left",
            "courier"
        );
    }

    drawCurrentSellValue() {
        drawTextScreen(
            "sell value: " + Math.round(GameManager.getInstance().sellMultiplier * 100) + "%",
            vec2(mainCanvasSize.x/1.53, 70), //position
            20,   // size
            Color.BLACK,
            3.5,
            GUI.DARK_RARE_COLOR,
            "left",
            "courier"
        );
    }
    
}

function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}