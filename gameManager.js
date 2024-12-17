const GameState = {
    PACK_OPENING: 0,
    PACK_OPENING_ANIMATION: 1,
    PACK_OPENED: 2,
    ANIMALS_CREATED: 3,
    IDLE: 4
}

class GameManager {
    static instance = null;

    static getInstance() {
        if (GameManager.instance == null) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    constructor() {
        this.loadProgress();

        fetch('data/animals.json')
            .then(response => response.json())
            .then(data => {
                AnimalManager.getInstance().initialize(data.animals);
                this.particlesEnabled = true;

                if(!this.blackAndWhiteUpgrade) {
                    this.blackAndWhiteUpgrade = 1;
                }
                if(!this.braidedUpgrade) {
                    this.braidedUpgrade = 1;
                }
                if(!this._3DUpgrade) {
                    this._3DUpgrade = 1;
                }
                if(!this.neonUpgrade) {
                    this.neonUpgrade = 1;
                }
                if(!this.sellValueUpgrade) {
                    this.sellValueUpgrade = 1;
                }

                this.blackAndWhiteChance = this.blackAndWhiteChance || 0;
                this.braidedChance = this.braidedChance || 0;
                this._3DChance = this._3DChance || 0;
                this.neonChance = this.neonChance || 0;
                this.normalChance = 1;

                this.blackAndWhiteAdditionalCost = 10;
                this.braidedAdditionalCost = 40;
                this._3DAdditionalCost = 100;
                this.neonAdditionalCost = 250;

                this.data = data;
                this.animals = [];
                this.selectedAnimal = null;

                this.animalsInitialized = true;
            });

        fetch('data/chances.json')
            .then(response => response.json())
            .then(data => {
                this.chancesData = data;
                this.maxPackUpgrades = Object.keys(this.chancesData).length;

                if (!this.currentPackUpgrade) {
                    this.currentPackUpgrade = 1;
                }

                this.chancesInitialized = true;
            });
    }

    saveProgress() {
        const progress = {
            gold: this.gold,
            zoo: Array.from(this.zoo),
            blackAndWhiteChance: this.blackAndWhiteChance,
            braidedChance: this.braidedChance,
            _3DChance: this._3DChance,
            neonChance: this.neonChance,
            sellMultiplier: this.sellMultiplier,
            numberOfAnimals: this.numberOfAnimals,
            blackAndWhiteUpgrade: this.blackAndWhiteUpgrade,
            braidedUpgrade: this.braidedUpgrade,
            _3DUpgrade: this._3DUpgrade,
            neonUpgrade: this.neonUpgrade,
            sellValueUpgrade: this.sellValueUpgrade,
            currentPackUpgrade: this.currentPackUpgrade
        };
        localStorage.setItem("gameProgress", JSON.stringify(progress));
    }

    loadProgress() {
        const savedProgress = localStorage.getItem("gameProgress");
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            this.gold = progress.gold || 0;
            this.zoo = new Set(progress.zoo || []);
            this.blackAndWhiteChance = progress.blackAndWhiteChance || 0;
            this.braidedChance = progress.braidedChance || 0;
            this._3DChance = progress._3DChance || 0;
            this.neonChance = progress.neonChance || 0;
            this.sellMultiplier = progress.sellMultiplier || 1;
            this.numberOfAnimals = progress.numberOfAnimals || 4;
            this.blackAndWhiteUpgrade = progress.blackAndWhiteUpgrade || 1;
            this.braidedUpgrade = progress.braidedUpgrade || 1;
            this._3DUpgrade = progress._3DUpgrade || 1;
            this.neonUpgrade = progress.neonUpgrade || 1;
            this.currentPackUpgrade = progress.currentPackUpgrade || 1;
            this.sellValueUpgrade = progress.sellValueUpgrade || 1;
            this.state = GameState.IDLE;
        } else {
            this.gold = 0;
            this.zoo = new Set();
            this.blackAndWhiteChance = 0;
            this.braidedChance = 0;
            this._3DChance = 0;
            this.neonChance = 0;
            this.sellMultiplier = 1;
            this.numberOfAnimals = 4;
            this.blackAndWhiteUpgrade = 1;
            this.braidedUpgrade = 1;
            this._3DUpgrade = 1;
            this.neonUpgrade = 1;
            this.currentPackUpgrade = 1;
            this.sellValueUpgrade = 1;
            this.state = GameState.IDLE;

            this.createPack();
        }

        this.maxBlackAndWhite = 0.3;
        this.maxBraided = 0.25;
        this.max3d = 0.2;
        this.maxNeon = 0.1;
    }

