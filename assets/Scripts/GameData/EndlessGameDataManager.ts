import { _decorator, Component, Node, RichText, tween } from 'cc';
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
const { ccclass, property } = _decorator;

@ccclass('EndlessGameDataManager')
export class EndlessGameDataManager extends Component {
    @property(RichText) scoreLabel: RichText;
    @property(RichText) diamondLabel: RichText;

    private scoreLabelUpdateDuration: number = 0.7;           // score will be running from 0 to target score in x seconds
    private diamondLabelUpdateDuration: number = 1.2;       // amount of diamond will be running from 0 to target amount in x seconds

    onLoad() {
        const gameData = EndlessGameData.getInstance();

        // Update UI elements with score and diamond count
        // this.scoreLabel.string = "Score: <color=#FFFFFF>" + gameData.Score.toString() + "</color>";
        // this.diamondLabel.string = gameData.ReceivedDiamond.toString();

        // Animate score from 0 to target score
        this.animateValue(0, gameData.Score, this.scoreLabelUpdateDuration, (value) => {
            this.scoreLabel.string = `Score: <color=#FFFFFF>${Math.floor(value)}</color>`;
        });

        // Animate diamonds from 0 to target amount
        this.animateValue(0, gameData.ReceivedDiamond, this.diamondLabelUpdateDuration, (value) => {
            this.diamondLabel.string = `${Math.floor(value)}`;
        });
    }

    start() {
        EndlessGameData.getInstance().checkSpinWheelDoubleStatus();
        EndlessGameData.getInstance().checkSpinWheelHealthStatus();
        this.saveReceivedDiamond();
    }

    // Helper function to animate value from start to end over a given duration
    private animateValue(start: number, end: number, duration: number, updateLabel: (value: number) => void) {
        const obj = { value: start };  // Define the object with a 'value' property
        tween(obj)
            .to(duration, { value: end }, {
                onUpdate: () => {
                    updateLabel(obj.value); // Update the label with the current 'value'
                }
            })
            .start();
    }

    saveReceivedDiamond() {
        const gameData = EndlessGameData.getInstance();

        // Retrieve the current saved diamonds from localStorage, if any
        const savedDiamonds = localStorage.getItem('receivedDiamonds');

        // Convert the saved value to a number, defaulting to 0 if it's null
        const currentSavedDiamonds = savedDiamonds ? parseInt(savedDiamonds, 10) : 0;

        // Add the current ReceivedDiamond value to the saved value
        const updatedDiamonds = currentSavedDiamonds + gameData.ReceivedDiamond;

        // Save the updated total back to localStorage
        localStorage.setItem('receivedDiamonds', updatedDiamonds.toString());

        //UserDataManager.getInstance().updateUserData();
    }
}