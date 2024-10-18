import { _decorator, Component, Node, Label, director, RichText, tween, Vec3, UIOpacity } from 'cc';
import { EndlessBGManager } from 'db://assets/Scripts/GamePlay/EndlessBGManager';
import {MoveSideWay} from "db://assets/Scripts/EnemyAndItems/MoveSideWay";
import {SpawnEnemyManager} from "db://assets/Scripts/GamePlay/SpawnEnemyManager";
import {SpawnDiamondManager} from "db://assets/Scripts/GamePlay/SpawnDiamondManager";
import {SpawnItemsManager} from "db://assets/Scripts/GamePlay/SpawnItemsManager";
import {PlayerController} from "db://assets/Scripts/Player/PlayerController";
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
import {GameManager} from "db://assets/Scripts/GamePlay/GameManager";
import {EnemyFXController} from "db://assets/Scripts/EnemyAndItems/EnemyFXController";
import {MissionManager} from "db://assets/Scripts/GameData/MissionManager";
import {MissionProgressBarController} from "db://assets/Scripts/UI/MissionProgressBarController";
import {EndlessGameDataManager} from "db://assets/Scripts/GameData/EndlessGameDataManager";
import {VFXManager} from "db://assets/Scripts/GamePlay/VFXManager";
import {PlayerVFXController} from "db://assets/Scripts/PlayerVFX/PlayerVFXController";
import {PlayerColliderController} from "db://assets/Scripts/Player/PlayerColliderController";
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

    @property(Node)
    private darkLayer: Node;

    @property(Node)
    private endGamePanel: Node;

    @property({ type: [Number] })
    public enemyAmountQueue: number[] = []; // Queue for spawn amounts
    private lastAmountValue: number;

    @property(RichText)
    private missionLabel: RichText;

    @property(MissionProgressBarController)
    private missionProgressBar: MissionProgressBarController;

    @property(Node)
    private missionCompletedText: Node;

    @property(Node)
    private redLayer: Node;

    @property(Node)
    private canvas: Node;

    @property(VFXManager)
    public vfxManager: VFXManager;

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

    // mission related variables
    private currentMissionKey = "currentMission";
    private currentMission = "";
    private missionKeys: string[] = [];
    private missionGetDiamond: number = 0;
    private missionScoreNoBump: number = 0;

    private slowedEnemies: Node[] = [];
    private freezedEnemies: Node[] = [];

    private scheduledCallback: Function | null = null; // To store the reference of the scheduled callback
    private playerHasDied:boolean = false;

    get StageCheckPoint(): number[] {return this.stageCheckPoint;}
    set StageCheckPoint(value: number[]) {this.stageCheckPoint = value;}

    get CurrentStage(): number {return this.currentStage;}

    get ReceivedDiamond(): number {return this.receivedDiamond;}
    set ReceivedDiamond(value: number) {this.receivedDiamond = value;}

    get DoubleDiamond(): boolean {return this.doubleDiamond;}
    set DoubleDiamond(value: boolean) {this.doubleDiamond = value;}

    get Magnet(): boolean {return this.magnet;}
    set Magnet(value: boolean) {this.magnet = value;}

    get Score(): number {return this.score;}
    set Score(value: number) {this.score = value;}

    get OpponentScore(): number {return this.opponentScore;}
    set OpponentScore(value: number) {this.opponentScore = value;}

    get Heart(): Node[] {return this.heart;}
    set Heart(value: Node[]) {this.heart = value;}

    get MissionGetDiamond(): number {return this.missionGetDiamond;}
    set MissionGetDiamond(value: number) {this.missionGetDiamond = value;}

    get MissionScoreWithoutBump(): number {return this.missionScoreNoBump;}
    set MissionScoreWithoutBump(value: number) {this.missionScoreNoBump = value;}

    get CurrentMission(): string {return this.currentMission;}
    set CurrentMission(value: string) {this.currentMission = value;}

    onLoad() {
        // Assign the instance when the script is loaded
        EndlessGameManager.instance = this;

        // Check player's status
        EndlessGameData.getInstance().checkSpinWheelDoubleStatus();
        EndlessGameData.getInstance().checkSpinWheelHealthStatus();

        // Load mission
        this.assignMission(this.missionLabel);
        this.missionKeys = MissionManager.getInstance().MissionKeys;

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
        this.spawnEnemyManager.getComponent(SpawnEnemyManager).spawnEnemy(this.enemyAmountQueue[0], this.hasSpeedBurst);

        // Assign how many hearts the player has
        this.assignHearts();

            // load game over scene
        this.scheduledCallback = () => {
            director.loadScene('GameOver');
        };
    }

    // Function to increment score and update label
    public incrementScore() {
        if (!this.doubleDiamond)
            this.score++;
        else
            this.score += 2;
        this.updateScoreLabel();

        // do scoring without bump mission
        this.doMissionScoreWithoutBump();

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

            if (GameManager.Instance.isEndlessMode)     // endless mode
            {
                // player can't revive and didn't receive any diamond
                if (EndlessGameManager.Instance.ReceivedDiamond == 0 && EndlessGameData.getInstance().ReviveHearts == 0)
                    director.loadScene('GameOver');
                else
                {
                    // revive or double
                    if(this.endGamePanel && this.darkLayer && !this.playerHasDied)
                    {
                        this.playerHasDied = true;
                        this.endGamePanel.active = true;
                        this.darkLayer.active = true;

                        this.endGamePanel.setSiblingIndex(this.darkLayer.children.length - 1);

                        this.scheduleOnce(this.scheduledCallback, 4);
                    } else
                        director.loadScene('GameOver');
                }
            }
            else                                        // challenge mode
            {
                EndlessGameData.getInstance().ChallengeDeadBeforeEnd = true;
                director.loadScene('GameOverChallenge');
            }
        }
    }

    public cancelScheduledGameOver() {
        // Cancel the scheduled callback if it exists
        if (this.scheduledCallback) {
            this.unschedule(this.scheduledCallback);
            this.scheduledCallback = null;
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
        this.playerController.node.getComponent(PlayerVFXController).fxShieldOff();
    }

    playerDoubleOff()
    {
        this.doubleDiamond = false;
        this.playerController.node.getComponent(PlayerVFXController).fxX2Off();
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

                this.freezedEnemies.push(this.enemyQueue[i]);
            }
        }
    }

    unFreezeEnemy()
    {
        this.playerController.node.getComponent(PlayerVFXController).fxFreezeOff();

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

    playerMagnetOff() {
        this.magnet = false;
        this.playerController.node.getComponent(PlayerVFXController).fxMagnetOff();
    }

    assignMission(missionLabel: RichText)   // put 1 argument so the skip mission button and reuse this funcction
    {
        this.currentMission = localStorage.getItem("currentMission");
        switch (this.currentMission)
        {
            case "missionGetDiamond":
                let diamondMissions = JSON.parse(localStorage.getItem("missionGetDiamond"));
                missionLabel.string = "collect " + diamondMissions[0].toString() + " flowers";
                break;
            case "missionScoreNoBump":
                let scoreMissions = JSON.parse(localStorage.getItem("missionScoreNoBump"));
                missionLabel.string = scoreMissions[0].toString() + " points without bump";
                break;
            default:
                missionLabel.string = "no mission found...";
                break;
        }
    }

    doMissionGetDiamond(diamondValue: number)
    {
        // if current mission is getting diamond
        if (this.currentMission == this.missionKeys[0])
        {
            const getDiamondMissionKey = this.missionKeys[0];

            let targetValues = JSON.parse(localStorage.getItem(getDiamondMissionKey));
            if (this.missionGetDiamond + diamondValue < targetValues[0]) {      // still in mission
                this.missionGetDiamond += diamondValue;
                this.missionProgressBar.updateFill();
            } else {                                                        // advance to the next mission
                MissionManager.getInstance().missionCompleted();
                this.tweenMissionCompletedText();
                this.missionGetDiamond = 0;

                // read get diamond mission, shift the array then save the mission
                if (targetValues.length > 1)
                    targetValues.shift();
                localStorage.setItem(getDiamondMissionKey, JSON.stringify(targetValues));

                // change current mission
                MissionManager.getInstance().changeCurrentMission();

                // update the mission label and the filler
                this.assignMission(this.missionLabel);
                this.missionProgressBar.resetProgressBarFiller();
            }
        }
    }

    doMissionScoreWithoutBump()
    {
        // if current mission is scoring without bumb
        if (this.currentMission == this.missionKeys[1])
        {
            const scoreNoBumpMissionKey = this.missionKeys[1];
            let targetValues = JSON.parse(localStorage.getItem(scoreNoBumpMissionKey));

            if (this.missionScoreNoBump + 1 < targetValues[0]) {      // still in mission
                this.missionScoreNoBump++;
                this.missionProgressBar.updateFill();
            } else {
                MissionManager.getInstance().missionCompleted();
                this.tweenMissionCompletedText();
                this.missionScoreNoBump = 0;

                // read get diamond mission, shift the array then save the mission
                if (targetValues.length > 1)
                    targetValues.shift();
                localStorage.setItem(scoreNoBumpMissionKey, JSON.stringify(targetValues));

                // change current mission
                MissionManager.getInstance().changeCurrentMission();

                // update the mission label and the filler
                this.assignMission(this.missionLabel);
                this.missionProgressBar.resetProgressBarFiller();
            }
        }
    }

    tweenMissionCompletedText()
    {
        // tween this missionCompletedText node y down 100 value with tween ease back out
        // then after 1 second tween it back up at its old position
        const originalPosition = this.missionCompletedText.position.clone();
        tween(this.missionCompletedText)
            .to(0.5, { position: new Vec3(originalPosition.x, originalPosition.y - 100, originalPosition.z) }, { easing: 'backOut' })
            .delay(1) // Wait for 1 second
            .to(0.5, { position: originalPosition }, { easing: 'backIn' }) // Move back to original position with ease back in
            .start();
    }

    assignHearts()
    {
        // turn on hearts based on the saved count value;
        const heartCount = EndlessGameData.getInstance().ReviveHearts;
        for (let i = 0; i < this.heart.length; i++)
            this.heart[i].active = (i < heartCount) ? true : false;
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