    isInitialized() {
        return this.animalsInitialized && this.chancesInitialized;
    }

    getChances() {
        return this.chancesData[this.currentPackUpgrade];
    }

    createPack() {
        this.state = GameState.PACK_OPENING;
        this.pack = new Pack(4, vec2(0, 0), 0.2);
        this.pack.onClick = () => {
            soundManager.playTearSound();
            this.pack.openPack();
            this.state = GameState.PACK_OPENING_ANIMATION;
        };
    }

    update() {
        this.saveProgress();

        if (this.state === GameState.PACK_OPENING_ANIMATION) {
            this.pack.update();
            if (this.pack.isOpened) {
                this.state = GameState.PACK_OPENED;
                this.createAnimals();
                GUI.getInstance().showAllAnimalButtons();
            }
        } else if (this.state === GameState.PACK_OPENED) {
            this.state = GameState.ANIMALS_CREATED;
        } else if (this.state === GameState.ANIMALS_CREATED) {
            if (mouseWasPressed(2)) {
                this.deselectAnimal();
            } else if (mouseWasPressed(0)) {
                this.checkAnimalSelection();
            }
        }
    }

    checkAnimalSelection() {
        for (const animal of this.animals) {
            if (isMouseOver(animal)) {
                if (this.selectedAnimal) {
                    this.selectedAnimal.deselect();
                }
                this.selectedAnimal = animal;
                this.selectedAnimal.select();
                GUI.getInstance().showSingularAnimalButtons();
                break;
            }
        }
    }

    deselectAnimal() {
        if (this.selectedAnimal) {
            this.selectedAnimal.deselect();
            this.selectedAnimal = null;
            GUI.getInstance().hideSingularAnimalButtons();
        }
    }

    createAnimals() {
        const sampler = new PoissonDiskSampler(-9, 9, -6, 6, this.numberOfAnimals, 4);
        const points = sampler.generatePoints();
        for (let i = 0; i < points.length; i++) {
            const pos = points[i];
            const animalName = AnimalManager.getInstance().getRandomAnimalName();
            const animalType = AnimalManager.getInstance().getRandomAnimalType();
            const isNew = !this.zoo.has(animalType + ":" + animalName);
            const animal = AnimalManager.getInstance().createAnimal(animalType, pos, animalName, isNew);
            this.animals.push(animal);
        }
    }

    deselectAnimal() {
        if(this.selectedAnimal)
        {
            this.selectedAnimal.deselect();
            this.selectedAnimal = null;
            GUI.getInstance().hideSingularAnimalButtons();
        }
    }

    getAllAnimals() {
        let value = 0;
        for(const animal of this.animals)
        {
            value += this.getSellValue(animal);
        }
        return value;
    }

    getKeepAndSellValue() {
        let value = 0;
        let calculatedAnimals = new Set();
        for(const animal of this.animals)
        {
            let key = animal.type + ":" + animal.name;
            if(this.zoo.has(key))
            {
                value += this.getSellValue(animal);
                calculatedAnimals.add(key)
            } else {
                if(calculatedAnimals.has(key))
                {
                    value += this.getSellValue(animal);
                }
                calculatedAnimals.add(key);
            }
        }
        return value;
    }

    sellAllAnimals() {
        for(const animal of this.animals)
        {
            soundManager.playSellSound();
            this.addGold(this.getSellValue(animal));
            animal.destroy();
        }

        this.selectedAnimal = null;
        this.animals = [];
        this.state = GameState.IDLE;
        GUI.getInstance().hideAllAnimalButtons();
        GUI.getInstance().hideSingularAnimalButtons();
    }

