class Renderer {
    static _application = null;
    static _static = new PIXI.Container();
    static _container = new PIXI.Container();
    static _background = new PIXI.Container();
    static _staticBackground = new PIXI.Container();

    static _tilingSprite = null;

    static updateRender(time) {
        if (Connection.getClientPlayer()) {
            Connection.getClientPlayer().updateRender(time - 16);
        }

        CooldownManager.updateRender(time - 16);

        const entities = Object.values(Connection._players).filter(entity => Connection.getClientPlayer() !== entity);
        for (let i = 0; i < entities.length; i++) {
            entities[i].updateRender(time - 500);
        }

        Camera.update(time - 16);
        LevelManager.updateRender(time - 16);

        const players = Object.values(Connection._players);
        for (let i = 0; i < players.length; i++) {
            if (!players[i]._container) {
                continue;
            }

            players[i]._container.zIndex = players[i]._container.position.y;
        }

        Renderer._container.sortChildren();
    }

    static initialize() {
        Renderer._application = new PIXI.Application({width: window.innerWidth, height: window.innerHeight, antialias: true, resolution: 1});
        document.getElementById('canvas-container').appendChild(Renderer._application.view);

        window.addEventListener('resize', () => {
            Renderer.resize();
        });

        Renderer._tilingSprite = new PIXI.TilingSprite(PIXI.Texture.from('assets/tile.png'), 1024, 1024);
        Renderer._tilingSprite.position.x = 0;
        Renderer._tilingSprite.position.y = 0;
        Renderer._tilingSprite.width = window.innerWidth;
        Renderer._tilingSprite.height = window.innerHeight;
        Renderer._staticBackground.addChild(Renderer._tilingSprite);

        Renderer._application.stage.addChild(Renderer._staticBackground);
        Renderer._application.stage.addChild(Renderer._background);
        Renderer._application.stage.addChild(Renderer._container);
        Renderer._application.stage.addChild(Renderer._static);

        // const bg1 = PIXI.Sprite.from('assets/temp-ground.jpg');
        // bg1.position.x = -1000;
        // bg1.position.y = -1000;
        // bg1.scale.x = 2;
        // bg1.scale.y = 2;
        // Renderer._background.addChild(bg1);
    }

    static resize() {
        Renderer._application.renderer.resize(window.innerWidth, window.innerHeight);
        CreepyVision.resize();
        Renderer._tilingSprite.width = window.innerWidth;
        Renderer._tilingSprite.height = window.innerHeight;
    }
}