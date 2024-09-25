import { _decorator, Component, Node } from 'cc';
import {CharacterData} from "db://assets/Scripts/GameData/CharacterData";
import {FillBarController} from "db://assets/Scripts/UI/FillBarController";
const { ccclass, property } = _decorator;

@ccclass('CharactersLayoutController')
export class CharactersLayoutController extends Component {
    @property(FillBarController)
    private characterSlider: FillBarController;

    onEnable() {
        this.setFreezeFrameOff();
        this.characterSlider.updateFill();
    }

    setFreezeFrameOff()
    {
        //console.log(JSON.parse(localStorage.getItem('characterIDs')));
        let characterData = JSON.parse(localStorage.getItem('characterIDs'));
        for (let i = 0; i < characterData.length; i++)
        {
            const childIndex = characterData[i];
            const childNode = this.node.children[childIndex];

            if (childNode && childNode.children.length > 1)
            {
                const secondChild = childNode.children[1];
                secondChild.active = false;
            }
        }
    }
}


