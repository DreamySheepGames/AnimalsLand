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

    private constructor() {}

    public static getInstance(): EndlessGameData {
        if (!EndlessGameData.instance) {
            EndlessGameData.instance = new EndlessGameData();
        }
        return EndlessGameData.instance;
    }
}


