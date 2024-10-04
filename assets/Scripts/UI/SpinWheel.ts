import { _decorator, Component, Node, tween, Vec3, RichText, Event, Button, sys, Sprite, resources, SpriteFrame } from 'cc';
import {MenuDataManager} from "db://assets/Scripts/GameData/MenuDataManager";
import {GameManager} from "db://assets/Scripts/GamePlay/GameManager";
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
const { ccclass, property } = _decorator;

@ccclass('SpinWheel')
export class SpinWheel extends Component {
    @property(Node)
    private wheel: Node;

    @property(MenuDataManager)
    private menuDataManager: MenuDataManager;

    @property([Node])
    private reviveHearts: Node[] = [];

    @property(Button)
    private buttonSpin: Button;

    @property(Node)
    private buttonNoThanks: Node;

    @property(Node)
    private spinIcon: Node;

    @property(RichText)
    private spinLabel: RichText;

    @property(Node)
    private prizePanel: Node;

    @property(RichText)
    private prizeName: RichText;

    @property(RichText)
    private prizeDescription: RichText;

    @property(Sprite)
    private characterIcon: Sprite;

    @property(Node)
    private characterLayout: Node;

    private smallDiamondPackage: number = 500;
    private mediumDiamondPackage: number = 1000;
    private hugeDiamondPackage: number = 5000;

    private countdownDuration: number = 60; // 60 seconds for testing, change to 7200 for 2 hours in production
    private remainingTime: number = 0;
    private revivedHeartsCountKey = "revivedHeartsCount";
    private spinWheelDoubleStartTimeKey = 'spinWheelDoubleStartTime';
    private spinWheelOneMoreHealthKey = 'spinWheelOneMoreHealth';

    onEnable()
    {
        // Reset the wheel's angle back to 0
        this.wheel.setRotationFromEuler(0, 0, 0);

        // update button spin and button no thanks
        const endTime = parseInt(sys.localStorage.getItem('spinEndTime') || '0');
        const now = Date.now();
        this.remainingTime = Math.max(0, endTime - now); // Get remaining time
        if (this.remainingTime && this.remainingTime > 0) {
            this.buttonSpin.interactable = false;
            this.updateCountdown();
        }
    }

    public spin() {
        // Generate a random number between 0 and 7
        const randomStop = Math.floor(Math.random() * 8);

        // Calculate the target rotation angle (360 + 45 * randomStop)
        const targetAngle = 720 + 45 * randomStop;

        // Create a tween to spin the wheel to the target angle over 2 seconds
        tween(this.wheel)
            .to(2, { eulerAngles: new Vec3(0, 0, -targetAngle) }, { easing: 'cubicOut' }) // Spin counter-clockwise
            .call(() => {
                this.prize(randomStop);             // assign prize
                this.prizePanel.active = true;      // turn on prize panel
                this.node.active = false;           // turn off spin panel
            })
            .start();
    }

    private prize(prizeIndex: number)
    {
        switch (prizeIndex)
        {
            case 0:     // small diamond pack
                this.saveReceivedDiamond(this.smallDiamondPackage);
                this.diamondPrize(prizeIndex);
                break;

            case 1:     // unlock casual character 1
                this.unlockCasualCharacter();
                break;

            case 2:     // +1 heart
                this.incrementReviveHeart();
                break;

            case 3:     // unlock premium character
                this.unlockPremiumCharacter();
                break;

            case 4:     // huge diamond pack
                this.saveReceivedDiamond(this.hugeDiamondPackage);
                this.diamondPrize(prizeIndex);
                break;

            case 5:     // unlock casual character 2
                this.unlockCasualCharacter();
                break;

            case 6:     // medium diamond pack
                this.saveReceivedDiamond(this.mediumDiamondPackage);
                this.diamondPrize(prizeIndex);
                break;

            case 7:     // double received diamond
                this.spinWheelDoubleDiamondOn();
                break;

        }
    }

    saveReceivedDiamond(receivedDiamond: number) {
        // Retrieve the current saved diamonds from localStorage, if any
        const savedDiamonds = localStorage.getItem('receivedDiamonds');

        // Convert the saved value to a number, defaulting to 0 if it's null
        const currentSavedDiamonds = savedDiamonds ? parseInt(savedDiamonds, 10) : 0;

        // Add the current ReceivedDiamond value to the saved value
        const updatedDiamonds = currentSavedDiamonds + receivedDiamond;

        // Save the updated total back to localStorage
        localStorage.setItem('receivedDiamonds', updatedDiamonds.toString());

        this.menuDataManager.updateDiamondTexts();
    }

