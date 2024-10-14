import { _decorator, Component, Node, sp } from 'cc';
import {CharacterData} from "db://assets/Scripts/GameData/CharacterData";
import {EndlessGameManagerOpponent} from "db://assets/Scripts/GamePlay/EndlessGameManagerOpponent";
const { ccclass, property } = _decorator;

@ccclass('OpponentAnimController')
export class OpponentAnimController extends Component {
    @property(sp.Skeleton)
    private playerSprite: sp.Skeleton;

    start() {
        this.applySkin();
    }

    applySkin()
    {
        const chosenID = CharacterData.getInstance().OpponentSkinID;

        if (chosenID) {
            const skinName = "char_" + chosenID.toString();
            this.playerSprite.setSkin(skinName);
            this.playerSprite.setAnimation(0, "idle", true);
        } else {
            console.warn('Chosen skin ID is missing.');
            this.playerSprite.setSkin("char_30");
            this.playerSprite.setAnimation(0, "idle", true);
        }
    }

    playAnimOnce(animName: string) {
        this.playerSprite.setAnimation(0, animName, false);
        this.playerSprite.setCompleteListener(() => {
            this.playerSprite.setAnimation(0, "idle", true);
        })
    }

    playAnimLoop(animName: string) {
        this.playerSprite.setAnimation(0, animName, true);
    }
}


