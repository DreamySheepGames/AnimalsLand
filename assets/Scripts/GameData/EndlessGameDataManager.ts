import { _decorator, Component, Node, RichText } from 'cc';
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
const { ccclass, property } = _decorator;

@ccclass('EndlessGameDataManager')
export class EndlessGameDataManager extends Component {
    @property(RichText)
    scoreLabel: RichText;

    @property(RichText)
    diamondLabel: RichText;

    onLoad() {
        const gameData = EndlessGameData.getInstance();

        // Update UI elements with score and diamond count
        this.scoreLabel.string = "Score: <color=#EE6E69>" + gameData.Score.toString() + "</color>";
        this.diamondLabel.string = gameData.ReceivedDiamond.toString();
    }
}


