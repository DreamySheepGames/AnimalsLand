import { _decorator, Component, Node, Input } from 'cc';
import {PlayerController} from "db://assets/Scripts/Player/PlayerController";
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
const { ccclass, property } = _decorator;

@ccclass('TapArea')
export class TapArea extends Component {
    @property({ type: PlayerController })
    private playerController: PlayerController = null;

    private isInteractable: boolean = false;
    private interactableCountdown: number = 0.38;

    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.scheduleOnce(function() {this.turnOnInteractable();}, this.interactableCountdown);
    }

    turnOnInteractable()
    {
        this.isInteractable = true;
    }

    private onTouchStart() {
        if (this.playerController && this.isInteractable == true && EndlessGameManager.Instance.Health > 0) {
            this.playerController.togglePosition();
        }
    }
}


