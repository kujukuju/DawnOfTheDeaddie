const CLIENT = '5gxwjxw413mhfwi5yl8u0rcx9qjsbv';
const SECRET = '8txfhrebrbnbmjqz1ll9rdlthuq15m';

const onload = () => {
    Renderer.initialize();
    LevelManager.initialize();
    Connection.initialize();
    InputManager.initialize();
    StateManager.initialize();
    AudioSystem.initialize();
    CreepyVision.initialize();
    ShadowVision.initialize();
    ArrowManager.initialize();
    CooldownManager.initialize();

    Loop.initialize();
};

class Loop {
    static _lastUpdateTime = 0;

    static initialize() {
        Loop.update();
        Loop.renderUpdate();
    }

    static update() {
        const startTime = Date.now();

        // skip if used render update
        if (startTime - Loop._lastUpdateTime < 15) {
            setTimeout(() => {
                Loop.update();
            }, Math.max(1, 16 - (startTime - Loop._lastUpdateTime)));

            return;
        }

        Loop._lastUpdateTime = startTime;

        LogicLoop.update(startTime);

        const dt = Date.now() - startTime;

        setTimeout(() => {
            Loop.update();
        }, Math.max(1, 16 - dt));
    }

    static renderUpdate() {
        const startTime = Date.now();

        // in some browsers request anim frame is more reliable as a cpu hog
        if (startTime - Loop._lastUpdateTime > 15) {
            Loop._lastUpdateTime = startTime;
            LogicLoop.update(startTime);
        }

        Renderer.updateRender(startTime);

        window.requestAnimationFrame(() => {
            Loop.renderUpdate();
        });
    }
}