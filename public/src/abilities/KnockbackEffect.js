class KnockbackEffect extends Ability {
    constructor(parentUsername, entityID, angle) {
        super(parentUsername);

        this._entityID = entityID;
        this._angle = angle;

        this._velocity = 20;

        if (this._parentUsername === USERNAME) {
            if (this.getParent()) {
                this.getParent()._packetAppendString += this.getPacket();
            }
        }
    }

    update(time) {
        const affectedMoonrat = Connection._players[TwitchInformation.ID_TO_NAME_MAP[this._entityID]];
        if (!affectedMoonrat) {
            this._velocity = 0;
            return;
        }

        if (this._entityID === TwitchInformation.NAME_TO_ID_MAP[USERNAME]) {
            affectedMoonrat._position[0] += Math.cos(this._angle) * this._velocity;
            affectedMoonrat._position[1] += Math.sin(this._angle) * this._velocity;
        } else if (USERNAME === this._parentUsername) {
            affectedMoonrat.forceOffset(time, Math.cos(this._angle) * this._velocity, Math.sin(this._angle) * this._velocity);
        }

        this._velocity--;
    }

    isActive(time) {
        return this._velocity > 0;
    }

    shouldSlow(time) {
        return false;
    }

    getPacket() {
        return String.fromCharCode(Entity.PACKET_TYPE_KNOCKBACK) +
            String.fromCharCode(this._entityID) +
            Entity.getStringFromFloat(this._angle);
    }
}