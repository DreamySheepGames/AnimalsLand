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

    get Score(): number {
        return this.score;
    }

    set Score(value: number) {
        this.score = value;
    }

    get ReceivedDiamond(): number {
        return this.receivedDiamond;
    }

    set ReceivedDiamond(value: number) {
        this.receivedDiamond = value;
    }

    get OpponentScore(): number {
        return this.opponentScore;
    }

    set OpponentScore(value: number) {
        this.opponentScore = value;
    }

    get ChallengeDeadBeforeEnd(): boolean {
        return this.challengeDeadBeforeEnd;
    }

    set ChallengeDeadBeforeEnd(value: boolean) {
        this.challengeDeadBeforeEnd = value;
    }

    get ReviveHearts(): number {
        return this.reviveHearts;
    }

    set ReviveHearts(value: number) {
        this.reviveHearts = value;
    }

    get IsSpinWheelDiamondDouble(): boolean {
        return this.isSpinWheelDiamondDouble;
    }

    set IsSpinWheelDiamondDouble(value: boolean) {
        this.isSpinWheelDiamondDouble = value;
    }

    private constructor() {}

    public static getInstance(): EndlessGameData {
        if (!EndlessGameData.instance) {
            EndlessGameData.instance = new EndlessGameData();
        }
        return EndlessGameData.instance;
    }

    public checkSpinWheelDoubleStatus() {
        const gameData = EndlessGameData.getInstance();
        const savedTimestamp = localStorage.getItem('spinWheelDoubleStartTime');

        if (savedTimestamp) {
            const startTime = parseInt(savedTimestamp, 10); // Convert the saved string back to a number
            const now = Date.now();
            const elapsedTime = now - startTime; // Time elapsed in milliseconds

            const oneMinute = 60000; // 1 minute in milliseconds (for testing)
            // const oneDay = 86400000; // 24 hours in milliseconds (for production)

            // Check if the required time has passed
            if (elapsedTime >= oneMinute) {
                gameData.IsSpinWheelDiamondDouble = false;
                //console.log('Spin wheel double diamond time expired. Flag turned off.');

                // Optionally, remove the stored timestamp
                localStorage.removeItem('spinWheelDoubleStartTime');
            } else {
                //console.log('Spin wheel double diamond still active.');
            }
        }
    }
}


