'use strict';

const AnimalType = {
  NORMAL: 0,
  BLACK_AND_WHITE: 1,
  _3D: 2,
  NEON: 3
}

class AnimalManager {
  static instance = null;
  static getInstance() {
      if(AnimalManager.instance == null) {
        AnimalManager.instance = new AnimalManager();
      }
      return AnimalManager.instance;
  }

  initialize(animalsData) {
    this.animalsData = animalsData; // dict where animal name is key, has rarity property

    this.animalsPerRarity = {}
    for (let key in this.animalsData) {
      let rarity = GUI.getIndexForRarity(this.animalsData[key].rarity);
      if (this.animalsPerRarity[rarity] === undefined) {
        this.animalsPerRarity[rarity] = [];
      }
      this.animalsPerRarity[rarity].push({name: key, chance: this.animalsData[key].chance});
    }
  }

  getRandomAnimalName() {
    let chances = GameManager.getInstance().getChances();
    let randomGenerator = new RandomGenerator(Math.random() * 1000);
    let random = randomGenerator.float(0, 1);
    let randomRarity = 0;
    for (let rarity in this.animalsPerRarity) {
      if (random < chances[rarity]) {
        randomRarity = rarity;
        break;
      }
      random -= chances[rarity];
    }

    let currentAnimals = this.animalsPerRarity[randomRarity];
    return currentAnimals[Math.floor(Math.random() * currentAnimals.length)].name;
  }

  getRandomAnimalType() {
    let randomGenerator = new RandomGenerator(Math.random() * 1000);
    let random = randomGenerator.float(0, 1);
    let blackAndWhiteChance = GameManager.getInstance().blackAndWhiteChance
    let _3DChance = GameManager.getInstance()._3DChance;
    let neonChance = GameManager.getInstance().neonChance;

    if (random < blackAndWhiteChance) {
      return AnimalType.BLACK_AND_WHITE;
    }
    random -= blackAndWhiteChance;
    if (random < _3DChance) {
      return AnimalType._3D;
    }
    random -= _3DChance;
    if (random < neonChance) {
      return AnimalType.NEON;
    }
    return AnimalType.NORMAL;
  }

  createAnimal(type, pos, animalName, isNew = true) {
    //angle between -30 and 30 degrees
    let randomGenerator = new RandomGenerator(Math.random() * 1000);
    return new Animal(
      type,
      pos, 
      randomGenerator.float(-0.3, 0.3), 
      this.animalsData[animalName].index, 
      this.animalsData[animalName].rarity,
      animalName,
      this.animalsData[animalName].cost,
      isNew
    );
  }

  static getSpriteForType(type) {
    switch(type) {
      case AnimalType.BLACK_AND_WHITE:
        return 12;
      case AnimalType._3D:
        return 13;
      case AnimalType.NEON:
        return 14;
      default:
        return 0;
    }
  }
}

class Animal extends Interactable {

  static DEFAULT_SCALE = vec2(4);

  constructor(type, pos, angle, spriteIndex, rarity, name, cost, isNew = true) {
    super(pos, Animal.DEFAULT_SCALE, tile(spriteIndex, vec2(200, 200), AnimalManager.getSpriteForType(type)), angle);
    let randomGenerator = new RandomGenerator(Math.random() * 1000);

    this.type = type;
    this.name = name;
    this.rarity = rarity;
    this.cost = cost;

    this.startAngle = angle - randomGenerator.float(0.3, 0.2);
    this.endAngle = angle + randomGenerator.float(0.3, 0.2);
    this.direction = 1;
    this.damping = randomGenerator.float(0.98, 0.99)

    this.size = vec2(0);
    this.startAnimation = true;

    if(isNew) {
      this.newText = new EngineObject(pos, vec2(3, 2), tile(0, vec2(249,142), 2), 0);
      //this.text.color = new Color(0.9, 0.6, 0.1, 1);
      this.addChild(this.newText, vec2(0, 2.6));
    }

    this.rarityText = RarityTextFactory.createRarityText(rarity);
    if(this.rarityText != null) {
      this.addChild(this.rarityText, vec2(0, -2.5));
    }

    this.emitter = RarityParticleEmitterFactory.createRarityEmitter(rarity);
    if(this.emitter != null) {
      this.addChild(this.emitter, vec2(0, -2.5));
    }

    this.border = new EngineObject(pos, vec2(7.5, 5.5), tile(0, vec2(2001, 1183), 9), 0);
    this.border.size = vec2(0);
    this.addChild(this.border);
    this.border.localAngle = 1.5;

    this.selected = false;
  }

  update() {
    super.update();

    if(this.startAnimation) {
      this.size = this.size.lerp(Animal.DEFAULT_SCALE, 0.1);
      if(this.size.distance(Animal.DEFAULT_SCALE) < 0.1) {
        this.startAnimation = false;
      }
    }

    if(isMouseOver(this))
    {
      this.size = this.size.lerp(vec2(5), 0.1);
    }
    else
    {
      this.size = this.size.lerp(Animal.DEFAULT_SCALE, 0.1);
    }

    const targetAngle = this.direction === 1 ? this.endAngle : this.startAngle;
    this.angle = lerpAngle(this.damping, this.angle, targetAngle);

    if (Math.abs(this.angle - targetAngle) < 0.01) {
      // Reverse direction when target is reached
      this.direction *= -1;
    }
  }

  select() {
    this.selected = true;
    this.border.size = vec2(7.5, 5.5);
    soundManager.playSelectSound();
  }

  deselect() {
    this.selected = false;
    this.border.size = vec2(0);
  }
}