import { _decorator, Component, Node, director, Input } from 'cc';
import {GameManager} from "db://assets/Scripts/GamePlay/GameManager";
const { ccclass, property } = _decorator;

@ccclass('StartGameArea')
export class StartGameArea extends Component {

    start()
    {
        // create touch listener
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart()
    {
        // if game mode is endless, open endless scene
        if (GameManager.Instance.isEndlessMode)
        {
            director.loadScene('Endless');
        }
        else    // if game mode is challenge, open challenge scene
        {
            director.loadScene('Challenge');
        }
    }
}