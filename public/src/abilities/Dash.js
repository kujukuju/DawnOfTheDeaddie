class Dash extends Ability {
    static AUDIO = USERNAME ? new Howl({src: ['assets/audio/dash.mp3'], volume: 0.5}) : null;

    static _lastTime = 0;
    static COOLDOWN = 4000;

    constructor(parentUsername) {
        super(parentUsername);

        this._angle = null;

        Dash.AUDIO.play();

        if (this.getParent()) {
            const dx = this.getParent()._velocity[0];
            const dy = this.getParent()._velocity[1];

            this._angle = Math.atan2(dy, dx);

            this.getParent()._velocity[0] += Math.cos(this._angle) * 24;
            this.getParent()._velocity[1] += Math.sin(this._angle) * 24;
        }
    }

    update(time) {
        if (this.getParent() && this._angle !== null) {
            this.getParent()._velocity[0] += Math.cos(this._angle) * 12;
            this.getParent()._velocity[1] += Math.sin(this._angle) * 12;
        }
    }

    isActive(time) {
        return time - this._startTime <= 200;
    }

    shouldSlow(time) {
        return false;
    }
}