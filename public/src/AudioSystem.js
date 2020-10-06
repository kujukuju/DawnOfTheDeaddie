class AudioSystem {
    static BURNING_DAD = USERNAME ? new Howl({src: ['assets/audio/imburning.mp3'], volume: 1}) : null;

    static THE_DREAD = USERNAME ? new Howl({src: ['assets/audio/the-dread.mp3'], volume: 0.4, loop: true}) : null;
    static NIGHT_OF_CHAOS = USERNAME ? new Howl({src: ['assets/audio/night-of-chaos.mp3'], volume: 0.2, loop: true}) : null;

    static PAIN_SOUNDS_TANK = USERNAME ? [
        new Howl({src: ['assets/audio/tank/tank-hurt-1.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/tank/tank-hurt-2.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/tank/tank-hurt-3.mp3'], volume: 1}),
    ] : null;
    static PAIN_SOUNDS_TANK_LAST_USED = USERNAME ? AudioSystem.PAIN_SOUNDS_TANK.map(() => Date.now()) : null;

    static PAIN_SOUNDS_SPITTER = USERNAME ? [
        new Howl({src: ['assets/audio/spitter/spitter-hurt-1.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/spitter/spitter-hurt-2.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/spitter/spitter-hurt-3.mp3'], volume: 1}),
    ] : null;
    static PAIN_SOUNDS_SPITTER_LAST_USED = USERNAME ? AudioSystem.PAIN_SOUNDS_SPITTER.map(() => Date.now()) : null;

    static PAIN_SOUNDS_POUNCER = USERNAME ? [
        new Howl({src: ['assets/audio/pouncer/pouncer-hurt-1.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pouncer/pouncer-hurt-2.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pouncer/pouncer-hurt-3.mp3'], volume: 1}),
    ] : null;
    static PAIN_SOUNDS_POUNCER_LAST_USED = USERNAME ? AudioSystem.PAIN_SOUNDS_POUNCER.map(() => Date.now()) : null;

    static PAIN_SOUNDS_EDDIE = USERNAME ? [
        new Howl({src: ['assets/audio/eddie/eddie-hurt-1.mp3'], volume: 0.25}),
        new Howl({src: ['assets/audio/eddie/eddie-hurt-2.mp3'], volume: 0.25}),
        new Howl({src: ['assets/audio/eddie/eddie-hurt-3.mp3'], volume: 0.25}),
        new Howl({src: ['assets/audio/eddie/eddie-hurt-4.mp3'], volume: 0.25}),
        new Howl({src: ['assets/audio/eddie/eddie-hurt-5.mp3'], volume: 0.25}),
        new Howl({src: ['assets/audio/eddie/eddie-hurt-6.mp3'], volume: 0.25}),
    ] : null;
    static PAIN_SOUNDS_EDDIE_LAST_USED = USERNAME ? AudioSystem.PAIN_SOUNDS_EDDIE.map(() => Date.now()) : null;
    static _lastEddiePainSoundTime = 0;

    static TANK_NOISES = USERNAME ? [
        new Howl({src: ['assets/audio/tank/tank-noise-1.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/tank/tank-noise-2.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/tank/tank-noise-3.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/tank/tank-noise-4.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/tank/tank-noise-5.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/tank/tank-noise-6.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/tank/tank-noise-7.mp3'], volume: 1}),
    ] : null;
    static TANK_NOISES_LAST_USED = USERNAME ? AudioSystem.TANK_NOISES.map(() => Date.now()) : null;

    static SPITTER_NOISES = USERNAME ? [
        new Howl({src: ['assets/audio/spitter/spitter-noise-1.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/spitter/spitter-noise-2.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/spitter/spitter-noise-3.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/spitter/spitter-noise-4.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/spitter/spitter-noise-5.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/spitter/spitter-noise-6.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/spitter/spitter-noise-7.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/spitter/spitter-noise-8.mp3'], volume: 1}),
    ] : null;
    static SPITTER_NOISES_LAST_USED = USERNAME ? AudioSystem.SPITTER_NOISES.map(() => Date.now()) : null;

    static POUNCER_NOISES = USERNAME ? [
        new Howl({src: ['assets/audio/pouncer/pouncer-noise-1.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pouncer/pouncer-noise-2.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pouncer/pouncer-noise-3.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pouncer/pouncer-noise-4.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pouncer/pouncer-noise-5.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pouncer/pouncer-noise-6.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pouncer/pouncer-noise-7.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pouncer/pouncer-noise-8.mp3'], volume: 1}),
    ] : null;
    static POUNCER_NOISES_LAST_USED = USERNAME ? AudioSystem.POUNCER_NOISES.map(() => Date.now()) : null;

    static DEATH_SOUNDS = USERNAME ? [
        new Howl({src: ['assets/audio/pain/gwahwah-1.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pain/gwahwah-2.mp3'], volume: 1}),
        new Howl({src: ['assets/audio/pain/gwahwah-3.mp3'], volume: 1}),
    ] : null;

    static SPEECHES = USERNAME ? [
        new Howl({src: ['assets/audio/speeches/speech-1.mp3'], volume: 0.18}),
        new Howl({src: ['assets/audio/speeches/speech-2.mp3'], volume: 0.18}),
        new Howl({src: ['assets/audio/speeches/speech-3.mp3'], volume: 0.18}),
        new Howl({src: ['assets/audio/speeches/speech-4.mp3'], volume: 0.18}),
        new Howl({src: ['assets/audio/speeches/speech-5.mp3'], volume: 0.18}),
        new Howl({src: ['assets/audio/speeches/speech-6.mp3'], volume: 0.18}),
        new Howl({src: ['assets/audio/speeches/speech-7.mp3'], volume: 0.18}),
    ] : null;

    static initialize() {
        Howler.orientation(0, 1, 0, 0, 0, 1);
    }

    static update(time) {
        const clientPosition = Connection.getClientPlayer() ? Connection.getClientPlayer().getPosition(time) : [0, 0];
        const clientY = Math.sqrt(2) / 2 * clientPosition[1];

        Howler.pos(clientPosition[0], -clientY, -clientY);
    }

    static playPainSound(position, moonratType) {
        const thing1 = {
            0: AudioSystem.PAIN_SOUNDS_TANK,
            1: AudioSystem.PAIN_SOUNDS_SPITTER,
            2: AudioSystem.PAIN_SOUNDS_POUNCER,
        };
        const thing2 = {
            0: AudioSystem.PAIN_SOUNDS_TANK_LAST_USED,
            1: AudioSystem.PAIN_SOUNDS_SPITTER_LAST_USED,
            2: AudioSystem.PAIN_SOUNDS_POUNCER_LAST_USED,
        };

        AudioSystem.playSound(AudioSystem._internGetSound(thing1[moonratType], thing2[moonratType]), position);
    }

    static playEddiePainSound() {
        const now = Date.now();
        if (now - AudioSystem._lastEddiePainSoundTime <= 410) {
            return;
        }

        AudioSystem._lastEddiePainSoundTime = now;

        const sound = AudioSystem._internGetSound(AudioSystem.PAIN_SOUNDS_EDDIE, AudioSystem.PAIN_SOUNDS_EDDIE_LAST_USED);
        if (sound) {
            sound.play();
        }
    }

    static playTankSound(position) {
        AudioSystem.playSound(AudioSystem._internGetSound(AudioSystem.TANK_NOISES, AudioSystem.TANK_NOISES_LAST_USED), position);
    }

    static playSpitterSound(position) {
        AudioSystem.playSound(AudioSystem._internGetSound(AudioSystem.SPITTER_NOISES, AudioSystem.SPITTER_NOISES_LAST_USED), position);
    }

    static playPouncerSound(position) {
        AudioSystem.playSound(AudioSystem._internGetSound(AudioSystem.POUNCER_NOISES, AudioSystem.POUNCER_NOISES_LAST_USED), position);
    }

    static _internGetSound(map, times) {
        const now = Date.now();

        let accum = 0;
        for (let i = 0; i < times.length; i++) {
            accum += now - times[i];
        }
        accum = accum || 1;

        let percent = 0;
        const percents = times.map(lastUsedTime => {
            percent += (now - lastUsedTime) / accum;
            return percent;
        });

        const value = Math.random();
        for (let i = 0; i < percents.length; i++) {
            if (value <= percents[i]) {
                const sound = map[i];
                times[i] = now;

                return sound;
            }
        }

        return null;
    }

    static playSpeech(index) {
        const speech = AudioSystem.SPEECHES[index];
        if (!speech) {
            return;
        }
        AudioSystem.SPEECHES[index] = null;

        speech.play();
    }

    static playDeathSound(position) {
        const sound = AudioSystem.DEATH_SOUNDS[Math.floor(Math.random() * AudioSystem.DEATH_SOUNDS.length)];

        AudioSystem.playSound(sound, position);
    }

    static playSound(howl, position) {
        if (!howl) {
            return;
        }

        const id = howl.play();
        AudioSystem.setPosition(howl, id, position);
        howl.pannerAttr({coneOuterGain: 1, rolloffFactor: 0.4, refDistance: 60, maxDistance: 2000}, id);

        return id;
    }

    static setPosition(howl, id, position) {
        if (!howl) {
            return;
        }

        const y = Math.sqrt(2) / 2 * position[1];

        howl.pos(position[0], -y, -y, id);
    }
}