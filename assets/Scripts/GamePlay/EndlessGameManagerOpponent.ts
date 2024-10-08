import { _decorator, Component, Node, Label, director, tween, UIOpacity } from 'cc';
import { EndlessBGManager } from 'db://assets/Scripts/GamePlay/EndlessBGManager';
import {MoveSideWay} from "db://assets/Scripts/EnemyAndItems/MoveSideWay";
import {OpponentController} from "db://assets/Scripts/Opponent/OpponentController";
import {OpponentSpawnDiamondManager} from "db://assets/Scripts/Opponent/Managers/OpponentSpawnDiamondManager";
import {OpponentSpawnItemsManager} from "db://assets/Scripts/Opponent/Managers/OpponentSpawnItemsManager";
import {OpponentSpawnEnemyManager} from "db://assets/Scripts/Opponent/Managers/OpponentSpawnEnemyManager";
import {EnemyFXController} from "db://assets/Scripts/EnemyAndItems/EnemyFXController";
const { ccclass, property } = _decorator;

@ccclass('EndlessGameManagerOpponent')
export class EndlessGameManagerOpponent extends Component {
    private static instance: EndlessGameManagerOpponent;

    public static get Instance(): EndlessGameManagerOpponent {
        if (!this.instance) {
            console.error("EndlessGameManagerOpponent instance is not initialized in the scene.");
        }
        return this.instance;
    }

    @property({ type: Label })
    private scoreLabel: Label; // Reference to the score label

    private score: number = 0; // Initial score
    private opponentScore: number = 0; // Initial score

    @property({type: OpponentController})
    private playerController: OpponentController;

    @property(Node)
    private spawnEnemyManager: Node;

    @property({ type: OpponentSpawnDiamondManager })
    private spawnDiamondManager: OpponentSpawnDiamondManager;

    @property({ type: OpponentSpawnItemsManager })
    private spawnItemsManager: OpponentSpawnItemsManager;

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
    private isGameOver: boolean = false;

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

    get IsGameOver(): boolean {
        return this.isGameOver;
    }

    @property(Node)
    private redLayer: Node;

    @property(Node)
    private canvas: Node;

    onLoad() {
        //console.log(this.endlessBGManager.getComponent(EndlessBGManager).LevelSteps);

        // Assign the instance when the script is loaded
        EndlessGameManagerOpponent.instance = this;

        // Get the last value of the enemy amount array
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
        this.spawnEnemyManager.getComponent(OpponentSpawnEnemyManager).spawnEnemy(this.enemyAmountQueue[0], this.hasSpeedBurst);
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
            this.isGameOver = true;
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
            this.spawnEnemyManager.getComponent(OpponentSpawnEnemyManager).spawnEnemy(this.enemyAmountQueue[0], this.hasSpeedBurst);
        else
            this.spawnEnemyManager.getComponent(OpponentSpawnEnemyManager).spawnEnemy(this.lastAmountValue, this.hasSpeedBurst);

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
                this.enemyQueue[i].getComponent(EnemyFXController).freezeFXOn();
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

    public hitVFX() {
        if (this.redLayer) {
            // Ensure the redLayer node is fully visible
            this.redLayer.active = true;

            this.canvas.setSiblingIndex(this.redLayer.children.length - 1);

            // Get the UIOpacity component from the redLayer node
            const uiOpacity = this.redLayer.getComponent(UIOpacity);
            if (uiOpacity) {
                // Tween the opacity (alpha) from 0 to 70% (178) and then back to 0
                tween(uiOpacity)
                    .to(0.075, { opacity: 178 })  // 70% opacity in the first 0.075s
                    .to(0.075, { opacity: 0 })    // Back to 0 opacity in the next 0.075s
                    .start();
            } else {
                console.error("UIOpacity component not found on redLayer.");
            }
        }
    }
}
