import { _decorator, Component, Node, Label } from 'cc';
import {PlayerController} from "db://assets/Scripts/Player/PlayerController";
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
const { ccclass, property } = _decorator;

@ccclass('TimerController')
export class TimerController extends Component {
    @property(Label)
    timerLabel: Label;

    @property
    private tag: number = 3;
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
        this.currentTime = this.duration;
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
            // turn off effects through endless game manager
            case 3:     // super hero
                EndlessGameManager.Instance.playerInvincibleOff();
                break;
        }

        // set this timer's and icon's active to false to reuse next time
        this.node.active = false;
    }
}


