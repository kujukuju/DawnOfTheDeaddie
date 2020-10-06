class FireParticle extends Ability {
    static TEXTURES = USERNAME ? ['assets/firebreath/Fire-1.png', 'assets/firebreath/Fire-2.png', 'assets/firebreath/Fire-3.png', 'assets/firebreath/Fire-4.png', 'assets/firebreath/Fire-5.png', 'assets/firebreath/Fire-6.png', 'assets/firebreath/Fire-7.png', 'assets/firebreath/Fire-8.png', 'assets/firebreath/Fire-9.png', 'assets/firebreath/Fire-10.png'].map(src => {
        return PIXI.Texture.from(src);
    }) : null;

    constructor(parentUsername, time, startPosition, nextPosition, angle) {
        super(parentUsername);

        this._startTime = time;
        this._position = [startPosition[0], startPosition[1]];
        this._nextPosition = [nextPosition[0], nextPosition[1]];
        this._angle = angle;

        this._firstStepTicks = 20;
        this._firstStepDelta = [(this._nextPosition[0] - this._position[0]) / this._firstStepTicks, (this._nextPosition[1] - this._position[1]) / this._firstStepTicks];

        this._velocity = 14 + Math.random() * 8;

        this._hit = false;

        this._sprite = new PIXI.AnimatedSprite(FireParticle.TEXTURES, true);
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 0.5;
        this._sprite.scale.x = 1.5;
        this._sprite.scale.y = 1.5;
        this._sprite.animationSpeed = 0.08;
        this._sprite.position.x = this._position[0];
        this._sprite.position.y = this._position[1];
        this._sprite.rotation = angle - Math.PI / 2;
        this._sprite.loop = false;
        this._sprite.play();
        this._sprite.blendMode = PIXI.BLEND_MODES.ADD;

        this._sprite.zIndex = this._position[1];
        if (Math.sin(this._angle) > 0) {
            this._sprite.zIndex = this.getParent() ? (this.getParent()._position[1] + 10) : this._position[1];
        }

        Renderer._container.addChild(this._sprite);
    }

    update(time) {
        if (this._firstStepTicks) {
            this._firstStepTicks--;

            this._position[0] += this._firstStepDelta[0];
            this._position[1] += this._firstStepDelta[1];
        } else {
            this._position[0] += Math.cos(this._angle) * this._velocity;
            this._position[1] += Math.sin(this._angle) * this._velocity;

            this._velocity *= 0.99;

            const aabb = [this._position, this._position];
            const polygons = LevelManager.queryPolygons(aabb);
            for (let i = 0; i < polygons.length; i++) {
                if (PolygonMath.isPointInPolygon2D(this._position, polygons[i])) {
                    this._hit = true;

                    return;
                }
            }

            const biggerAABB = [[this._position[0] - 40, this._position[1] - 40], [this._position[0] + 40, this._position[1] + 40]];
            const moonrats = Object.values(Connection._players).filter(entity => entity instanceof Moonrat);
            for (let i = 0; i < moonrats.length; i++) {
                const moonratAABB = moonrats[i].getAABB(moonrats[i].getPosition(time - 500));

                if (PolygonMath.overlapAABB(biggerAABB, moonratAABB)) {
                    moonrats[i]._burnTime = time;
                }
            }
        }

        this._sprite.position.x = this._position[0];
        this._sprite.position.y = this._position[1];
        if (Math.sin(this._angle) < 0) {
            this._sprite.zIndex = Math.min(this._sprite.zIndex, this._position[1]);
        } else {
            this._sprite.zIndex = Math.max(this._sprite.zIndex, this._position[1]);
        }
    }

    isActive(time) {
        return time - this._startTime <= 2000 && !this._hit;
    }

    shouldSlow(time) {
        return false;
    }
}
