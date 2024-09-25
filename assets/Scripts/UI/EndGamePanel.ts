import { _decorator, Component, Node, RichText } from 'cc';
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
const { ccclass, property } = _decorator;

@ccclass('EndGamePanel')
export class EndGamePanel extends Component {
    @property(Node)
    private reviveButton: Node;

    @property(Node)
    private reviveText: Node;

    @property(Node)
    private doubleDiamondButton: Node;

    @property(Node)
    private doubleDiamondText: Node;

    @property(RichText)
    private receivedDiamondLabel: RichText;

    onEnable()
    {
        this.receivedDiamondLabel.string = EndlessGameManager.Instance.ReceivedDiamond.toString();

        if (EndlessGameManager.Instance.ReceivedDiamond == 0)
        {
            this.doubleDiamondButton.active = false;
            this.doubleDiamondText.active = false;

            this.reviveButton.setPosition(0, this.reviveButton.position.y, this.reviveButton.position.z);
            this.reviveText.setPosition(0, this.reviveText.position.y, this.reviveText.position.z);
        }

        if (EndlessGameData.getInstance().ReviveHearts == 0)
        {
            this.reviveButton.active = false;
            this.reviveText.active = false;

            this.doubleDiamondButton.setPosition(0, this.doubleDiamondButton.position.y, this.doubleDiamondButton.position.z);
            this.doubleDiamondText.setPosition(0, this.doubleDiamondText.position.y, this.doubleDiamondText.position.z);
        }
    }
}


