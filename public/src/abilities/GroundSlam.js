class GroundSlam extends Ability {
    static AUDIO = USERNAME ? new Howl({src: ['assets/audio/ground-slam.mp3'], volume: 0.5}) : null;

    static _lastTime = 0;
    static COOLDOWN = 12000;

    constructor(parentUsername, time, position) {
        super(parentUsername);

        this._startTime = time;
        this._position = [position[0], position[1]];

        GroundSlam.AUDIO.play();

        for (let i = 0; i < 64; i++) {
            const angle = i / 64 * Math.PI * 2;

            setTimeout(() => {
                const groundSlamParticle = new GroundSlamParticle(this._parentUsername, time, position, angle);
                AbilityManager.addAbility(groundSlamParticle);
            }, Math.random() * 200);
        }

        if (this._parentUsername === USERNAME) {
            if (this.getParent()) {
                this.getParent()._packetAppendString += this.getPacket();
            }
        }
    }

    update(time) {

    }

    isActive(time) {
        return false;
    }

    shouldSlow(time) {
        return false;
    }

    getPacket() {
        return String.fromCharCode(Entity.PACKET_TYPE_GROUND_SLAM) +
            Entity.getStringFromFloat(this._position[0]) +
            Entity.getStringFromFloat(this._position[1]);
    }
}