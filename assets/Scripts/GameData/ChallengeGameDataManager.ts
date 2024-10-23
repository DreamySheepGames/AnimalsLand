import { _decorator, Component, Node, RichText, tween } from 'cc';
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
import {UserDataManager} from "db://assets/Scripts/GameData/UserDataManager";
import {AudioManager} from "db://assets/Scripts/Audio/AudioManager";
const { ccclass, property } = _decorator;

@ccclass('ChallengeGameDataManager')
export class ChallengeGameDataManager extends Component {
    @property(RichText) private playerScoreLabel: RichText;
    @property(RichText) private opponentScoreLabel: RichText;
    @property(RichText) private playerLoseScoreLabel: RichText;
    @property(RichText) private gemCountLabel: RichText;
    @property(Node) private winLabel: Node;
    @property(Node) private loseLabel: Node;
    @property(RichText) private drawLabel: RichText;
    @property(Node) private gameOverLabel: Node;

    private scoreLabelUpdateDuration: number = 0.7;           // score will be running from 0 to target score in x seconds
    private opponentScoreLabelUpdateDuration: number = 0.95;           // score will be running from 0 to target score in x seconds
    private diamondLabelUpdateDuration: number = 1;

    onLoad()
    {
        const challengeGameData = EndlessGameData.getInstance();
        challengeGameData.checkSpinWheelDoubleStatus();
        challengeGameData.checkSpinWheelHealthStatus();

        // assign scores to labels
        // this.playerScoreLabel.string = "Your score: <color=#FFFFFF>" + challengeGameData.Score.toString() + "</color>";
        this.animateValue(0, challengeGameData.Score, this.scoreLabelUpdateDuration, (value) => {
            this.playerScoreLabel.string = `Your score: <color=#FFFFFF>${Math.floor(value)}</color>`;
        });

        // this.playerLoseScoreLabel.string = "Score: <color=#FFFFFF>" + challengeGameData.Score.toString() + "</color>";
        this.animateValue(0, challengeGameData.Score, this.scoreLabelUpdateDuration, (value) => {
            this.playerLoseScoreLabel.string = `Score: <color=#FFFFFF>${Math.floor(value)}</color>`;
        });

        // this.opponentScoreLabel.string = "Enemy score: <color=#FFFFFF>" + challengeGameData.OpponentScore.toString() + "</color>";
        this.animateValue(0, challengeGameData.OpponentScore, this.opponentScoreLabelUpdateDuration, (value) => {
            this.opponentScoreLabel.string = `Enemy score: <color=#FFFFFF>${Math.floor(value)}</color>`;
        });

        // decide which label will appear
        let deadBeforeEnd = challengeGameData.ChallengeDeadBeforeEnd;
        this.gameOverLabel.active = deadBeforeEnd;
        this.playerLoseScoreLabel.node.active = deadBeforeEnd;
        this.playerScoreLabel.node.active = !deadBeforeEnd;
        this.opponentScoreLabel.node.active = !deadBeforeEnd;

        // diamond count label
        //this.gemCountLabel.string = EndlessGameManager.Instance.ReceivedDiamond.toString();
        this.animateValue(0, EndlessGameManager.Instance.ReceivedDiamond, this.diamondLabelUpdateDuration, (value) => {
            this.gemCountLabel.string = `${Math.floor(value)}`;
        });

        if (challengeGameData.Score < challengeGameData.OpponentScore && !deadBeforeEnd)        // lose
        {
            this.winLabel.active = false;
            this.loseLabel.active = true;
            this.drawLabel.node.active = false;
        }
        else
        {
            if (challengeGameData.Score > challengeGameData.OpponentScore && !deadBeforeEnd)    // win
            {
                this.winLabel.active = true;
                this.loseLabel.active = false;
                this.drawLabel.node.active = false;
            }
            else
            {
                if (!deadBeforeEnd)                                                             // draw
                {
                    this.winLabel.active = false;
                    this.loseLabel.active = false;
                    this.drawLabel.node.active = true;

                }
            }
        }
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

    start()
    {
        if (this.winLabel.active == true || this.drawLabel.node.active == true) {
            AudioManager.Instance.PauseMusic();
            AudioManager.Instance.playSFX(AudioManager.Instance.winSFX);
        }
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

        UserDataManager.getInstance().updateUserData();
    }
}


