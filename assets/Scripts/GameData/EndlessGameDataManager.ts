import { _decorator, Component, Node, RichText } from 'cc';
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
const { ccclass, property } = _decorator;

@ccclass('EndlessGameDataManager')
export class EndlessGameDataManager extends Component {
    @property(RichText)
    scoreLabel: RichText;

    @property(RichText)
    diamondLabel: RichText;

    onLoad() {
        const gameData = EndlessGameData.getInstance();

        // Update UI elements with score and diamond count
        this.scoreLabel.string = "Score: <color=#EE6E69>" + gameData.Score.toString() + "</color>";
        this.diamondLabel.string = gameData.ReceivedDiamond.toString();
    }

    start() {
        EndlessGameData.getInstance().checkSpinWheelDoubleStatus();
        this.saveReceivedDiamond();
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
    }
}