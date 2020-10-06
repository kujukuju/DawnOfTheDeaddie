class ShadowVision {
    static TEXTURE = USERNAME ? PIXI.Texture.from('assets/white.png') : null;

    static _container = new PIXI.Container();
    static _graphics = new PIXI.Graphics();

    static _sprite = null;

    static _filter = null;
    static _filterUniforms = {
        alpha: 1,
    };

    static _lastVisiblityPolygons = [];

    static initialize() {
        const cameraAABB = Camera.getAABB();
        ShadowVision._sprite = new PIXI.Sprite(ShadowVision.TEXTURE);
        ShadowVision._sprite.tint = 0x000000;
        ShadowVision.sizeSprite(cameraAABB);

        if (Connection.isEddie()) {
            Renderer._background.addChild(ShadowVision._container);
        }
        ShadowVision._container.addChild(ShadowVision._sprite);
        ShadowVision._container.addChild(ShadowVision._graphics);

        ShadowVision._filter = new PIXI.Filter(null, `
            varying vec2 vTextureCoord;

            uniform sampler2D uSampler;
            
            uniform float alpha;

            void main(void) {
                float dx = (vTextureCoord.x - 0.5) * 2.0;
                float dy = (vTextureCoord.y - 0.5) * 2.0;
                float d2 = dx * dx + dy * dy;
                
                float thing = clamp(1.0 - d2 * 1.0, 0.0, 1.0) * 0.5 * alpha + (1.0 - alpha);
                
                // float strength = (1.0 - clamp(sqrt(dx * dx + dy * dy) * 1.2, 0.5, 1.0)) * alpha + (1.0 - alpha);
                vec4 color = texture2D(uSampler, vTextureCoord);
                gl_FragColor = vec4(0.0, 0.0, 0.0, (1.0 - color.r) * thing * (1.0 - d2 * 0.1));
            }
        `, ShadowVision._filterUniforms);

        ShadowVision._container.filters = [ShadowVision._filter, new PIXI.filters.BlurFilter()];
    }

    static update(time) {
        // this is honestly too laggy to do it to anyone but moon
        if (!Connection.isEddie()) {
            return;
        }

        if (StateManager._currentState >= StateManager.STATE_ZOOM_IN_LIGHTS_OFF && AudioSystem.NIGHT_OF_CHAOS.playing()) {
            AudioSystem.NIGHT_OF_CHAOS.stop();
        }
        if (StateManager._currentState < StateManager.STATE_ZOOM_IN_LIGHTS_OFF && !AudioSystem.NIGHT_OF_CHAOS.playing()) {
            AudioSystem.NIGHT_OF_CHAOS.play();
        }

        const enabled = StateManager._currentState >= StateManager.STATE_ZOOM_IN_LIGHTS_OFF;
        ShadowVision._filterUniforms.alpha = enabled ? 0 : 1;
        if (!enabled && AudioSystem.THE_DREAD.playing()) {
            AudioSystem.THE_DREAD.stop();
        }
        if (enabled && !AudioSystem.THE_DREAD.playing()) {
            AudioSystem.THE_DREAD.play();
        }

        const position = Connection.getClientPlayer() ? Connection.getClientPlayer().getPosition(time) : [0, 0];

        const cameraAABB = Camera.getAABB();
        ShadowVision.sizeSprite(cameraAABB);

        ShadowVision._lastVisiblityPolygons = [
            ShadowVision.getShadowPolygon(position, 0, Math.PI * 5 / 7),
            ShadowVision.getShadowPolygon(position, Math.PI * 2 / 3, Math.PI * 5 / 7),
            ShadowVision.getShadowPolygon(position, Math.PI * 4 / 3, Math.PI * 5 / 7),
        ];

        ShadowVision._graphics.clear();

        for (let i = 0; i < ShadowVision._lastVisiblityPolygons.length; i++) {
            const polygon = ShadowVision._lastVisiblityPolygons[i];

            ShadowVision._graphics.beginFill(0xffffff);
            ShadowVision._graphics.moveTo(position[0], position[1]);

            for (let a = 0; a < polygon.length; a++) {
                const point = polygon[a];

                ShadowVision._graphics.lineTo(point[0], point[1]);
            }

            ShadowVision._graphics.endFill();
        }

        const moonrats = Object.values(Connection._players).filter(entity => entity instanceof Moonrat);
        for (let i = 0; i < moonrats.length; i++) {
            const moonrat = moonrats[i];
            const position = moonrat.getPosition(time - 500);

            const container = moonrat._container;
            if (!container) {
                continue;
            }

            if (!enabled || ShadowVision.pointTestVisibilityPolygons(position)) {
                container.alpha = Math.min(1, container.alpha + 0.05);
            } else {
                container.alpha = Math.max(0, container.alpha - 0.05);
            }
        }
    }

    static sizeSprite(aabb) {
        ShadowVision._sprite.position.x = aabb[0][0] - 1;
        ShadowVision._sprite.position.y = aabb[0][1] - 1;
        ShadowVision._sprite.width = aabb[1][0] - aabb[0][0] + 2;
        ShadowVision._sprite.height = aabb[1][1] - aabb[0][1] + 2;
    }

    static pointTestVisibilityPolygons(point) {
        for (let i = 0; i < ShadowVision._lastVisiblityPolygons.length; i++) {
            const polygon = ShadowVision._lastVisiblityPolygons[i];

            if (PolygonMath.isPointInPolygon2D(point, polygon)) {
                return true;
            }
        }

        return false;
    }

    static getShadowPolygon(position, lightAngle, arc) {
        // oh boy

        // TODO only do this for moonmoons computer because its extremely inefficient?

        // TODO filter down to only colliding with the scene rect?
        // const screenRectangle = new Rectangle();
        const screenAABB = Camera.getAABB();
        // screenRectangle.x = screenAABB[0][0];
        // screenRectangle.y = screenAABB[0][1];
        // screenRectangle.width = screenAABB[1][0] - screenAABB[0][0];
        // screenRectangle.height = screenAABB[1][1] - screenAABB[0][1];

        const segmentList = [];
        const pointSet = [];
        const polygons = LevelManager._polygons;
        for (let i = 0; i < polygons.length; i++) {
            const polygon = polygons[i];

            for (let a = 0; a < polygon.length; a++) {
                const nextA = (a + 1) % polygon.length;

                const line = [polygon[a], polygon[nextA]];
                if (ShadowVision.isPointInsideViewingArc(position, polygon[a], lightAngle, arc)) {
                    pointSet.push(polygon[a]);
                }
                segmentList.push(line);
            }
        }

        const topLeft = [screenAABB[0][0], screenAABB[0][1]];
        const bottomLeft = [screenAABB[0][0], screenAABB[1][1]];
        const bottomRight = [screenAABB[1][0], screenAABB[1][1]];
        const topRight = [screenAABB[1][0], screenAABB[0][1]];

        if (ShadowVision.isPointInsideViewingArc(position, topLeft, lightAngle, arc)) {
            pointSet.push(topLeft);
        }
        if (ShadowVision.isPointInsideViewingArc(position, bottomLeft, lightAngle, arc)) {
            pointSet.push(bottomLeft);
        }
        if (ShadowVision.isPointInsideViewingArc(position, bottomRight, lightAngle, arc)) {
            pointSet.push(bottomRight);
        }
        if (ShadowVision.isPointInsideViewingArc(position, topRight, lightAngle, arc)) {
            pointSet.push(topRight);
        }

        segmentList.push([[screenAABB[1][0] + 1, screenAABB[0][1] - 1], [screenAABB[0][0] - 1, screenAABB[0][1] - 1]]);
        segmentList.push([[screenAABB[0][0] - 1, screenAABB[0][1] - 1], [screenAABB[0][0] - 1, screenAABB[1][1] + 1]]);
        segmentList.push([[screenAABB[0][0] - 1, screenAABB[1][1] + 1], [screenAABB[1][0] + 1, screenAABB[1][1] + 1]]);
        segmentList.push([[screenAABB[1][0] + 1, screenAABB[1][1] + 1], [screenAABB[1][0] + 1, screenAABB[0][1] - 1]]);

        for (let i = 0; i < segmentList.length; i++) {
            const line1 = segmentList[i];

            for (let a = 0; a < segmentList.length; a++) {
                const line2 = segmentList[a];

                if (line1 === line2) {
                    continue;
                }

                if (ShadowVision.lineLineIntersection(line1, line2)) {
                    const intersectPoint = ShadowVision.rayRayIntersection(line1, line2);
                    if (!intersectPoint) {
                        continue;
                    }


                    if (ShadowVision.isPointInsideViewingArc(position, intersectPoint, lightAngle, arc)) {
                        pointSet.push(intersectPoint);
                    }
                }
            }
        }

        const angleList = [];
        for (let i = 0; i < pointSet.length; i++) {
            const point = pointSet[i];
            const angle = Math.atan2(point[1] - position[1], point[0] - position[0]);

            angleList.push(angle - 0.00001);
            angleList.push(angle);
            angleList.push(angle + 0.00001);
        }

        angleList.push(lightAngle - arc / 2);
        angleList.push(lightAngle + arc / 2);

        const intersectionList = [];
        for (let i = 0; i < angleList.length; i++) {
            const angle = angleList[i];

            const dx = Math.cos(angle);
            const dy = Math.sin(angle);

            const ray = [[position[0], position[1]], [position[0] + dx, position[1] + dy]];

            let closestIntersection = null;
            for (let a = 0; a < segmentList.length; a++) {
                const segment = segmentList[a];

                const currentIntersection = ShadowVision.getIntersection(ray, segment);
                if (!currentIntersection) {
                    continue;
                }

                if (!closestIntersection || currentIntersection.param < closestIntersection.param) {
                    closestIntersection = currentIntersection;
                }
            }

            if (!closestIntersection) {
                continue;
            }

            closestIntersection.angle = angle;

            closestIntersection.point[0] += dx;
            closestIntersection.point[1] += dy;

            intersectionList.push(closestIntersection);
        }

        intersectionList.sort((a, b) => {
            return Math.sign(MathHelper.radiansBetweenAngles(b.angle, a.angle));
        });

        // const sourceIntersection = {
        //     point: [position[0], position[1]],
        // };
        // intersectionList.unshift(sourceIntersection);

        const polygon = [];
        polygon.push([position[0], position[1]]);
        for (let i = 0; i < intersectionList.length; i++) {
            polygon.push([intersectionList[i].point[0], intersectionList[i].point[1]]);
        }

        return polygon;
    }

    static rayRayIntersection(ray1, ray2) {
        const x1 = ray1[0][0];
        const x2 = ray1[1][0];
        const x3 = ray2[0][0];
        const x4 = ray2[1][0];
        const y1 = ray1[0][1];
        const y2 = ray1[1][1];
        const y3 = ray2[0][1];
        const y4 = ray2[1][1];

        const det1And2 = ShadowVision.determinant(x1, y1, x2, y2);
        const det3And4 = ShadowVision.determinant(x3, y3, x4, y4);

        const x1LessX2 = x1 - x2;
        const y1LessY2 = y1 - y2;
        const x3LessX4 = x3 - x4;
        const y3LessY4 = y3 - y4;

        const det1Less2And3Less4 = ShadowVision.determinant(x1LessX2, y1LessY2, x3LessX4, y3LessY4);
        if (det1Less2And3Less4 === 0) {
            return null;
        }

        const x = (ShadowVision.determinant(det1And2, x1LessX2,
            det3And4, x3LessX4) /
            det1Less2And3Less4);

        const y = (ShadowVision.determinant(det1And2, y1LessY2,
            det3And4, y3LessY4) /
            det1Less2And3Less4);

        return [x, y];
    }

    static determinant(a, b, c, d) {
        return a * d - b * c;
    }

    static lineLineIntersection(line1, line2) {
        const x1 = line1[0][0];
        const x2 = line1[1][0];
        const x3 = line2[0][0];
        const x4 = line2[1][0];
        const y1 = line1[0][1];
        const y2 = line1[1][1];
        const y3 = line2[0][1];
        const y4 = line2[1][1];

        if (x1 === x2 && y1 === y2 || x3 === x4 && y3 === y4) {
            return false;
        }

        // Fastest method, based on Franklin Antonio's "Faster Line Segment Intersection" topic "in Graphics Gems III" book (http://www.graphicsgems.org/)
        const ax = x2 - x1;
        const ay = y2 - y1;
        const bx = x3 - x4;
        const by = y3 - y4;
        const cx = x1 - x3;
        const cy = y1 - y3;

        const alphaNumerator = by * cx - bx * cy;
        const commonDenominator = ay * bx - ax * by;
        if (commonDenominator > 0) {
            if (alphaNumerator < 0 || alphaNumerator > commonDenominator) {
                return false;
            }
        } else if (commonDenominator < 0) {
            if (alphaNumerator > 0 || alphaNumerator < commonDenominator) {
                return false;
            }
        }
        const betaNumerator = ax * cy - ay * cx;
        if (commonDenominator > 0) {
            if (betaNumerator < 0 || betaNumerator > commonDenominator) {
                return false;
            }
        } else if (commonDenominator < 0) {
            if (betaNumerator > 0 || betaNumerator < commonDenominator) {
                return false;
            }
        }

        return commonDenominator !== 0;
    }

    static getIntersection(ray, segment) {
        const r_px = ray[0][0];
        const r_py = ray[0][1];
        const r_dx = ray[1][0] - ray[0][0];
        const r_dy = ray[1][1] - ray[0][1];

        const s_px = segment[0][0];
        const s_py = segment[0][1];
        const s_dx = segment[1][0] - segment[0][0];
        const s_dy = segment[1][1] - segment[0][1];

        const r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
        const s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
        if (r_dx / r_mag === s_dx / s_mag && r_dy / r_mag === s_dy / s_mag){
            // unit vectors are the same
            return null;
        }

        // SOLVE FOR T1 & T2
        // r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
        // ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
        // ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
        // ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
        const t2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
        const t1 = (s_px + s_dx * t2 - r_px) / r_dx;

        if (t1 < 0) {
            return null;
        }
        if (t2 < 0 || t2 > 1) {
            return null;
        }

        return {
            point: [r_px + r_dx * t1, r_py + r_dy * t1],
            param: t1,
        };
    }

    static isPointInsideViewingArc(source, dest, lightAngle, lightArc) {
        const destAngle = Math.atan2(dest[1] - source[1], dest[0] - source[0]);

        const shortestAngle = MathHelper.radiansBetweenAngles(lightAngle, destAngle);

        return Math.abs(shortestAngle) <= lightArc / 2;
    }
}