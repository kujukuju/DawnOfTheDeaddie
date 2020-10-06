class FogManager {
    static MAX_FOG = 12;

    static FOG_TEXTURE_CHOICES = USERNAME ? [
        PIXI.Texture.from('assets/fog/fog-1.png'),
        PIXI.Texture.from('assets/fog/fog-2.png'),
        PIXI.Texture.from('assets/fog/fog-3.png'),
        PIXI.Texture.from('assets/fog/fog-4.png'),
        PIXI.Texture.from('assets/fog/fog-5.png'),
        PIXI.Texture.from('assets/fog/fog-6.png'),
    ] : null;

    static _activeFogSprites = [];

    static update(time) {
        if (FogManager._activeFogSprites.length < FogManager.MAX_FOG) {
            if (Math.random() < 0.02) {
                FogManager._createFog(Camera.getAABB(time));
            }
        }

        for (let i = 0; i < FogManager._activeFogSprites.length; i++) {
            const fogSprite = FogManager._activeFogSprites[i];
            fogSprite.position.x += fogSprite._velX;

            if (time > fogSprite._expireTime) {
                fogSprite.alpha = Math.max(0, fogSprite.alpha - 0.01);
            } else {
                fogSprite.alpha = Math.min(1, fogSprite.alpha + 0.01);
            }

            if (fogSprite.alpha <= 0) {
                fogSprite.alpha = 0;
                fogSprite.destroy();
                FogManager._activeFogSprites.splice(i, 1);
                i--;
            }
        }
    }

    static _createFog(aabb) {
        const texture = FogManager.FOG_TEXTURE_CHOICES[Math.floor(Math.random() * FogManager.FOG_TEXTURE_CHOICES.length)];

        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 1;
        sprite.scale.x = 2;
        sprite.scale.y = 2;
        const tint = 256 - Math.random() * 128;
        sprite.tint = tint << 16 | tint << 8 | tint;
        sprite.alpha = 0;
        sprite.blendMode = PIXI.BLEND_MODES.DIFFERENCE;

        const y = (aabb[1][1] - aabb[0][1] + sprite.height) * Math.random();
        const xSign = (Math.sign(Math.random() - 0.5) || 1);
        // const x = (aabb[1][0] + aabb[0][0]) / 2 + xSign * ((aabb[1][0] - aabb[0][0]) / 2 + sprite.width / 2);
        const x = aabb[0][0] - sprite.width / 2 + (aabb[1][0] - aabb[0][0] + sprite.width) * Math.random();

        sprite.zIndex = y;
        sprite.position.x = x;
        sprite.position.y = y;
        sprite._velX = -xSign * (Math.random() * 3 + 1);
        sprite._expireTime = Date.now() + 5000 + Math.random() * 5000;

        FogManager._activeFogSprites.push(sprite);

        Renderer._container.addChild(sprite);
    }
}