    incrementReviveHeart()
    {
        this.characterIcon.node.active = false;
        this.prizeName.string = "Health";
        this.prizeDescription.string = "Increase health in 24 hours";

        // update the hearts layout at main menu
        const savedReviveHearts = localStorage.getItem(this.revivedHeartsCountKey);
        const currentSavedHearts = savedReviveHearts ? parseInt(savedReviveHearts, 10) : 3;
        if (currentSavedHearts < 4)     // avoid player spam increase health then only decrease 1 health after 24 hours
        {
            const updatedReviveHearts = currentSavedHearts + 1;
            localStorage.setItem(this.revivedHeartsCountKey, updatedReviveHearts.toString());
            EndlessGameData.getInstance().ReviveHearts = updatedReviveHearts;

            for (let i = 0; i < 5; i++)
            {
                this.reviveHearts[i].active = i < parseInt(localStorage.getItem(this.revivedHeartsCountKey), 10) ? true : false;
            }
        }

        // after 24 hours, the fx will be turned off in EndlessGameData
        const now = Date.now(); // This gives you the current time in milliseconds
        localStorage.setItem(this.spinWheelOneMoreHealthKey, now.toString());
    }

    spinWheelDoubleDiamondOn()
    {
        EndlessGameData.getInstance().IsSpinWheelDiamondDouble = true;

        this.characterIcon.node.active = false;
        this.prizeName.string = "Double diamond";
        this.prizeDescription.string = "Double the received diamonds in 24 hours";

        // turn off the flag after 1 minute (1 minute is for testing, in game it would be 24 hours) in EndlessGameData.ts
        // Get the current timestamp and save it in localStorage
        const now = Date.now(); // This gives you the current time in milliseconds
        localStorage.setItem(this.spinWheelDoubleStartTimeKey, now.toString());

        // Optionally log for testing
        //console.log("Spin wheel double diamond enabled. Timestamp saved:", now);
    }

    unlockPremiumCharacter() {
        const premiumCharacterIDs = [24, 25, 26, 27, 28, 29];
        this.unlockingCharacter(premiumCharacterIDs);
    }

    unlockCasualCharacter() {
        const casualCharacterIDs = [];

        // normal characters have IDs from 0 to 23
        for (let i = 0; i < 24; i++)
            casualCharacterIDs.push(i);

        this.unlockingCharacter(casualCharacterIDs);
    }

    unlockingCharacter(IDsToRandom: number[])
    {
        // Retrieve characterID array from localStorage
        let characterIDs = JSON.parse(localStorage.getItem('characterIDs') || '[]');

        // Filter out premium characters that are already unlocked
        const unlockedPremiumIDs = characterIDs.filter(id => IDsToRandom.indexOf(id) !== -1);

        // If all premium characters are already unlocked, do nothing
        if (unlockedPremiumIDs.length === IDsToRandom.length) {
            this.prizeName.string = "New character";
            this.prizeDescription.string = "All characters are already unlocked.";
            this.characterIcon.node.active = false;
        } else {
            // Randomly select a premium character that hasn't been unlocked
            let newCharacterID: number;
            do {
                newCharacterID = IDsToRandom[Math.floor(Math.random() * IDsToRandom.length)];
            } while (characterIDs.indexOf(newCharacterID) !== -1); // Repeat if ID is already unlocked

            // Add the new premium character ID to the characterID array
            characterIDs.push(newCharacterID);

            // Save the updated characterID array back to localStorage
            localStorage.setItem('characterIDs', JSON.stringify(characterIDs));

            this.showUnlockedCharacter(newCharacterID);
        }
    }

