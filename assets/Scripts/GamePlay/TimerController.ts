import { _decorator, Component, Node, Label, director } from 'cc';
import {PlayerController} from "db://assets/Scripts/Player/PlayerController";
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
import {EndlessGameManagerOpponent} from "db://assets/Scripts/GamePlay/EndlessGameManagerOpponent";
const { ccclass, property } = _decorator;

@ccclass('TimerController')
export class TimerController extends Component {
    @property(Label)
    timerLabel: Label;

    @property
    private tag: number = 3;
    // tag = 0: challenge timer
    // tag = 3: super hero
    // tag = 4: double
    // tag = 5: slowdown
    // tag = 6: freezer
    // tag = 7: magnet

    @property
    private duration: number = 3;

    private currentTime: number = 0;

    onEnable()
    {
        //this.currentTime = this.duration;
        // read the effect level from data file
        let effectLv = this.readItemLevel(this.tag);
        this.currentTime = this.duration + 2 * (effectLv - 1)

        this.updateLabel(this.currentTime);

        // Schedule the countdown every second
        this.schedule(this.updateCountdown, 1);
    }

    onDisable() {
        // Unschedule the update to prevent it from continuing if the node gets disabled
        this.unschedule(this.updateCountdown);
    }

    updateCountdown() {
        if (this.currentTime > 1) {
            this.currentTime--;
            this.updateLabel(this.currentTime);
        } else {
            this.unschedule(this.updateCountdown); // Stop the countdown when finished
            this.doneCountdown(); // Call the done countdown function
        }
    }

    updateLabel(timeInSeconds: number) {
        // Calculate minutes and seconds
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;

        // Format as MM:SS
        const formattedTime = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
        this.timerLabel.string = formattedTime;
    }

    padZero(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
    }

    doneCountdown()
    {
        switch(this.tag)
        {
            case 0:     // timer for challenge mode
                this.EndChallengeMode();
                break;

            // turn off effects through endless game manager
            case 3:     // super hero
                EndlessGameManager.Instance.playerInvincibleOff();
                break;

            case 4:     // double
                EndlessGameManager.Instance.DoubleDiamond = false;
                break;

            case 5:     // slowdown
                EndlessGameManager.Instance.returnEnemySpeed();
                break;

            case 6:     // freeze
                EndlessGameManager.Instance.unFreezeEnemy();
                break;

            case 7:     // magnet
                EndlessGameManager.Instance.Magnet = false;
                break;
        }

        // set this timer's and icon's active to false to reuse next time
        this.node.active = false;
    }

    EndChallengeMode()
    {
        // get play data of the enemy
        let endlessGameData = EndlessGameData.getInstance();
        endlessGameData.OpponentScore = EndlessGameManagerOpponent.Instance.Score;
        endlessGameData.Score = EndlessGameManager.Instance.Score;
        endlessGameData.ReceivedDiamond = EndlessGameManager.Instance.ReceivedDiamond;

        endlessGameData.ChallengeDeadBeforeEnd = false;

        director.loadScene('GameOverChallenge');
    }

    readItemLevel(tag)
    {
        switch (tag) {
            case 3: return EndlessGameData.getInstance().SuperHeroLevel;
            case 4: return EndlessGameData.getInstance().DoubleLevel;
            case 5: return EndlessGameData.getInstance().SlowdownLevel;
            case 6: return EndlessGameData.getInstance().FreezerLevel;
            case 7: return EndlessGameData.getInstance().MagnetLevel;
        }

        return 0;
    }
}