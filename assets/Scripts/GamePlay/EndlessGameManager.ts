import { _decorator, Component, Node, Label, director } from 'cc';
import { EndlessBGManager } from 'db://assets/Scripts/GamePlay/EndlessBGManager';
import {MoveSideWay} from "db://assets/Scripts/EnemyAndItems/MoveSideWay";
import {SpawnEnemyManager} from "db://assets/Scripts/GamePlay/SpawnEnemyManager";
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

    @property(Node)
    private spawnEnemyManager: Node;

    @property(Node)
    private endlessBGManager: Node;

    @property([Node])
    private heart: Node[] = [];

    @property({ type: [Number] })
    public enemyAmountQueue: number[] = []; // Queue for spawn amounts
    private lastAmountValue: number;

    public enemyQueue: Node[] = []; // Queue for enemies
    private stageCheckPoint: number[] = []; // Queue for stage checkpoints
    private lastValueStageCheckPoint: number;
    private targetPoint: number = 0;
    private stageToTurnOnSpeedBurst: number = 5;
    private currentStage: number = 1;
    private hasSpeedBurst: boolean = false;

    get StageCheckPoint(): number[] {
        return this.stageCheckPoint;
    }

    set StageCheckPoint(value: number[]) {
        this.stageCheckPoint = value;
    }

    onLoad() {
        //console.log(this.endlessBGManager.getComponent(EndlessBGManager).LevelSteps);

        // Assign the instance when the script is loaded
        EndlessGameManager.instance = this;

        // Get the last value of the enemy amount array
        console.log(this.enemyAmountQueue);
        this.lastAmountValue = this.enemyAmountQueue[this.enemyAmountQueue.length - 1];

        // Get the checkpoints from EndlessBGManager's LevelSteps
        for (let i = 0; i < this.endlessBGManager.getComponent(EndlessBGManager).LevelSteps.length; i++)
            this.stageCheckPoint[i] = this.endlessBGManager.getComponent(EndlessBGManager).LevelSteps[i];

        this.lastValueStageCheckPoint = this.stageCheckPoint[this.stageCheckPoint.length - 1]
    }

    start()
    {
        // Initialize targetPoint with the first checkpoint
        this.targetPoint = this.stageCheckPoint.shift();

        // Spawn the first enemy
        this.spawnEnemyManager.getComponent(SpawnEnemyManager).spawnEnemy(this.enemyAmountQueue[0], this.hasSpeedBurst);
    }

    // Function to increment score and update label
    public incrementScore() {
        this.score++;
        this.updateScoreLabel();

        // Check if we need to go to next stage
        if (this.checkIfAtTargetPoint()) {
            this.goToNextStage();
        }
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

    private checkIfAtTargetPoint(): boolean {
        // Logic to check if the player has reached the target point
        return this.score == this.targetPoint;
    }

    public goToNextStage() {
        this.currentStage++;

        if (this.currentStage >= this.stageToTurnOnSpeedBurst)
            this.hasSpeedBurst = true;

        var spawnAmount;
        // Pop the next spawn amount
        if (this.enemyAmountQueue.length > 0)
            spawnAmount = this.enemyAmountQueue.shift();
        else
            spawnAmount = this.lastAmountValue;

        if (spawnAmount) {
            // Loop through spawn amount and pop enemies from the queue
            for (let i = 0; i < spawnAmount; i++) {
                const enemy = this.enemyQueue.shift();
                if (enemy) {
                    const enemyComponent = enemy.getComponent(MoveSideWay);
                    if (enemyComponent) {
                        enemyComponent.IsMoveSideWay = false; // Turn off isMoveSideWay flag
                    }
                }
            }
        }

        // spawn enemies
        // if there are still assigned amount then we use that amount, else we use the last amount value
        if (this.enemyAmountQueue.length > 0)
            this.spawnEnemyManager.getComponent(SpawnEnemyManager).spawnEnemy(this.enemyAmountQueue[0], this.hasSpeedBurst);
        else
            this.spawnEnemyManager.getComponent(SpawnEnemyManager).spawnEnemy(this.lastAmountValue, this.hasSpeedBurst);

        // Update the next target point
        if (this.stageCheckPoint.length > 0) {
            this.targetPoint += this.stageCheckPoint.shift();
        }
        else
            this.targetPoint += this.lastValueStageCheckPoint;
    }
}
