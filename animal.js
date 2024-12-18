'use strict';

const AnimalType = {
  NORMAL: 0,
  BLACK_AND_WHITE: 1,
  BRAIDED: 2,
  _3D: 3,
  NEON: 4
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
    this.animalsData = animalsData;

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
    let braidedChance = GameManager.getInstance().braidedChance;
    let _3DChance = GameManager.getInstance()._3DChance;
    let neonChance = GameManager.getInstance().neonChance;

    if (random < blackAndWhiteChance) {
      return AnimalType.BLACK_AND_WHITE;
    }
    random -= blackAndWhiteChance;
    if (random < braidedChance) {
      return AnimalType.BRAIDED;
    }
    random -= braidedChance;
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
      case AnimalType.BRAIDED:
        return 15;
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

  static DEFAULT_SCALE = vec2(3.5);
  static NEW_SIZE = vec2(4);

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

    this.rarityText = RarityTextFactory.createRarityText(rarity);
    if(this.rarityText != null) {
      this.addChild(this.rarityText, vec2(0, -2));
      this.rarityText.renderOrder = 5;
    }

    this.emitter = RarityParticleEmitterFactory.createRarityEmitter(rarity);
    if(this.emitter != null) {
      this.addChild(this.emitter, vec2(0, -2.5));
      this.emitter.emitRate = GameManager.getInstance().particlesEnabled ? 6 : 0;
    }

    this.border = new EngineObject(pos, vec2(6.2, 5), tile(0, vec2(2001, 1183), 9), 0);
    this.border.size = vec2(0);
    this.addChild(this.border);
    this.border.localAngle = 1.5;

    if(isNew) {
      this.newText = new EngineObject(pos, vec2(3, 2), tile(0, vec2(249,142), 2), 0);
      this.newText.renderOrder = 6;
      this.addChild(this.newText, vec2(0, 2.3));

      this.border.renderOrder = 4;

      this.renderOrder = 3
      this.desiredSize = Animal.NEW_SIZE;
      this.hoverSize = Animal.NEW_SIZE.add(vec2(1));
    } else {
      this.desiredSize = Animal.DEFAULT_SCALE;
      this.hoverSize = Animal.DEFAULT_SCALE.add(vec2(1));
    }

    this.selected = false;
  }

  update() {
    super.update();

    if(this.startAnimation) {
      this.size = this.size.lerp(this.desiredSize, 0.1);
      if(this.size.distance(this.desiredSize) < 0.1) {
        this.startAnimation = false;
      }
    }

    if(isMouseOver(this))
    {
      this.size = this.size.lerp(this.hoverSize, 0.1);
    }
    else
    {
      this.size = this.size.lerp(this.desiredSize, 0.1);
    }

    const targetAngle = this.direction === 1 ? this.endAngle : this.startAngle;
    this.angle = lerpAngle(this.damping, this.angle, targetAngle);

    if (Math.abs(this.angle - targetAngle) < 0.01) {
      this.direction *= -1;
    }
  }

  select() {
    this.selected = true;
    this.border.size = vec2(6.2, 5);
    soundManager.playSelectSound();
  }

  deselect() {
    this.selected = false;
    this.border.size = vec2(0);
  }
}