class LevelManager {
    static _polygons = [];
    static _aabbs = [];

    static _innerPolygons = [];
    static _innerPolygonAABBs = [];

    static _outerPolygons = [];
    static _outerPolygonAABBs = [];

    static _drawingPolygons = [];

    static _graphics = new PIXI.Graphics();

    static GRID_SIZE = 512;
    static _levelSpriteGrid = {};
    static _currentlyVisibleSprites = [];

    static updateRender(time) {
        const cameraAABB = Camera.getAABB();

        const startIndexX = Math.floor(cameraAABB[0][0] / LevelManager.GRID_SIZE);
        const endIndexX = Math.floor(cameraAABB[1][0] / LevelManager.GRID_SIZE);
        const startIndexY = Math.floor(cameraAABB[0][1] / LevelManager.GRID_SIZE);
        const endIndexY = Math.floor(cameraAABB[1][1] / LevelManager.GRID_SIZE);

        for (let i = 0; i < LevelManager._currentlyVisibleSprites.length; i++) {
            LevelManager._currentlyVisibleSprites[i].visible = false;
        }
        LevelManager._currentlyVisibleSprites = [];

        for (let indexX = startIndexX; indexX <= endIndexX; indexX++) {
            for (let indexY = startIndexY; indexY <= endIndexY; indexY++) {
                const sprites = (LevelManager._levelSpriteGrid[indexX] || {})[indexY] || [];

                for (let i = 0; i < sprites.length; i++) {
                    LevelManager._currentlyVisibleSprites.push(sprites[i]);
                    sprites[i].visible = true;
                }
            }
        }
    }

    static getMoonratSpawn() {
        let length = 0;
        for (let i = 0; i < LevelManager._drawingPolygons.length; i++) {
            const polygon = LevelManager._drawingPolygons[i];

            for (let a = 0; a < polygon.length; a++) {
                const point = polygon[a];
                const nextPoint = polygon[(a + 1) % polygon.length];

                const dx = nextPoint[0] - point[0];
                const dy = nextPoint[1] - point[1];
                const d = Math.sqrt(dx * dx + dy * dy);

                length += d;
            }
        }

        const chosenLength = Math.random() * length;
        let currentLength = 0;
        for (let i = 0; i < LevelManager._drawingPolygons.length; i++) {
            const polygon = LevelManager._drawingPolygons[i];

            for (let a = 0; a < polygon.length; a++) {
                const point = polygon[a];
                const nextPoint = polygon[(a + 1) % polygon.length];

                const dx = nextPoint[0] - point[0];
                const dy = nextPoint[1] - point[1];
                const d = Math.sqrt(dx * dx + dy * dy);

                if (chosenLength <= currentLength + d) {
                    const percent = (chosenLength - currentLength) / d;

                    console.log('returning valid point ', percent, point, length, chosenLength, currentLength, d, a);
                    return [point[0] + dx * percent, point[1] + dy * percent];
                }

                currentLength += d;
            }
        }

        console.log('returning 0,0');
        return [0, 0];
    }

    static initialize() {
        LEVEL.layers.forEach(layer => {
            LevelManager.processLayer(layer, 0, 0, null);
        });

        for (let i = 0; i < LevelManager._polygons.length; i++) {
            const polygon = LevelManager._polygons[i];

            const min = [Number.MAX_VALUE, Number.MAX_VALUE];
            const max = [-Number.MAX_VALUE, -Number.MAX_VALUE];

            polygon.forEach(point => {
                min[0] = Math.min(min[0], point[0]);
                min[1] = Math.min(min[1], point[1]);
                max[0] = Math.max(max[0], point[0]);
                max[1] = Math.max(max[1], point[1]);
            });

            LevelManager._aabbs[i] = [min, max];
        }

        for (let i = 0; i < LevelManager._innerPolygons.length; i++) {
            const polygon = LevelManager._innerPolygons[i];

            const min = [Number.MAX_VALUE, Number.MAX_VALUE];
            const max = [-Number.MAX_VALUE, -Number.MAX_VALUE];

            polygon.forEach(point => {
                min[0] = Math.min(min[0], point[0]);
                min[1] = Math.min(min[1], point[1]);
                max[0] = Math.max(max[0], point[0]);
                max[1] = Math.max(max[1], point[1]);
            });

            LevelManager._innerPolygonAABBs[i] = [min, max];
        }

        for (let i = 0; i < LevelManager._outerPolygons.length; i++) {
            const polygon = LevelManager._outerPolygons[i];

            const min = [Number.MAX_VALUE, Number.MAX_VALUE];
            const max = [-Number.MAX_VALUE, -Number.MAX_VALUE];

            polygon.forEach(point => {
                min[0] = Math.min(min[0], point[0]);
                min[1] = Math.min(min[1], point[1]);
                max[0] = Math.max(max[0], point[0]);
                max[1] = Math.max(max[1], point[1]);
            });

            LevelManager._outerPolygonAABBs[i] = [min, max];
        }

        for (let i = 0; i < LevelManager._drawingPolygons.length; i++) {
            const polygon = LevelManager._drawingPolygons[i];

            LevelManager._graphics.lineStyle(48);
            LevelManager._graphics.moveTo(polygon[0][0], polygon[0][1]);

            for (let i = 1; i < polygon.length; i++) {
                LevelManager._graphics.lineTo(polygon[i][0], polygon[i][1]);
            }

            LevelManager._graphics.closePath();
        }

        Renderer._background.addChild(LevelManager._graphics);
    }

