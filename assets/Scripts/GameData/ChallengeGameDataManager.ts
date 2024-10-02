import { _decorator, Component, Node, RichText } from 'cc';
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
const { ccclass, property } = _decorator;

@ccclass('ChallengeGameDataManager')
export class ChallengeGameDataManager extends Component {
    @property(RichText)
    private playerScoreLabel: RichText;

    @property(RichText)
    private opponentScoreLabel: RichText;

    @property(RichText)
    private playerLoseScoreLabel: RichText;

    @property(RichText)
    private gemCountLabel: RichText;

    @property(RichText)
    private winLabel: RichText;

    @property(RichText)
    private loseLabel: RichText;

    @property(RichText)
    private drawLabel: RichText;

    @property(RichText)
    private gameOverLabel: RichText;

    onLoad()
    {
        const challengeGameData = EndlessGameData.getInstance();
        challengeGameData.checkSpinWheelDoubleStatus();
        challengeGameData.checkSpinWheelHealthStatus();

        // assign scores to labels
        this.playerScoreLabel.string = "Your score: <color=#EE6E69>" + challengeGameData.Score.toString() + "</color>";
        this.playerLoseScoreLabel.string = "Score: <color=#EE6E69>" + challengeGameData.Score.toString() + "</color>";
        this.opponentScoreLabel.string = "Enemy score: <color=#EE6E69>" + challengeGameData.OpponentScore.toString() + "</color>";

        // decide which label will appear
        let deadBeforeEnd = challengeGameData.ChallengeDeadBeforeEnd;
        this.gameOverLabel.node.active = deadBeforeEnd;
        this.playerLoseScoreLabel.node.active = deadBeforeEnd;
        this.playerScoreLabel.node.active = !deadBeforeEnd;
        this.opponentScoreLabel.node.active = !deadBeforeEnd;

        // diamond count label
        this.gemCountLabel.string = EndlessGameManager.Instance.ReceivedDiamond.toString();
        this.saveReceivedDiamond();

        if (challengeGameData.Score < challengeGameData.OpponentScore && !deadBeforeEnd)
        {
            this.winLabel.node.active = false;
            this.loseLabel.node.active = true;
            this.drawLabel.node.active = false;
        }
        else
        {
            if (challengeGameData.Score > challengeGameData.OpponentScore && !deadBeforeEnd)
            {
                this.winLabel.node.active = true;
                this.loseLabel.node.active = false;
                this.drawLabel.node.active = false;
            }
            else
            {
                if (!deadBeforeEnd)
                {
                    this.winLabel.node.active = false;
                    this.loseLabel.node.active = false;
                    this.drawLabel.node.active = true;
                }
            }
        }
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


