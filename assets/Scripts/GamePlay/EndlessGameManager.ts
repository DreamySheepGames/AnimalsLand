import { _decorator, Component, Node, Label, director } from 'cc';
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

    @property([Node])
    private heart: Node[] = [];

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

    public decreaseHeart() {
        if (this.heart && this.heart.length > 0) {
            for (let i = 0; i < this.heart.length; i++) {
                if (this.heart[i].active) {
                    this.heart[i].active = false;
                    this.checkIfGameOver();
                    break; // Exit the loop immediately after turning off the heart
                }
            }
        }
    }

    private checkIfGameOver()
    {
        var isGameOver = true;

        // if there's an active heart then the game is not over
        if (this.heart && this.heart.length > 0)
        {
            this.heart.forEach(item => {
               if (item.active == true)
                   isGameOver = false;
            });
        }

        // if is game over then open game over scene
        if (isGameOver)
        {
            director.loadScene('GameOver');
        }
    }
}
