class SoundManager {
    constructor() {
        this.sounds = [];
        this.muted = false;
        this.volume = 0.5;

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

    toggleMute() {
        this.muted = !this.muted;
    }

    playTearSound() {
        if(this.muted) return;
        this.tearSound.play(vec2(), this.volume);
    }

    playUncommonRaritySound() {
        if(this.muted) return;
        this.uncommonRaritySound.play(vec2(), this.volume);
    }

    playRareRaritySound() {
        if(this.muted) return;
        this.rareRaritySound.play(vec2(), this.volume);
    }

    playEpicRaritySound() {
        if(this.muted) return;
        this.epicRaritySound.play(vec2(), this.volume);
    }

    playLegendaryRaritySound() {
        if(this.muted) return;
        this.legendaryRaritySound.play(vec2(), this.volume);
    }

    playSellSound() {
        if(this.muted) return;
        this.sellSound.play(vec2(), this.volume);
    }

    playKeepSound() {
        if(this.muted) return;
        this.keepSound.play(vec2(), this.volume);
    }

    playPopSound() {
        if(this.muted) return;
        this.popSound.play(vec2(), this.volume);
    }

    playUpgradeSound() {
        if(this.muted) return;
        this.upgradeSound.play(vec2(), this.volume);
    }

    playSelectSound() {
        if(this.muted) return;
        this.selectSound.play(vec2(), this.volume);
    }
}