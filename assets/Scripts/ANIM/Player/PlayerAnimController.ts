import { _decorator, Component, Node, sp } from 'cc';
import {CharacterData} from "db://assets/Scripts/GameData/CharacterData";
const { ccclass, property } = _decorator;

@ccclass('PlayerAnimController')
export class PlayerAnimController extends Component {
    @property(sp.Skeleton)
    private playerSprite: sp.Skeleton;

    start() {
        this.applyPlayerSkin();
    }

    applyPlayerSkin()
    {
        const characterData = CharacterData.getInstance();
        const chosenID = characterData.CharacterName; // The saved sprite frame id

        if (chosenID) {
            const skinName = "char_" + chosenID;
            this.playerSprite.setSkin(skinName);
            this.playerSprite.setAnimation(0, "idle", true);
        } else {
            console.warn('Chosen skin ID is missing.');
            this.playerSprite.setSkin("char_1");
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


