class Ability {
    constructor(parentUsername) {
        this._parentUsername = parentUsername;

        this._sprite = null;
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
        return '';
    }

    getParent() {
        return Connection._players[this._parentUsername] || null;
    }

    destroy() {
        if (this._sprite) {
            this._sprite.destroy();
            this._sprite = null;
        }
    }
}