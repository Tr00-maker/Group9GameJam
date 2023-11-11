class PlayerUpgradeController {
    constructor() {

        this.initializeMiningShipStats();
        this.initializeMothershipStats();
        this.initializeBattleShipStats();
        this.initializeDreadnoughtStats();   
    }

    initializeMiningShipStats() {
        this.miningShipStat = {
            speed: 0.75,
            health: 100,
            range: 100, 
            size: 20,
            capacity: 10,
            miningRate: 0.5,
        }
    }

    initializeBattleShipStats() {
        this.battleShipStat = {
            speed: 1,
            health: 150,
            range: 225,
            size: 25,
            fireRate: 0.75,
            shotSpeed: 7,
            damage: 10,
        }
    }

    initializeMothershipStats() {
        this.mothershipStat = {
            speed: 0.2,
            health: 2000,
            range: 100,
            size: 70,
        }
    }
    //dreadnought
    initializeDreadnoughtStats() {
        this.dreadnoughtStat = {
            speed: 0.2,
            health: 1800,
            range: 500, 
            size: 50,
            fireRate: 0.4,
            shotSpeed: 20,
            damage: 50,
        }
    }

    upgradeMiningLv1() {
        this.miningShipStat.miningRate *= 1.25;
        this.miningShipStat.capacity *= 1.25;
        for (let m of miningShips) {
            m.miningRate *= 1.25;
            m.capacity *= 1.25;
        }
    }

    upgradeMiningLv2() {
        this.miningShipStat.miningRate *= 1.25;
        this.miningShipStat.health *= 2;
        this.miningShipStat.speed *= 1.2;
        for (let m of miningShips) {
            m.miningRate *= 1.5;
            m.capacity *= 1.5;
            m.health *= 2;
            m.speed *= 1.2;
        }
    }

    upgradeBattleLv1() {
        this.battleShipStat.miningRate *= 1.25;
        this.battleShipStat.capacity *= 1.25;
        for (let b of battleShips) {
            b.fireRate *= 1.25;
            b.shotSpeed *= 1.2;
            b.damage *= 1.25;
        }
    }

    upgradeBattleLv2() {
        this.battleShipStat.miningRate *= 1.25;
        this.battleShipStat.capacity *= 1.25;
        for (let b of battleShips) {
            b.fireRate *= 1.5;
            b.shotSpeed *= 1.4;
            b.health *= 1.5;
            b.speed *= 1.2;
            b.damage *= 2;
        }
    }
}