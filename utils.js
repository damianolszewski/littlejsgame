class RarityParticleEmitterFactory {
    static createRarityEmitter(rarity) {
        switch (rarity) {
            case "common":
                return null;
            case "uncommon":
                return RarityParticleEmitterFactory.createUncommonRarityEmitter();
            case "rare":
                return RarityParticleEmitterFactory.createRareRarityEmitter();
            case "epic":
                return RarityParticleEmitterFactory.createEpicRarityEmitter();
            case "legendary":
                return RarityParticleEmitterFactory.createLegendaryRarityEmitter();
            default:
                //throw error
                console.error("Invalid rarity: " + rarity);
        }
    }

    static createUncommonRarityEmitter() {
        return new ParticleEmitter(vec2(), 0, 1, 0, 3, 1, tile(0, 16, 4), new Color(1, 1, 1, 1), new Color(0.631, 0.631, 0.631, 1), new Color(0.596, 0.992, 0.427, 0), new Color(0.302, 1, 0, 0), 1, 0.1, 0.9, 0.02, 0.15, 0.98, 1, 0, 3.14, 0.2, 0.2, 0, 0, 1);
    }

    static createRareRarityEmitter() {
        return new ParticleEmitter(vec2(), 0, 1, 0, 6, 1, tile(0, 16, 4), new Color(1, 1, 1, 1), new Color(0.631, 0.631, 0.631, 1), new Color(0.302, 0.345, 1, 0), new Color(0, 0.431, 1, 0), 1, 0.1, 1.3, 0.03, 0.15, 0.97, 1, 0, 3.14, 0.2, 0.2, 0, 0, 1);
    }

    static createEpicRarityEmitter() {
        return new ParticleEmitter(vec2(), 0, 1, 0, 12, 1, tile(0, 16, 4), new Color(1, 1, 1, 1), new Color(0.631, 0.631, 0.631, 1), new Color(0.58, 0, 0.62, 0), new Color(0.506, 0, 0.541, 0), 1, 0.1, 1.5, 0.08, 0.15, 0.97, 1, 0, 3.14, 0.2, 0.2, 0, 0, 1);
    }

    static createLegendaryRarityEmitter() {
        return new ParticleEmitter(vec2(), 0, 1.2, 0, 20, 1, tile(0, 16, 4), new Color(0.914, 0.902, 0.647, 1), new Color(0.835, 0.204, 0.204, 1), new Color(1, 0.698, 0.18, 0), new Color(1, 0.847, 0.302, 0), 1.1, 0.1, 1.6, 0.1, 0.15, 0.96, 1, 0, 3.14, 0.2, 0.2, 0, 0, 1);
    }
}

class RarityTextFactory {

    static createRarityText(rarity) {
        switch (rarity) {
            case "common":
                return null;
            case "uncommon":
                return RarityTextFactory.createUncommonRarityText();
            case "rare":
                return RarityTextFactory.createRareRarityText();
            case "epic":
                return RarityTextFactory.createEpicRarityText();
            case "legendary":
                return RarityTextFactory.createLegendaryRarityText();
            default:
                //throw error
                console.error("Invalid rarity: " + rarity);
        }
    }

    static createUncommonRarityText() {
        let rarityText = new EngineObject(vec2(), vec2(3.5, 1.1), tile(0, vec2(587, 138), 5), 0);
        //rarityText.color = new Color(0, 0.9, 0.2, 1);
        rarityText.color = GUI.getColorForRarity("uncommon");
        return rarityText;
    }

    static createRareRarityText() {
        let rarityText = new EngineObject(vec2(), vec2(3, 1), tile(1, vec2(244, 96), 6), 0);
        //rarityText.color = new Color(0.1, 0.2, 0.9, 1);
        rarityText.color = GUI.getColorForRarity("rare");
        return rarityText;
    }

    static createEpicRarityText() {
        let rarityText = new EngineObject(vec2(), vec2(2.6, 1.5), tile(2, vec2(224, 145), 7), 0);
        //rarityText.color = new Color(0.8, 0.1, 0.7, 1);
        rarityText.color = GUI.getColorForRarity("epic");
        return rarityText;
    }

    static createLegendaryRarityText() {
        let rarityText = new EngineObject(vec2(), vec2(4, 1.5), tile(3, vec2(504, 182), 8), 0);
        //rarityText.color = new Color(0.95, 0.5, 0.2, 1);
        rarityText.color = GUI.getColorForRarity("legendary");
        return rarityText;
    }
}

function isMouseOver(element) {
  return isIntersecting(mousePos, mousePos, element.pos, element.size);
}