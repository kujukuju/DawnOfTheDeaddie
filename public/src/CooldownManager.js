class CooldownManager {
    static TEXTURES = USERNAME ? ['assets/cd/cd-circle-1.png', 'assets/cd/cd-circle-2.png', 'assets/cd/cd-circle-3.png', 'assets/cd/cd-circle-4.png', 'assets/cd/cd-circle-5.png', 'assets/cd/cd-circle-6.png', 'assets/cd/cd-circle-7.png', 'assets/cd/cd-circle-8.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;

    static _container = new PIXI.Container();

    static initialize() {
        Renderer._background.addChild(CooldownManager._container);
    }

    static updateRender(time) {
        if (!Connection.getClientPlayer()) {
            CooldownManager._container.visible = false;

            return;
        }

        CooldownManager._container.visible = true;
        const position = Connection.getClientPlayer().getPosition(time);

        CooldownManager._container.position.x = position[0];
        CooldownManager._container.position.y = position[1];
    }

    static startCD(width, duration, color) {
        const sprite = new PIXI.AnimatedSprite(CooldownManager.TEXTURES, true);
        sprite.animationSpeed = (CooldownManager.TEXTURES.length * (1000 / 60)) / duration;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.scale.x = width / 768;
        sprite.scale.y = width / 768;
        sprite.position.x = 0;
        sprite.position.y = 0;
        sprite.tint = color;
        sprite.loop = false;
        sprite.onComplete = () => {
            sprite.destroy();
        };
        sprite.play();

        CooldownManager._container.addChild(sprite);
    }

    static getWidthByIndex(index) {
        if (index === 0) {
            return 512;
        }

        const scale = 768 / 576 - 0.01;

        return CooldownManager.getWidthByIndex(index - 1) * scale;
    }
}