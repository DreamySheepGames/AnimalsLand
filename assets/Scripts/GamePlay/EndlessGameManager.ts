import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EndlessGameManager')
export class EndlessGameManager extends Component {
    private static instance: EndlessGameManager;

    public static get Instance(): EndlessGameManager {
        if (!this.instance) {
            console.error("EndlessGameManager instance is not initialized in the scene.");
        }
        return this.instance;
    }

    @property({ type: Label })
    private scoreLabel: Label; // Reference to the score label

    private score: number = 0; // Initial score

    onLoad() {
        // Assign the instance when the script is loaded
        EndlessGameManager.instance = this;
    }

    // Function to increment score and update label
    public incrementScore() {
        this.score += 1;
        this.updateScoreLabel();
    }

    // Update the score label with the current score
    private updateScoreLabel() {
        if (this.scoreLabel) {
            this.scoreLabel.string = this.score.toString();
        }
        else
        {
            console.log("null");
        }
    }
}