    showUnlockedCharacter(newCharacterID: number)
    {
        this.prizeDescription.node.active = false;
        this.characterIcon.node.active = true;

        // Assuming that this.characterLayout is a Node that contains children
        const newCharacterNode = this.characterLayout.children[newCharacterID]; // Get the child at the newCharacterID
        const characterIconNode = newCharacterNode.children[0]; // Get the first child of that node

        // Assuming this.characterIcon is of type Sprite
        const characterSprite = characterIconNode.getComponent(Sprite); // Get the Sprite component of the first child
        const chracterSpriteName: string = characterSprite.spriteFrame.name;
        // console.log("new ID: " + newCharacterID);
        // console.log("character icon node: " + newCharacterNode.children[0].getComponent(Sprite).spriteFrame.name);

        if (characterSprite) {
            resources.load(`CharactersIcon/${chracterSpriteName}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.error('Error loading sprite frame:', err);
                    return;
                }
                if (this.characterIcon && spriteFrame) {
                    this.characterIcon.spriteFrame = spriteFrame; // Set the loaded frame to the player sprite
                    this.prizeName.string = spriteFrame.name;
                } else {
                    console.error('Player sprite or loaded sprite frame is null.');
                }
            });
        } else {
            console.error("Sprite component not found on the child node.");
        }
    }


    public buttonSpinClicked(event: Event)
    {
        const buttonNode = event.currentTarget as Node; // Get the button node
        buttonNode.getComponent(Button).interactable = false;

        this.buttonNoThanks.active = false;
        this.spinIcon.active = false;

        // set this.spinLabel.x = 0;
        // change this.spinLabel.getComponent(RichText).string to hh:mm:ss
        // make the hh:mm:ss countdown for 1 minute for testing now, 2 hours when produce
        // when done counting, buttonNoThanks and spinIcon active to true, this.spinLabel.x = 211, string from hh:mm:ss to "Spin"

        this.spinLabel.node.setPosition(0, this.spinLabel.node.position.y); // Set spinLabel.x = 0
        this.startCountdown();
    }

    startCountdown()
    {
        const now = Date.now(); // Current timestamp in milliseconds
        const targetTime = now + this.countdownDuration * 1000; // Target time for countdown
        sys.localStorage.setItem('spinEndTime', targetTime.toString()); // Save the target time in localStorage

        this.updateCountdown(); // Start updating the countdown
    }

    updateCountdown() {
        const endTime = parseInt(sys.localStorage.getItem('spinEndTime') || '0');
        const now = Date.now();
        this.remainingTime = Math.max(0, endTime - now); // Get remaining time

        if (this.remainingTime > 0) {
            this.buttonNoThanks.active = false;
            this.spinIcon.active = false;
            this.spinLabel.node.setPosition(0, this.spinLabel.node.position.y); // Set spinLabel.x = 0

            // Update the countdown display
            const seconds = Math.floor(this.remainingTime / 1000) % 60;
            const minutes = Math.floor(this.remainingTime / (1000 * 60)) % 60;
            const hours = Math.floor(this.remainingTime / (1000 * 60 * 60));

            this.spinLabel.string = `${this.padWithZero(hours)}:${this.padWithZero(minutes)}:${this.padWithZero(seconds)}`;

            // Schedule the next update in 1 second
            this.scheduleOnce(this.updateCountdown.bind(this), 1);
        } else {
            // Countdown finished, restore the original state
            this.spinLabel.string = "Spin";
            this.spinLabel.node.setPosition(211, this.spinLabel.node.position.y); // Restore spinLabel.x = 211
            this.buttonNoThanks.active = true;
            this.spinIcon.active = true;

            // Enable the button
            const spinButton = this.node.getComponent(Button);
            if (spinButton) {
                spinButton.interactable = true;
            }

            // Clear the localStorage item
            sys.localStorage.removeItem('spinEndTime');
        }
    }

    padWithZero(num: number): string {
        return num < 10 ? '0' + num : num.toString();
    }

    diamondPrize(prizeIndex: number)
    {
        this.characterIcon.node.active = false;
        let diamondAmount: number;
        let prizeName: string;

        switch (prizeIndex) {
            case 0:     // small pack
                diamondAmount = this.smallDiamondPackage;
                prizeName = "Small diamond pack";
                break;

            case 4:     // huge pack
                diamondAmount = this.hugeDiamondPackage;
                prizeName = "Huge diamond pack";
                break;

            case 6:     // medium pack
                diamondAmount = this.mediumDiamondPackage;
                prizeName = "Medium diamond pack";
                break;
        }

        this.prizeDescription.string = "A package contains " + diamondAmount.toString() + " diamonds.";
    }
}