    static processLayer(layer, x, y, zIndex) {
        if (zIndex === null) {
            zIndex = ((layer.properties || []).find(property => property.name === 'zIndex') || {}).value || null;
        }

        switch (layer.type) {
            case 'imagelayer': {
                const sprite = PIXI.Sprite.from('level/' + layer.image);
                sprite.visible = false;

                const startX = (layer.x || 0) + (layer.offsetx || 0) + (x || 0);
                const startY = (layer.y || 0) + (layer.offsety || 0) + (y || 0);
                sprite.texture.baseTexture.once('loaded', () => {
                    const width = sprite.width;
                    const height = sprite.height;

                    const startIndexX = Math.floor(startX / LevelManager.GRID_SIZE);
                    const startIndexY = Math.floor(startY / LevelManager.GRID_SIZE);
                    const endIndexX = Math.floor((startX + width) / LevelManager.GRID_SIZE);
                    const endIndexY = Math.floor((startY + height) / LevelManager.GRID_SIZE);

                    for (let indexX = startIndexX; indexX <= endIndexX; indexX++) {
                        for (let indexY = startIndexY; indexY <= endIndexY; indexY++) {
                            const spriteObjectThing = LevelManager._levelSpriteGrid[indexX] || {};
                            LevelManager._levelSpriteGrid[indexX] = spriteObjectThing;
                            const spriteList = spriteObjectThing[indexY] || [];
                            spriteObjectThing[indexY] = spriteList;

                            spriteList.push(sprite);
                        }
                    }
                });

                sprite.position.x = startX;
                sprite.position.y = startY;

                sprite.zIndex = zIndex;

                Renderer._container.addChild(sprite);
            } break;

            case 'objectgroup': {
                layer.objects.forEach(object => {
                    if (object.polygon) {
                        const polygon = [];
                        object.polygon.forEach(point => {
                            polygon.push([
                                point.x + object.x,
                                point.y + object.y,
                            ]);
                        });

                        if (!PolygonMath.isCCW(polygon)) {
                            polygon.reverse();
                        }

                        if (object.type === 'drawing-boundary') {
                            LevelManager._drawingPolygons.push(polygon);
                        } else if (object.type === 'inside-boundary') {
                            LevelManager._innerPolygons.push(polygon);
                        } else if (object.type === 'outside-boundary') {
                            LevelManager._outerPolygons.push(polygon);
                        } else {
                            LevelManager._polygons.push(polygon);
                        }
                    }
                });
            } break;

            case 'group': {
                layer.layers.forEach(newLayer => {
                    LevelManager.processLayer(newLayer, x + (layer.x || 0) + (layer.offsetx || 0), y + (layer.y || 0) + (layer.offsety || 0), zIndex);
                });
            } break;
        }
    }

    static queryPolygons(aabb) {
        const returnPolygons = [];

        for (let i = 0; i < LevelManager._aabbs.length; i++) {
            const polygonAABB = LevelManager._aabbs[i];

            if (PolygonMath.overlapAABB(aabb, polygonAABB)) {
                returnPolygons.push(LevelManager._polygons[i]);
            }
        }

        const blockInside = WaveSystem.getWavePrepPolygon();
        if (blockInside) {
            for (let i = 0; i < LevelManager._innerPolygonAABBs.length; i++) {
                const polygonAABB = LevelManager._innerPolygonAABBs[i];

                if (PolygonMath.overlapAABB(aabb, polygonAABB)) {
                    returnPolygons.push(LevelManager._innerPolygons[i]);
                }
            }
        } else {
            for (let i = 0; i < LevelManager._outerPolygonAABBs.length; i++) {
                const polygonAABB = LevelManager._outerPolygonAABBs[i];

                if (PolygonMath.overlapAABB(aabb, polygonAABB)) {
                    returnPolygons.push(LevelManager._outerPolygons[i]);
                }
            }
        }

        return returnPolygons;
    }
}