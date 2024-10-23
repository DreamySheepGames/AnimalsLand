import { _decorator, Component, Node, sp } from 'cc';
import {CharacterData} from "db://assets/Scripts/GameData/CharacterData";
import {FillBarController} from "db://assets/Scripts/UI/FillBarController";
import {CharactersPanelController} from "db://assets/Scripts/UI/CharactersPanelController";
import {UserDataManager} from "db://assets/Scripts/GameData/UserDataManager";
const { ccclass, property } = _decorator;

@ccclass('CharactersLayoutController')
export class CharactersLayoutController extends Component {
    @property(FillBarController)
    private characterSlider: FillBarController;

    @property(CharactersPanelController)
    private charactersPanelController: CharactersPanelController;

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
                // explode vfx
                const thirdChild = childNode.children[2];
                if (thirdChild) {
                    thirdChild.active = true;
                    thirdChild.getComponent(sp.Skeleton).setCompleteListener(() => {
                        thirdChild.destroy();
                    })
                }

                // set frame off
                const secondChild = childNode.children[1];
                this.scheduleOnce(() => {
                    secondChild.active = false;
                }, 0.5);
            }
        }
    }

    // for button
    unlockCasualCharacter() {
        if (parseInt(localStorage.getItem("unlockedCount"), 10))
        {
            const casualCharacterIDs = [];

            // normal characters have IDs from 0 to 23
            for (let i = 0; i < 24; i++)
                casualCharacterIDs.push(i);

            this.unlockingCharacter(casualCharacterIDs);
        }
    }

    // for button
    unlockingCharacter(IDsToRandom: number[])
    {
        // Retrieve characterID array from localStorage
        let characterIDs = JSON.parse(localStorage.getItem('characterIDs') || '[]');

        // Filter out characters that are already unlocked
        const unlockedPremiumIDs = characterIDs.filter(id => IDsToRandom.indexOf(id) !== -1);

        // If all characters are already unlocked, do nothing
        if (unlockedPremiumIDs.length === IDsToRandom.length) {
            console.log("all characters has already been unlocked!");
        } else {
            // Randomly select a character that hasn't been unlocked
            let newCharacterID: number;
            do {
                newCharacterID = IDsToRandom[Math.floor(Math.random() * IDsToRandom.length)];
            } while (characterIDs.indexOf(newCharacterID) !== -1); // Repeat if ID is already unlocked

            // Add the new premium character ID to the characterID array
            characterIDs.push(newCharacterID);

            // Save the updated characterID array back to localStorage
            localStorage.setItem('characterIDs', JSON.stringify(characterIDs));

            //UserDataManager.getInstance().updateUserData();

            // Save the unlocked count left
            let unlockedCountLeft = parseInt(localStorage.getItem("unlockedCount"), 10);
            if (unlockedCountLeft - 1 >= 0)
                unlockedCountLeft--;
            localStorage.setItem("unlockedCount", unlockedCountLeft.toString());

            // set freeze frame off and update fillbar
            this.setFreezeFrameOff();
            this.scheduleOnce(() => {
                this.characterSlider.updateFill();
            }, 0.8);

            // turn off character button
            if (unlockedCountLeft <= 0)
                this.charactersPanelController.doneUnlockingCharacters();
        }
    }
}


