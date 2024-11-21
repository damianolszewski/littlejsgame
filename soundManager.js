class SoundManager {
    constructor() {
        this.sounds = [];

        this.tearSound = new SoundWave("sounds/tear.mp3");

        this.sellSound = new SoundWave("sounds/sell.mp3");
        this.keepSound = new SoundWave("sounds/keep.mp3");

        this.popSound = new SoundWave("sounds/pop.wav");
        this.upgradeSound = new SoundWave("sounds/upgrade.ogg");
        this.selectSound = new SoundWave("sounds/select.ogg");

        this.uncommonRaritySound = new SoundWave("sounds/rarity/uncommon.wav");
        this.rareRaritySound = new SoundWave("sounds/rarity/rare.wav");
        this.epicRaritySound = new SoundWave("sounds/rarity/epic.wav");
        this.legendaryRaritySound = new SoundWave("sounds/rarity/legendary.wav");
    }

    playTearSound() {
        this.tearSound.play();
    }

    playUncommonRaritySound() {
        this.uncommonRaritySound.play();
    }

    playRareRaritySound() {
        this.rareRaritySound.play();
    }

    playEpicRaritySound() {
        this.epicRaritySound.play();
    }

    playLegendaryRaritySound() {
        this.legendaryRaritySound.play();
    }

    playSellSound() {
        this.sellSound.play();
    }

    playKeepSound() {
        this.keepSound.play();
    }

    playPopSound() {
        this.popSound.play();
    }

    playUpgradeSound() {
        this.upgradeSound.play();
    }

    playSelectSound() {
        this.selectSound.play();
    }
}