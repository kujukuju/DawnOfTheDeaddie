class ArrowManager {
    static TEXTURE = USERNAME ? PIXI.Texture.from('assets/arrow.png') : null;

    static _sprite = null;

    static initialize() {
        if (Connection.isEddie()) {
            return;
        }

        ArrowManager._sprite = new PIXI.Sprite(ArrowManager.TEXTURE);
        ArrowManager._sprite.anchor.x = 0.5;
        ArrowManager._sprite.anchor.y = 1;

        Renderer._static.addChild(ArrowManager._sprite);
    }

    static update(time) {
        if (!Connection.getEddie() || Connection.isEddie() || !Connection.getClientPlayer()) {
            return;
        }

        const position = Connection.getClientPlayer().getPosition(time);
        const eddiePosition = Connection.getEddie().getPosition(time - 500);

        const dx = eddiePosition[0] - position[0];
        const dy = eddiePosition[1] - position[1];

        if (Math.abs(dx) <= window.innerWidth * 0.75 && Math.abs(dy) <= window.innerHeight * 0.75) {
            ArrowManager._sprite.visible = false;
        } else {
            ArrowManager._sprite.visible = true;
        }

        const angle = Math.atan2(dy, dx);
        const d = 1 / Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle)));
        const x = Math.cos(angle) * d * window.innerWidth / 2 + window.innerWidth / 2;
        const y = Math.sin(angle) * d * window.innerHeight / 2 + window.innerHeight / 2;

        ArrowManager._sprite.position.x = x;
        ArrowManager._sprite.position.y = y;
        ArrowManager._sprite.rotation = angle - Math.PI / 2;
    }
}