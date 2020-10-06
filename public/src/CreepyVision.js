class CreepyVision {
    static TEXTURE = USERNAME ? PIXI.Texture.from('assets/white.png') : null;

    static _sprite = null;
    static _filter = null;
    static _filterUniforms = {
        dist1: 0.55,
        d1Strength: 20,
        dist2: 0.85,
        d2Strength: 20,
        dist3: 1.1,
        d3Strength: 20,
    };

    static initialize() {
        CreepyVision._sprite = new PIXI.Sprite(CreepyVision.TEXTURE);
        CreepyVision._sprite.position.x = 0;
        CreepyVision._sprite.position.y = 0;

        CreepyVision.resize();

        Renderer._static.addChild(CreepyVision._sprite);

        CreepyVision._filter = new PIXI.Filter(null, `
            varying vec2 vTextureCoord;

            uniform sampler2D uSampler;
            
            uniform float dist1;
            uniform float d1Strength;
            uniform float dist2;
            uniform float d2Strength;
            uniform float dist3;
            uniform float d3Strength;
            
            float cubicInOut(float t) {
                return t < 0.5
                    ? 4.0 * t * t * t
                    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
            }

            void main(void) {
                float dx = (vTextureCoord.x - 0.5) * 2.0;
                float dy = (vTextureCoord.y - 0.5) * 2.0;
                float d2 = dx * dx + dy * dy;
                float clampedD2 = pow(1.0 - clamp(d2 / 4.0, 0.0, 1.0), 2.0);
                
                float d = sqrt(d2);
                
                float dVal1 = 1.0 - cubicInOut(clamp((d - dist1) * d1Strength, 0.0, 1.0));
                dVal1 = dVal1 * 0.3 + 0.7;
                
                float dVal2 = 1.0 - cubicInOut(clamp((d - dist2) * d2Strength, 0.0, 1.0));
                dVal2 = dVal2 * 0.6 + 0.4;
                
                float dVal3 = 1.0 - cubicInOut(clamp((d - dist3) * d3Strength, 0.0, 1.0));
                dVal3 = dVal3 * 1.0 + 0.0;
                
                float finalStrength = 1.0 - clampedD2 * dVal1 * dVal2 * dVal3;
            
                gl_FragColor = vec4(14.0 / 255.0, 13.0 / 255.0, 18.0 / 255.0, finalStrength);
            }
        `, CreepyVision._filterUniforms);

        CreepyVision._sprite.filters = [CreepyVision._filter];
    }

    static update(time) {
        CreepyVision._sprite.visible = StateManager._currentState >= StateManager.STATE_ZOOM_IN_LIGHTS_OFF;

        const t = (time / 100) % (Math.PI * 2);
        const jitter1 = Math.sin(t) + Math.cos(t * 1.54) + Math.sin(t * 1.82) + Math.cos(t * 4.2) * 0.5;
        const jitter2 = -Math.sin(t) - Math.cos(t * 1.84) + Math.sin(t * 1.42) - Math.cos(t * 4.5) * 0.5;
        const jitter3 = Math.sin(t) - Math.cos(t * 1.14) - Math.sin(t * 2.11) + Math.cos(t * 4.7) * 0.5;

        // CreepyVision._filterUniforms.dist1 = jitter1 * 0.001 + 0.55;
        // CreepyVision._filterUniforms.dist2 = jitter2 * 0.001 + 0.7;
        // CreepyVision._filterUniforms.dist3 = jitter3 * 0.001 + 0.95;

        CreepyVision._filterUniforms.d1Strength = (jitter1 * 0.45 + 10) * 0.4;
        CreepyVision._filterUniforms.d2Strength = (jitter2 * 0.45 + 10) * 0.6;
        CreepyVision._filterUniforms.d3Strength = (jitter3 * 0.45 + 10) * 0.8;
    }

    static resize() {
        CreepyVision._sprite.width = window.innerWidth;
        CreepyVision._sprite.height = window.innerHeight;
    }
}