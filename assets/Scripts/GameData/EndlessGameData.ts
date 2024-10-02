import { _decorator, Component, Node } from 'cc';
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
const { ccclass, property } = _decorator;

@ccclass('EndlessGameData')
export class EndlessGameData {
    private static instance: EndlessGameData;

    private score: number = 0;
    private receivedDiamond: number = 0;
    private opponentScore: number = 0;
    private challengeDeadBeforeEnd: boolean = false;
    private reviveHearts: number;
    private isSpinWheelDiamondDouble: boolean = false;

    // item level
    private magnetLevel: number = 0;
    private freezerLevel: number = 0;
    private slowdownLevel: number = 0;
    private doubleLevel: number = 0;
    private superHeroLevel: number = 0;

    // item price
    private level1Price: number = 500;
    private level2Price: number = 1200;
    private level3Price: number = 2500;
    private itemPrices: number[] = [this.level1Price, this.level2Price, this.level3Price];

    // data keys
    private revivedHeartsCountKey = "revivedHeartsCount";
    private default5HeartsKey = "default5Hearts";

    // check if player has 5 heart from purchasing iap or not;
    private isDefault5Hearts: boolean = false;

    get Score(): number {return this.score;}
    set Score(value: number) {this.score = value;}

    get ReceivedDiamond(): number {return this.receivedDiamond;}
    set ReceivedDiamond(value: number) {this.receivedDiamond = value;}

    get OpponentScore(): number {return this.opponentScore;}
    set OpponentScore(value: number) {this.opponentScore = value;}

    get ChallengeDeadBeforeEnd(): boolean {return this.challengeDeadBeforeEnd;}
    set ChallengeDeadBeforeEnd(value: boolean) {this.challengeDeadBeforeEnd = value;}

    get ReviveHearts(): number {return this.reviveHearts;}
    set ReviveHearts(value: number) {this.reviveHearts = value;}

    get IsSpinWheelDiamondDouble(): boolean {return this.isSpinWheelDiamondDouble;}
    set IsSpinWheelDiamondDouble(value: boolean) {this.isSpinWheelDiamondDouble = value;}

    get MagnetLevel() {return this.magnetLevel;}
    set MagnetLevel(value: number) {this.magnetLevel = value;}

    get FreezerLevel() { return this.freezerLevel; }
    set FreezerLevel(value: number) {this.freezerLevel = value;}

    get SlowdownLevel() {return this.slowdownLevel;}
    set SlowdownLevel(value: number) {this.slowdownLevel = value;}

    get DoubleLevel() {return this.doubleLevel;}
    set DoubleLevel(value: number) {this.doubleLevel = value;}

    get SuperHeroLevel() {return this.superHeroLevel;}
    set SuperHeroLevel(value: number) {this.superHeroLevel = value;}

    get Level1Price(): number {return this.level1Price;}
    set Level1Price(value: number) {this.level1Price = value;}

    get Level2Price(): number {return this.level2Price;}
    set Level2Price(value: number) {this.level2Price = value;}

    get Level3Price(): number {return this.level3Price;}
    set Level3Price(value: number) {this.level3Price = value;}

    get ItemPrices(): number[] {return this.itemPrices;}
    set ItemPrices(value: number[]) {this.itemPrices = value;}

    private constructor() {}

    public static getInstance(): EndlessGameData {
        if (!EndlessGameData.instance) {
            EndlessGameData.instance = new EndlessGameData();
        }
        return EndlessGameData.instance;
    }

    public checkSpinWheelDoubleStatus() {       // is called in GameManager start() end in GameOver scenes
        const savedTimestamp = localStorage.getItem('spinWheelDoubleStartTime');

        if (savedTimestamp) {
            const startTime = parseInt(savedTimestamp, 10); // Convert the saved string back to a number
            const now = Date.now();
            const elapsedTime = now - startTime; // Time elapsed in milliseconds

            const oneMinute = 60000; // 1 minute in milliseconds (for testing)
            // const oneDay = 86400000; // 24 hours in milliseconds (for production)

            // Check if the required time has passed
            if (elapsedTime >= oneMinute) {
                this.isSpinWheelDiamondDouble = false;
                //console.log('Spin wheel double diamond time expired. Flag turned off.');

                // Optionally, remove the stored timestamp
                localStorage.removeItem('spinWheelDoubleStartTime');
            } else {
                //console.log('Spin wheel double diamond still active.');
            }
        }
    }

    public checkDefault5HeartsStatus() {        // is called in GameManager start()
        const savedDefault5Hearts = localStorage.getItem(this.default5HeartsKey);
        this.isDefault5Hearts = savedDefault5Hearts ? savedDefault5Hearts === 'true' : false;
        localStorage.setItem(this.default5HeartsKey, this.isDefault5Hearts.toString());
    }

    public checkSpinWheelHealthStatus() {       // is called in GameManager start() end in GameOver scenes
        const savedTimestamp = localStorage.getItem('spinWheelOneMoreHealth');

        if (savedTimestamp) {
            const startTime = parseInt(savedTimestamp, 10); // Convert the saved string back to a number
            const now = Date.now();
            const elapsedTime = now - startTime; // Time elapsed in milliseconds

            const oneMinute = 60000; // 1 minute in milliseconds (for testing)
            // const oneDay = 86400000; // 24 hours in milliseconds (for production)

            // Check if the required time has passed
            if (elapsedTime >= oneMinute) {
                // if player doesn't have has default5Hearts flag then decrease 1 health
                if (!this.isDefault5Hearts) {
                    const savedReviveHearts = localStorage.getItem(this.revivedHeartsCountKey);
                    const currentSavedHearts = parseInt(savedReviveHearts, 10);
                    if (currentSavedHearts && currentSavedHearts > 3)
                    {
                        const updatedReviveHearts = currentSavedHearts - 1;
                        localStorage.setItem(this.revivedHeartsCountKey, updatedReviveHearts.toString());
                        EndlessGameData.getInstance().ReviveHearts = updatedReviveHearts;
                    }
                }
            } else {

            }
        }
    }

    public updateItemLevels()
    {
        this.magnetLevel = parseInt(localStorage.getItem("magnetLevel"), 10);
        this.freezerLevel = parseInt(localStorage.getItem("freezerLevel"), 10);
        this.slowdownLevel = parseInt(localStorage.getItem("slowdownLevel"), 10);
        this.doubleLevel = parseInt(localStorage.getItem("doubleLevel"), 10);
        this.superHeroLevel = parseInt(localStorage.getItem("superHeroLevel"), 10);
    }
}