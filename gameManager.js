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
        if(GameManager.instance == null) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    constructor() {
        fetch('data/animals.json')
            .then(response => response.json())
            .then(data => {
                console.log('Animal Data Loaded:', data);

                AnimalManager.getInstance().initialize(data.animals);

                this.gold = 2000;
                this.animals = [];
                this.zoo = new Set();
                this.selectedAnimal = null;
                this.numberOfAnimals = 5;
                this.createPack();

                this.animalsInitialized = true;
            })
            .catch(error => console.error('Error loading animal data:', error));

        fetch('data/chances.json')
            .then(response => response.json())
            .then(data => {
                console.log('Chances Data Loaded:', data);

                this.currentPackUpgrade = 1;
                this.chancesData = data;
                GUI.getInstance().upgradePackButton.cost = (this.currentPackUpgrade * 25) + 25;

                this.chancesInitialized = true;
            })
            .catch(error => console.error('Error loading chances data:', error));
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
            console.log('Pack opening animation started');
        }
    }

    update() {
        if(this.state === GameState.PACK_OPENING_ANIMATION) {
            this.pack.update();

            console.log('Waiting for pack opening animation to finish');

            if(this.pack.isOpened) {
                this.state = GameState.PACK_OPENED;
                console.log('Pack opened');
            }
        }
        else if(this.state === GameState.PACK_OPENED)
        {
            console.log('Creating animals');
            this.createAnimals();
            this.state = GameState.ANIMALS_CREATED;

            GUI.getInstance().showAllAnimalButtons();
        } 
        else if(this.state === GameState.ANIMALS_CREATED) 
        {
            if(mouseWasPressed(2)) {
                console.log('Deselecting animal');
                this.deselectAnimal();
            }
            else if(mouseWasPressed(0)) {
                console.log('Checking if animal is selected');
                this.checkAnimalSelection();
            }
        }
    }

    checkAnimalSelection() {
        for(const animal of this.animals)
        {
            if(isMouseOver(animal))
            {
                if(this.selectedAnimal)
                {
                    this.selectedAnimal.deselect();
                }
                this.selectedAnimal = animal;
                this.selectedAnimal.select();

                GUI.getInstance().showSingularAnimalButtons();
                break;
            }
        }
    }

    createAnimals() {
        const radius = 5; // Adjust radius as needed
        for (let i = 0; i < this.numberOfAnimals; i++) {
            const angle = (2 * Math.PI / this.numberOfAnimals) * i; // Evenly spaced angle
            const offsetX = radius * Math.cos(angle);
            const offsetY = radius * Math.sin(angle);
            const pos = vec2(offsetX, offsetY); // Position on the circle

            const animalName = AnimalManager.getInstance().getRandomAnimalName();
            let animal = AnimalManager.getInstance().createAnimal(pos, animalName);
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

    sellAllAnimals() {
        for(const animal of this.animals)
        {
            this.addGold(animal.cost);
            animal.destroy();
        }

        this.animals = [];
        this.state = GameState.IDLE;
        GUI.getInstance().hideAllAnimalButtons();
    }

    keepAllAnimals() {
        for(const animal of this.animals)
        {
            this.zoo.add(animal.name);
            animal.destroy();
        }

        this.animals = [];
        this.state = GameState.IDLE;
        GUI.getInstance().hideAllAnimalButtons();
    }

    sellAnimal() {
        if(this.selectedAnimal)
        {
            soundManager.playSellSound();
            this.addGold(this.selectedAnimal.cost);
            this.selectedAnimal.destroy();
            this.animals.splice(this.animals.indexOf(this.selectedAnimal), 1);
            this.selectedAnimal = null;
            GUI.getInstance().hideSingularAnimalButtons();
        }

        this.checkIfIdle();
    }

    keepAnimal() {
        if(this.selectedAnimal)
        {
            soundManager.playKeepSound();
            this.zoo.add(this.selectedAnimal.name);
            this.selectedAnimal.destroy();
            this.animals.splice(this.animals.indexOf(this.selectedAnimal), 1);
            this.selectedAnimal = null;
            GUI.getInstance().hideSingularAnimalButtons();
        }

        this.checkIfIdle();
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