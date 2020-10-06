class GroundSpit extends Ability {
    static AUDIO = USERNAME ? new Howl({src: ['assets/audio/spit-landing.mp3'], volume: 1}) : null;
    static DAMAGE = USERNAME ? new Howl({src: ['assets/audio/poison-damage.mp3'], volume: 0.4}) : null;

    static TEXTURES = ['assets/spitattack/puddle-1.png', 'assets/spitattack/puddle-2.png', 'assets/spitattack/puddle-3.png', 'assets/spitattack/puddle-4.png', 'assets/spitattack/puddle-5.png'].map(src => {
        return PIXI.Texture.from(src);
    });

    static SPIT_WIDTH = 480;
    static SPIT_HEIGHT = 180;

    static DAMAGE_PER_TICK = 8;

    constructor(parentUsername, time, position) {
        super(parentUsername);

        this._startTime = time;
        this._position = [position[0], position[1]];

        this._sprite = new PIXI.AnimatedSprite(GroundSpit.TEXTURES, true);
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = -1;
        this._sprite.width = GroundSpit.SPIT_WIDTH;
        this._sprite.height = GroundSpit.SPIT_HEIGHT;
        this._sprite.animationSpeed = 0.1;
        this._sprite.position.x = this._position[0];
        this._sprite.position.y = this._position[1] - GroundSpit.SPIT_HEIGHT * 1.5;
        this._sprite.zIndex = this._sprite.position.y;
        this._sprite.loop = true;
        this._sprite.play();
        Renderer._container.addChild(this._sprite);

        AudioSystem.playSound(GroundSpit.AUDIO, this._position);

        // this one isnt networked because the spit attack is always accurate and creates this
        // if (this._parentUsername === USERNAME) {
        //     if (this.getParent()) {
        //         this.getParent()._packetAppendString += this.getPacket();
        //     }
        // }
    }

    update(time) {
        if (Connection.isEddie() && Connection.getEddie()) {
            const position = Connection.getEddie().getPosition(time);
            const eddieDimensions = [Eddie.AABB[1][0] - Eddie.AABB[0][0], Eddie.AABB[1][1] - Eddie.AABB[0][1]];
            if (MathHelper.overlapOval(position, eddieDimensions, this._position, [GroundSpit.SPIT_WIDTH, GroundSpit.SPIT_HEIGHT])) {
                Connection.getEddie()._inSpit = true;
            }
        }
    }

    isActive(time) {
        return time - this._startTime <= 6000;
    }

    shouldSlow(time) {
        return false;
    }

    // getPacket() {
    //     return String.fromCharCode(Entity.PACKET_TYPE_GROUND_SPIT) +
    //         Entity.getStringFromFloat(this._position[0]) +
    //         Entity.getStringFromFloat(this._position[1]);
    // }
}