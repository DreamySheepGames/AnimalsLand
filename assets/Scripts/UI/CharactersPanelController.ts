import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CharactersPanelController')
export class CharactersPanelController extends Component {
    @property(Node)
    private missionFrame: Node;

    @property(Node)
    private unlockCharacterFrame: Node

    onEnable()
    {
        let unlockedCount = parseInt(localStorage.getItem("unlockedCount"), 10);
        if (unlockedCount > 0) {
            this.missionFrame.active = false;
            this.unlockCharacterFrame.active = true;
        } else {
            this.doneUnlockingCharacters();
        }
    }

    public doneUnlockingCharacters()
    {
        this.missionFrame.active = true;
        this.unlockCharacterFrame.active = false;
    }
}


