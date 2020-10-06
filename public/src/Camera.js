class Camera {
    static _currentPosition = [0, 0];

    static _currentDensity = 0.5;

    static _forceUntilTime = 0;
    static _forcePosition = null;
    static _forceDensity = null;

    static update(time) {
        if (time < Camera._forceUntilTime) {
            Camera._setDensity(Camera._forceDensity);
            Camera._setPosition(Camera._forcePosition[0], Camera._forcePosition[1]);
            return;
        }

        if (Connection.getClientPlayer()) {
            const position = Connection.getClientPlayer().getPosition(time);
            Camera._setPosition(position[0], position[1] - (Connection.isEddie() ? 200 : 0));
        }

        Camera._setDensity(window.innerHeight / 1080 * (Connection.isEddie() ? 0.6 : 0.8));
    }

    static getMousePosition() {
        const delta = [InputManager._mousePosition[0] - window.innerWidth / 2, InputManager._mousePosition[1] - window.innerHeight / 2];
        delta[0] /= Camera._currentDensity;
        delta[1] /= Camera._currentDensity;

        return [Camera._currentPosition[0] + delta[0], Camera._currentPosition[1] + delta[1]];
    }

    static force(time, position, density) {
        Camera._forceUntilTime = time;
        Camera._forcePosition = position;
        Camera._forceDensity = density;
    }

    static getAABB() {
        const dimension = [window.innerWidth / Camera._currentDensity, window.innerHeight / Camera._currentDensity];

        return [
            [Camera._currentPosition[0] - dimension[0] / 2, Camera._currentPosition[1] - dimension[1] / 2],
            [Camera._currentPosition[0] + dimension[0] / 2, Camera._currentPosition[1] + dimension[1] / 2],
        ];
    }

    static _setPosition(x, y) {
        const dx = x - Camera._currentPosition[0];
        const dy = y - Camera._currentPosition[1];
        const d =  Math.sqrt(dx * dx + dy * dy);

        if (d <= 20) {
            Camera._currentPosition[0] = x;
            Camera._currentPosition[1] = y;
        } else {
            Camera._currentPosition[0] += dx / d * 20;
            Camera._currentPosition[1] += dy / d * 20;
        }

        Renderer._application.stage.position.x = -Camera._currentPosition[0] * Camera._currentDensity + window.innerWidth / 2;
        Renderer._application.stage.position.y = -Camera._currentPosition[1] * Camera._currentDensity + window.innerHeight / 2;

        Renderer._static.position.x = Camera._currentPosition[0] - window.innerWidth / 2 / Camera._currentDensity;
        Renderer._static.position.y = Camera._currentPosition[1] - window.innerHeight / 2 / Camera._currentDensity;

        Renderer._staticBackground.position.x = Camera._currentPosition[0] - window.innerWidth / 2 / Camera._currentDensity;
        Renderer._staticBackground.position.y = Camera._currentPosition[1] - window.innerHeight / 2 / Camera._currentDensity;
        Renderer._tilingSprite.tilePosition.x = -Renderer._staticBackground.position.x * Camera._currentDensity;
        Renderer._tilingSprite.tilePosition.y = -Renderer._staticBackground.position.y * Camera._currentDensity;
    }

    static _setDensity(density) {
        if (Math.abs(Camera._currentDensity - density) <= 0.005) {
            Camera._currentDensity = density;
        } else {
            Camera._currentDensity += Math.sign(density - Camera._currentDensity) * 0.001;
        }

        Renderer._application.stage.scale.x = Camera._currentDensity;
        Renderer._application.stage.scale.y = Camera._currentDensity;
        Renderer._static.scale.x = 1 / Camera._currentDensity;
        Renderer._static.scale.y = 1 / Camera._currentDensity;
        Renderer._staticBackground.scale.x = 1 / Camera._currentDensity;
        Renderer._staticBackground.scale.y = 1 / Camera._currentDensity;
        Renderer._tilingSprite.tileScale.x = 1 / Renderer._staticBackground.scale.x;
        Renderer._tilingSprite.tileScale.y = 1 / Renderer._staticBackground.scale.y;
    }
}