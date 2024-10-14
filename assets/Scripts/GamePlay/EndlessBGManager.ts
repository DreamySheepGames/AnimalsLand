import { _decorator, Component, Node, Vec3, view, UITransform, tween, Tween } from 'cc';
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
import {GameManager} from "db://assets/Scripts/GamePlay/GameManager";
const { ccclass, property } = _decorator;

@ccclass('EndlessBGManager')
export class EndlessBGManager extends Component {

    // private static instance: EndlessBGManager;
    //
    // public static get Instance(): EndlessBGManager {
    //     if (!this.instance) {
    //         console.error("EndlessBGManager instance is not initialized in the scene.");
    //     }
    //     return this.instance;
    // }

    @property({ type: [Node] })
    private backgrounds: Node[] = []; // Array for portrait backgrounds

    @property({ type: [Number] })
    private levelSteps: number[] = []; // Array for level steps for each background

    private currentBackgroundIndex: number = 0;
    private nextBackgroundIndex: number = 1; // Reference to the next background
    private lastBackgroundIndex: number = 2; // Reference to the next background
    private screenHeight: number;
    private screenWidth: number;

    private currentTween1: Tween<Node> = null; // Reference to the active tween (tween current background)
    private currentTween2: Tween<Node> = null; // Reference to the active tween (tween next background)
    private currentTween3: Tween<Node> = null; // Reference to the active tween (tween next background)
    private tweenSpeed = 0.25;                  // IMPORTANT NOTE: tween speed must be <= player tween move speed fast * 2;
    private lastStepValue: number;
    private yToDisactivate = 4;

    private hasDoneAllLevel = false;

    get LevelSteps(): number[] {
        return this.levelSteps;
    }

    onLoad() {
        // this.screenHeight = view.getDesignResolutionSize().height;
        // this.screenWidth = view.getDesignResolutionSize().width;
        this.screenHeight = 667;
        //this.screenWidth = 105;
        this.screenWidth = 375;
        this.setBackgroundAnchors();

        // Store the last step value from levelSteps for future use
        this.lastStepValue = this.levelSteps[this.levelSteps.length - 1];
    }

    private setBackgroundAnchors() {
        // Set anchors for all backgrounds
        this.backgrounds.forEach((background) => {
            const bgTransform = background.getComponent(UITransform);
            if (bgTransform) {
                bgTransform.anchorX = 0.5;
                bgTransform.anchorY = 0.5;
                bgTransform.height = this.screenHeight; // Or any fixed width you want
                bgTransform.width = this.screenWidth;
            }
        });
    }

    public moveBackground() {
        const currentBG = this.backgrounds[this.currentBackgroundIndex];
        const nextBG = this.backgrounds[this.nextBackgroundIndex];
        const lastBG = this.backgrounds[this.lastBackgroundIndex];

        // decide which move step to use
        var currentSteps: number;
        if (!this.hasDoneAllLevel)
            currentSteps = this.levelSteps[this.currentBackgroundIndex];    // Use step respectively
        else
            currentSteps = this.lastStepValue;                              // Use last step if beyond steps array

        // create move distance from move step
        const moveDistance = this.screenHeight / currentSteps;

        // create target postitions to move 2 backgrounds simultaneously
        const currentTargetPos = new Vec3(currentBG.position.x, currentBG.position.y - moveDistance, currentBG.position.z);
        const nextTargetPos = new Vec3(nextBG.position.x, nextBG.position.y - moveDistance, nextBG.position.z);
        const lastTargetPos = new Vec3(lastBG.position.x, lastBG.position.y - moveDistance, lastBG.position.z);

        // Move both current and next background
        this.currentTween1 = tween(currentBG)
            .to(this.tweenSpeed, { position: currentTargetPos }, { easing: "circOut" })
            .start();

        this.currentTween2 = tween(nextBG)
            .to(this.tweenSpeed, { position: nextTargetPos }, { easing: "circOut" })
            .call(() => {
                // Check if the current background is out of view
                if (currentBG.position.y + currentBG.getComponent(UITransform).height <= this.yToDisactivate) {
                    this.toggleAndAddNewBG();
                }
            })
            .start();

        this.currentTween3 = tween(lastBG)
            .to(this.tweenSpeed, {position: lastTargetPos }, {easing: "circOut" })
            .start();
    }

    private toggleAndAddNewBG() {
        const currentBG = this.backgrounds[this.currentBackgroundIndex];
        currentBG.active = false; // Deactivate the background that moved out

        // Update the indices
        this.currentBackgroundIndex = this.nextBackgroundIndex;

        // Check if the player has done all level
        if (this.currentBackgroundIndex + 1 >= this.backgrounds.length)
            this.hasDoneAllLevel = true;

        this.nextBackgroundIndex = (this.nextBackgroundIndex + 1) % this.backgrounds.length;
        this.lastBackgroundIndex = this.nextBackgroundIndex + 1;
        if (this.lastBackgroundIndex == this.backgrounds.length)
            this.lastBackgroundIndex = 2;

        const nextBG = this.backgrounds[this.nextBackgroundIndex];
        const lastBG = this.backgrounds[this.lastBackgroundIndex];


        nextBG.setPosition(nextBG.position.x, this.screenHeight, 0); // Position above the current one
        nextBG.active = true; // Reactivate the new background

        lastBG.setPosition(lastBG.position.x, this.screenHeight * 2, 0);
        lastBG.active = true;
    }
}
