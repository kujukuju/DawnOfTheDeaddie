class LogicLoop {
    static update(time) {
        // clear inactives
        Connection.update(time);

        AudioSystem.update(time);

        const clientPlayer = Connection.getClientPlayer();
        if (clientPlayer) {
            clientPlayer.updateLocal(time);
            clientPlayer.sendPackets();
        }

        const entities = Object.values(Connection._players);
        for (let i = 0; i < entities.length; i++) {
            entities[i].update(time);
        }

        if (Connection.getEddie()) {
            Connection.getEddie()._inSpit = false;
        }
        AbilityManager.update(time);

        ShadowVision.update(time);
        CreepyVision.update(time);

        FogManager.update(time);

        StateManager.update(time);
        WaveSystem.update(time);

        ArrowManager.update(time);
    }
}