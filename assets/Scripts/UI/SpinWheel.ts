import { _decorator, Component, Node, tween, Vec3, RichText, Event, Button, sys } from 'cc';
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

    @property(Node)
    private buttonNoThanks: Node;

    @property(Node)
    private spinIcon: Node;

    @property(RichText)
    private spinLabel: RichText;

    private smallDiamondPackage: number = 500;
    private mediumDiamondPackage: number = 1000;
    private hugeDiamondPackage: number = 5000;

    private countdownDuration: number = 60; // 60 seconds for testing, change to 7200 for 2 hours in production

    onEnable()
    {
        // Reset the wheel's angle back to 0
        this.wheel.setRotationFromEuler(0, 0, 0);
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
                this.prize(randomStop);
            })
            .start();
    }

    private prize(prizeIndex: number)
    {
        switch (prizeIndex)
        {
            case 0:     // small diamond package
                this.saveReceivedDiamond(this.smallDiamondPackage);
                break;

            case 1:     // unlock premium character 1
                this.unlockPremiumCharacter();
                break;

            case 2:     // +1 heart
                this.incrementReviveHeart();
                break;

            case 3:     // unlock premium character 2
                this.unlockPremiumCharacter();
                break;

            case 4:     // huge diamond package
                this.saveReceivedDiamond(this.hugeDiamondPackage);
                break;

            case 5:     // unlock premium character 3
                this.unlockPremiumCharacter();
                break;

            case 6:     // medium premium character 3
                this.saveReceivedDiamond(this.mediumDiamondPackage);
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
        const savedReviveHearts = localStorage.getItem('revivedHeartsCount');
        const currentSavedHearts = savedReviveHearts ? parseInt(savedReviveHearts, 10) : 3;
        if (currentSavedHearts < 5)
        {
            const updatedReviveHearts = currentSavedHearts + 1;
            localStorage.setItem('revivedHeartsCount', updatedReviveHearts.toString());

            for (let i = 0; i < 5; i++)
            {
                this.reviveHearts[i].active = i < parseInt(localStorage.getItem('revivedHeartsCount'), 10) ? true : false;
            }
        }
    }

    spinWheelDoubleDiamondOn()
    {
        EndlessGameData.getInstance().IsSpinWheelDiamondDouble = true;

        // turn off the flag after 1 minute (1 minute is for testing, in game it would be 24 hours)
        // Get the current timestamp and save it in localStorage
        const now = Date.now(); // This gives you the current time in milliseconds
        localStorage.setItem('spinWheelDoubleStartTime', now.toString());

        // Optionally log for testing
        //console.log("Spin wheel double diamond enabled. Timestamp saved:", now);
    }

    unlockPremiumCharacter() {
        const premiumCharacterIDs = [24, 25, 26, 27, 28, 29];

        // Retrieve characterID array from localStorage
        let characterIDs = JSON.parse(localStorage.getItem('characterIDs') || '[]');

        // Filter out premium characters that are already unlocked
        const unlockedPremiumIDs = characterIDs.filter(id => premiumCharacterIDs.indexOf(id) !== -1);

        // If all premium characters are already unlocked, do nothing
        if (unlockedPremiumIDs.length === premiumCharacterIDs.length) {
            console.log('All premium characters are already unlocked.');
        } else {
            // Randomly select a premium character that hasn't been unlocked
            let newCharacterID: number;
            do {
                newCharacterID = premiumCharacterIDs[Math.floor(Math.random() * premiumCharacterIDs.length)];
            } while (characterIDs.indexOf(newCharacterID) !== -1); // Repeat if ID is already unlocked

            // Add the new premium character ID to the characterID array
            characterIDs.push(newCharacterID);

            // Save the updated characterID array back to localStorage
            localStorage.setItem('characterIDs', JSON.stringify(characterIDs));

            console.log('Unlocked new premium character:', newCharacterID);
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
        let remainingTime = Math.max(0, endTime - now); // Get remaining time

        if (remainingTime > 0) {
            // Update the countdown display
            const seconds = Math.floor(remainingTime / 1000) % 60;
            const minutes = Math.floor(remainingTime / (1000 * 60)) % 60;
            const hours = Math.floor(remainingTime / (1000 * 60 * 60));

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
}