    keepAllAnimals() {
        for(const animal of this.animals)
        {
            soundManager.playKeepSound();
            this.zoo.add(animal.type + ":" + animal.name);
            animal.destroy();
        }

        this.selectedAnimal = null;
        this.animals = [];
        this.state = GameState.IDLE;
        GUI.getInstance().hideAllAnimalButtons();
        GUI.getInstance().hideSingularAnimalButtons();
    }

    keepUnownedSellRest() {
        for(const animal of this.animals)
        {
            if(!this.zoo.has(animal.type + ":" + animal.name))
            {
                soundManager.playKeepSound();
                this.zoo.add(animal.type + ":" + animal.name);
                animal.destroy();
            }
            else
            {
                soundManager.playSellSound();
                this.addGold(this.getSellValue(animal));
                animal.destroy();
            }
        }

        this.selectedAnimal = null;
        this.animals = [];
        this.state = GameState.IDLE;
        GUI.getInstance().hideAllAnimalButtons();
        GUI.getInstance().hideSingularAnimalButtons();
    }

    sellAnimal() {
        if(this.selectedAnimal)
        {
            soundManager.playSellSound();
            this.addGold(this.getSellValue(this.selectedAnimal));
            this.selectedAnimal.destroy();
            this.animals.splice(this.animals.indexOf(this.selectedAnimal), 1);
            this.selectedAnimal = null;
            GUI.getInstance().hideSingularAnimalButtons();
        }

        this.checkIfIdle();
    }

    getSellValue(animal) {
        let baseCost = 0;
        switch(animal.type) {
            case AnimalType.BLACK_AND_WHITE:
                baseCost = animal.cost + this.blackAndWhiteAdditionalCost;
                break;
            case AnimalType.BRAIDED:
                baseCost = animal.cost + this.braidedAdditionalCost;
                break;
            case AnimalType._3D:
                baseCost = animal.cost + this._3DAdditionalCost;
                break;
            case AnimalType.NEON:
                baseCost = animal.cost + this.neonAdditionalCost;
                break;
            default:
                baseCost = animal.cost;
                break;
        }
        return Math.floor(baseCost * this.sellMultiplier);
    }

    keepAnimal() {
        if(this.selectedAnimal)
        {
            soundManager.playKeepSound();
            this.zoo.add(this.selectedAnimal.type + ":" + this.selectedAnimal.name);
            this.selectedAnimal.destroy();
            this.animals.splice(this.animals.indexOf(this.selectedAnimal), 1);
            this.selectedAnimal = null;
            GUI.getInstance().hideSingularAnimalButtons();
        }

        this.checkIfIdle();
    }

    upgradeBlackAndWhite() {
        this.blackAndWhiteChance += 0.02;
        this.blackAndWhiteChance = Math.min(this.blackAndWhiteChance, this.maxBlackAndWhite);
        this.blackAndWhiteUpgrade++;
    }

    upgradeBraided() {
        this.braidedChance += 0.0125;
        this.braidedChance = Math.min(this.braidedChance, this.maxBraided);
        this.braidedUpgrade++;
    }

    upgrade3D() {
        this._3DChance += 0.01;
        this._3DChance = Math.min(this._3DChance, this.max3d);
        this._3DUpgrade++;
    }

    upgradeNeon() {
        this.neonChance += 0.005;
        this.neonChance = Math.min(this.neonChance, this.maxNeon);
        this.neonUpgrade++;
    }

    upgradeSellValue() {
        this.sellMultiplier += 0.2;
        this.sellValueUpgrade++;
    }

    checkIfIdle() {
        if(this.animals.length === 0)
        {
            this.state = GameState.IDLE;
        }
    }
    
    addGold(amount) {
        this.gold += amount;
    }

    removeGold(amount) {
        this.gold -= amount;
    }

    getGold() {
        return this.gold;
    }

    setGold(amount) {
        this.gold = amount;
    }

    hasEnoughGold(amount) {
        return this.gold >= amount;
    }
}