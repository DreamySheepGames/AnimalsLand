import { _decorator, Component, Node, sp } from 'cc';
import {EndlessGameManagerOpponent} from "db://assets/Scripts/GamePlay/EndlessGameManagerOpponent";
import {CharacterData} from "db://assets/Scripts/GameData/CharacterData";
const { ccclass, property } = _decorator;

@ccclass('LoadOpponentSkin')
export class LoadOpponentSkin extends Component {
    private playerSprite: sp.Skeleton;

    start() {
        this.playerSprite = this.node.getComponent(sp.Skeleton);
        this.applySkin();
    }

    applySkin()
    {
        const chosenID = Math.floor(Math.random() * 30) + 1;

        if (chosenID) {
            const skinName = "char_" + chosenID;
            this.playerSprite.setSkin(skinName);
            this.playerSprite.setAnimation(0, "idle", true);
            CharacterData.getInstance().OpponentSkinID = chosenID;
        } else {
            console.warn('Chosen skin ID is missing.');
            this.playerSprite.setSkin("char_1");
            this.playerSprite.setAnimation(0, "idle", true);
            CharacterData.getInstance().OpponentSkinID = 30;
        }
    }
}


