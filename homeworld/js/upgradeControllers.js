class PlayerUpgradeController {
    constructor() {

        this.initializeMiningShipStats();
        this.initializeMothershipStats();
        this.initializeBattleShipStats();   
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
            range: 100,
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
}