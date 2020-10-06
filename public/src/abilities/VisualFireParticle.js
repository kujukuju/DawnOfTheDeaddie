class VisualFireParticle extends Ability {
    constructor(parentUsername, time, position) {
        super(parentUsername);

        this._startTime = time;
        this._position = [position[0], position[1]];

        this._velocity = [Math.random() * 8 - 4, -8 - Math.random() * 6];

        this._size = 0.25;

        this._sprite = new PIXI.AnimatedSprite(FireParticle.TEXTURES, true);
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 2.0;
        this._sprite.scale.x = this._size;
        this._sprite.scale.y = this._size;
        this._sprite.animationSpeed = 0.16;
        this._sprite.position.x = this._position[0];
        this._sprite.position.y = this._position[1];
        this._sprite.loop = false;
        this._sprite.onComplete = () => {
            this._sprite.destroy();
            this._sprite = null;
        };
        this._sprite.play();
        this._sprite.blendMode = PIXI.BLEND_MODES.ADD;
        Renderer._container.addChild(this._sprite);
    }

    update(time) {
        this._position[0] += this._velocity[0];
        this._position[1] += this._velocity[1];

        this._velocity[0] *= 0.98;
        this._velocity[1] *= 0.98;

        this._size *= (2 / this._size - 1) * 0.005 + 1;

        this._sprite.position.x = this._position[0];
        this._sprite.position.y = this._position[1];
        this._sprite.scale.x = this._size;
        this._sprite.scale.y = this._size;
    }

    isActive(time) {
        return !!this._sprite;
    }

    shouldSlow(time) {
        return false;
    }
}