'use strict';

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
      let rarity = this.animalsData[key].rarity;
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
    let randomRarity = "common";
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

  createAnimal(pos, animalName) {
    //angle between -30 and 30 degrees
    let randomGenerator = new RandomGenerator(Math.random() * 1000);
    return new Animal(
      pos, 
      randomGenerator.float(-0.3, 0.3), 
      this.animalsData[animalName].index, 
      this.animalsData[animalName].rarity,
      animalName,
      this.animalsData[animalName].cost
    );
  }
}

class Animal extends Interactable {

  static DEFAULT_SCALE = vec2(4);

  constructor(pos, angle, spriteIndex, rarity, name, cost) {
    super(pos, Animal.DEFAULT_SCALE, tile(spriteIndex, vec2(200, 200)), angle);
    let randomGenerator = new RandomGenerator(Math.random() * 1000);

    this.name = name;
    this.rarity = rarity;
    this.cost = cost;

    this.startAngle = angle - randomGenerator.float(0.3, 0.2);
    this.endAngle = angle + randomGenerator.float(0.3, 0.2);
    this.direction = 1;
    this.damping = randomGenerator.float(0.98, 0.99)

    this.size = vec2(0);
    this.startAnimation = true;

    this.text = new EngineObject(pos, vec2(3, 2), tile(0, vec2(249,142), 2), 0);
    //this.text.color = new Color(0.9, 0.6, 0.1, 1);
    this.addChild(this.text, vec2(0, 2.6));

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