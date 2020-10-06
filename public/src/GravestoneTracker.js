class GravestoneTracker {
    static MOONRAT_TEXTURES_BY_TYPE = USERNAME ? [
        [
            PIXI.Texture.from('assets/death/Dietan1.png'),
            PIXI.Texture.from('assets/death/Dietan_.png'),
        ], [
            PIXI.Texture.from('assets/death/Boned.png'),
            PIXI.Texture.from('assets/death/Boned1.png'),
        ], [
            PIXI.Texture.from('assets/death/FeRIP.png'),
            PIXI.Texture.from('assets/death/FeRIP1.png'),
        ],
    ] : null;

    static EDDIE_TEXTURE = USERNAME ? PIXI.Texture.from('assets/death/Deadie_.png') : null;

    static _gravestones = [];

    static addMoonratGravestone(position, moonratType) {
        const texture = GravestoneTracker.MOONRAT_TEXTURES_BY_TYPE[moonratType][Math.floor(Math.random() * GravestoneTracker.MOONRAT_TEXTURES_BY_TYPE[moonratType].length)];

        const grave = new PIXI.Sprite(texture);
        grave.anchor.x = 0.5;
        grave.anchor.y = 0.5;
        grave.scale.x = 0.5;
        grave.scale.y = 0.5;
        grave.scale.x = Math.sign((Math.random() - 0.5) || 1);
        grave.position.x = position[0];
        grave.position.y = position[1];
        grave.zIndex = grave.position.y;
        Renderer._container.addChild(grave);
        GravestoneTracker._gravestones.push(grave);
    }

    static addEddieGravestone(position) {
        const grave = new PIXI.Sprite(GravestoneTracker.EDDIE_TEXTURE);
        grave.anchor.x = 0.5;
        grave.anchor.y = 0.5;
        grave.scale.x = 0.8;
        grave.scale.y = 0.8;
        grave.scale.x = Math.sign((Math.random() - 0.5) || 1);
        grave.position.x = position[0];
        grave.position.y = position[1];
        grave.zIndex = grave.position.y;
        Renderer._container.addChild(grave);
        GravestoneTracker._gravestones.push(grave);
    }
}