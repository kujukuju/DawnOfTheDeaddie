class AbilityManager {
    static _abilities = [];

    static update(time) {
        for (let i = 0; i < AbilityManager._abilities.length; i++) {
            if (!AbilityManager._abilities[i].isActive(time)) {
                AbilityManager._abilities[i].destroy();
                AbilityManager._abilities.splice(i, 1);
                i--;
                continue;
            }

            AbilityManager._abilities[i].update(time);
        }
    }

    static addAbility(ability) {
        AbilityManager._abilities.push(ability);
    }

    static shouldSlow(name) {
        return !!AbilityManager._abilities.find(ability => ability._parentUsername === name && ability.shouldSlow(Date.now()));
    }
}