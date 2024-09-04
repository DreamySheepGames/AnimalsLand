import { _decorator, Component, Node } from 'cc';
import {AudioManager} from "db://assets/Scripts/Audio/AudioManager";
const { ccclass, property } = _decorator;

@ccclass('ButttonManager')
export class ButttonManager extends Component {
    public onClick()
    {
        console.log("Button Clicked");
    }

    public playButtonPressedSFX()
    {
        AudioManager.Instance.playSFX(AudioManager.Instance.buttonPressed);
    }
}


