class GroundSlamParticle extends Ability {
    static TEXTURE = USERNAME ? PIXI.Texture.from('assets/groundslam/slam-particle-1.png') : null;

    static SIZE = 200;

    constructor(parentUsername, time, position, angle) {
        super(parentUsername);

        this._delay = Math.random() * 200;

        this._startTime = time;
        this._position = [position[0], position[1]];
        this._angle = angle;

        this._velocity = 20 + Math.random() * 20;

        this._position[0] += Math.cos(angle) * GroundSlamParticle.SIZE * 2;
        this._position[1] += Math.sin(angle) * GroundSlamParticle.SIZE;

        this._hit = false;

        this._sprite = new PIXI.Sprite(GroundSlamParticle.TEXTURE);
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 0.5;
        this._sprite.animationSpeed = 0.1;
        this._sprite.position.x = this._position[0];
        this._sprite.position.y = this._position[1];
        this._sprite.zIndex = this._sprite.position.y;
        this._sprite.rotation = angle - Math.PI / 2;
        this._sprite.alpha = 0.6;
        this._sprite.blendMode = PIXI.BLEND_MODES.NORMAL;
        Renderer._container.addChild(this._sprite);
    }

    update(time) {
        this._position[0] += Math.cos(this._angle) * this._velocity;
        this._position[1] += Math.sin(this._angle) * this._velocity;

        this._velocity *= 0.96;

        const aabb = [this._position, this._position];
        const polygons = LevelManager.queryPolygons(aabb);
        for (let i = 0; i < polygons.length; i++) {
            if (PolygonMath.isPointInPolygon2D(this._position, polygons[i])) {
                this._hit = true;
                return;
            }
        }

        // n2 lets gooooooo
        if (Connection.isEddie()) {
            const aabb = [[this._position[0] - 80, this._position[1] - 80], [this._position[0] + 80, this._position[1] + 80]];
            const moonrats = Object.values(Connection._players).filter(entity => entity instanceof Moonrat);
            for (let i = 0; i < moonrats.length; i++) {
                const moonratAABB = moonrats[i].getAABB(moonrats[i].getPosition(time - 500));

                if (PolygonMath.overlapAABB(aabb, moonratAABB) && time - moonrats[i]._groundSlamTime > 2000) {
                    moonrats[i]._groundSlamTime = time;

                    const knockbackEffect = new GroundSlamKnockbackEffect(this._parentUsername, TwitchInformation.NAME_TO_ID_MAP[moonrats[i]._username], this._angle);
                    AbilityManager.addAbility(knockbackEffect);

                    AudioSystem.playPainSound(moonrats[i]._position, moonrats[i]._currentMoonratType);
                    moonrats[i]._lastPainTime = time;
                }
            }
        }

        this._sprite.position.x = this._position[0];
        this._sprite.position.y = this._position[1];
        this._sprite.zIndex = this._sprite.position.y;
    }

    isActive(time) {
        return time - this._startTime - this._delay <= 600 && !this._hit;
    }

    shouldSlow(time) {
        return false;
    }
}