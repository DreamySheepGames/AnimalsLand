import { _decorator, Component, Node, Input } from 'cc';
import {PlayerController} from "db://assets/Scripts/Player/PlayerController";
const { ccclass, property } = _decorator;

@ccclass('TapArea')
export class TapArea extends Component {
    @property({ type: PlayerController })
    private playerController: PlayerController = null;

    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    private onTouchStart() {
        if (this.playerController) {
            this.playerController.togglePosition();
        }
    }
}


