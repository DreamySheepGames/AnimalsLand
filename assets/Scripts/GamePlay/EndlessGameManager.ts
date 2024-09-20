import { _decorator, Component, Node, Label, director } from 'cc';
import { EndlessBGManager } from 'db://assets/Scripts/GamePlay/EndlessBGManager';
import {MoveSideWay} from "db://assets/Scripts/EnemyAndItems/MoveSideWay";
import {SpawnEnemyManager} from "db://assets/Scripts/GamePlay/SpawnEnemyManager";
import {SpawnDiamondManager} from "db://assets/Scripts/GamePlay/SpawnDiamondManager";
import {SpawnItemsManager} from "db://assets/Scripts/GamePlay/SpawnItemsManager";
import {PlayerController} from "db://assets/Scripts/Player/PlayerController";
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
import {GameManager} from "db://assets/Scripts/GamePlay/GameManager";
import {EnemyFXController} from "db://assets/Scripts/EnemyAndItems/EnemyFXController";
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
    private opponentScore: number = 0; // Initial score

    @property({type: PlayerController})
    private playerController: PlayerController;

    @property(Node)
    private spawnEnemyManager: Node;

    @property({ type: SpawnDiamondManager })
    private spawnDiamondManager: SpawnDiamondManager;

    @property({ type: SpawnItemsManager })
    private spawnItemsManager: SpawnItemsManager;

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
    private receivedDiamond = 0;
    private doubleDiamond: boolean = false;
    private magnet: boolean = false;

    private slowedEnemies: Node[] = [];
    private freezedEnemies: Node[] = [];

    get StageCheckPoint(): number[] {
        return this.stageCheckPoint;
    }

    set StageCheckPoint(value: number[]) {
        this.stageCheckPoint = value;
    }

    get CurrentStage(): number {
        return this.currentStage;
    }

    get ReceivedDiamond(): number {
        return this.receivedDiamond;
    }

    set ReceivedDiamond(value: number) {
        this.receivedDiamond = value;
    }

    get DoubleDiamond(): boolean {
        return this.doubleDiamond;
    }

    set DoubleDiamond(value: boolean) {
        this.doubleDiamond = value;
    }

    get Magnet(): boolean {
        return this.magnet;
    }

    set Magnet(value: boolean) {
        this.magnet = value;
    }

    get Score(): number {
        return this.score;
    }

    set Score(value: number) {
        this.score = value;
    }

    get OpponentScore(): number {
        return this.opponentScore;
    }

    set OpponentScore(value: number) {
        this.opponentScore = value;
    }

    onLoad() {
        //console.log(this.endlessBGManager.getComponent(EndlessBGManager).LevelSteps);

        // Assign the instance when the script is loaded
        EndlessGameManager.instance = this;

        // Get the last value of the enemy amount array
        this.lastAmountValue = this.enemyAmountQueue[this.enemyAmountQueue.length - 1];

        // Get the checkpoints from EndlessBGManager's LevelSteps
        for (let i = 0; i < this.endlessBGManager.getComponent(EndlessBGManager).LevelSteps.length; i++)
            this.stageCheckPoint[i] = this.endlessBGManager.getComponent(EndlessBGManager).LevelSteps[i];

        this.lastValueStageCheckPoint = this.stageCheckPoint[this.stageCheckPoint.length - 1]
    }

    start()
    {
        //GameManager.Instance.isEndlessMode = false;

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

        // after increase the score and have the enemy spawned positions, we spawn diamond, then an item
        if (this.currentStage != 1)
        {
            this.spawnDiamondManager.spawnDiamond();
            this.spawnItemsManager.spawnItems();
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
            // get play data of the player
            const endlessGameData = EndlessGameData.getInstance();
            endlessGameData.Score = this.score;
            endlessGameData.ReceivedDiamond = this.receivedDiamond;

            if (GameManager.Instance.isEndlessMode)
                director.loadScene('GameOver');
            else
            {
                EndlessGameData.getInstance().ChallengeDeadBeforeEnd = true;
                director.loadScene('GameOverChallenge');
            }
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

    diamondIncrement(value: number)
    {
        if (!this.doubleDiamond)
            this.receivedDiamond += value;
        else
            this.receivedDiamond += 2 * value;
    }

    playerInvincibleOff()
    {
        this.playerController.turnOffInvincible();
    }

    slowdownEnemy()
    {
        // loop through all enemy in the scene to half their speed
        for (let i = 0; i < this.enemyQueue.length; i++) {
            if (this.enemyQueue[i]) {
                this.enemyQueue[i].getComponent(MoveSideWay).IsSlowdown = true;
                this.slowedEnemies.push(this.enemyQueue[i]);
            }
        }
    }

    returnEnemySpeed()
    {
        for (let i = 0; i < this.enemyQueue.length; i++) {
            if (this.enemyQueue[i])
                this.enemyQueue[i].getComponent(MoveSideWay).IsSlowdown = false;
        }

        while (this.slowedEnemies.length > 0) {
            const enemy = this.slowedEnemies.shift(); // Remove the first element

            // Ensure enemy is valid and not destroyed
            if (enemy && enemy.isValid) {
                const moveSideWay = enemy.getComponent(MoveSideWay);

                if (moveSideWay) {
                    moveSideWay.IsSlowdown = false;
                }
            }
        }
    }

    freezeEnemy()
    {
        // loop through all enemy in the scene to freeze them
        for (let i = 0; i < this.enemyQueue.length; i++) {
            if (this.enemyQueue[i]) {
                this.enemyQueue[i].getComponent(MoveSideWay).IsFreeze = true;
                if (this.enemyQueue[i].getComponent(EnemyFXController))
                    this.enemyQueue[i].getComponent(EnemyFXController).freezeFXOn()
                    //console.log("not null");
                else
                    console.log("FUCK!!!!!!!!!!");
                this.freezedEnemies.push(this.enemyQueue[i]);
            }
        }
    }

    unFreezeEnemy()
    {
        // loop through all enemy in the scene to freeze them
        for (let i = 0; i < this.enemyQueue.length; i++) {
            if (this.enemyQueue[i])
            {
                this.enemyQueue[i].getComponent(MoveSideWay).IsFreeze = false;
                this.enemyQueue[i].getComponent(EnemyFXController).freezeFXOff();
            }
        }

        while (this.freezedEnemies.length > 0) {
            const enemy = this.freezedEnemies.shift(); // Remove the first element

            // Ensure enemy is valid and not destroyed
            if (enemy && enemy.isValid) {
                const moveSideWay = enemy.getComponent(MoveSideWay);
                enemy.getComponent(EnemyFXController).freezeFXOff();
                if (moveSideWay) {
                    moveSideWay.IsFreeze = false;
                }
            }
        }
    }
}
