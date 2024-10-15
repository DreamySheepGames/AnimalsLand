import { _decorator, Component, Node, tween, Vec3, randomRange } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpecialCloudController')
export class SpecialCloudController extends Component {
    private startXMin: number = 330;
    private startXMax: number = 400;
    private endXPos: number = -330;
    private minMoveDuration: number = 15;
    private maxMoveDuration: number = 50;

    private moveDuration: number = 30;
    private startXPos: number = 330;

    start() {
        this.randomizeValues();
        this.node.setPosition(this.startXPos, this.node.position.y, this.node.position.z);  // Set initial position

        this.startTween();
    }

    private randomizeValues() {
        // Randomize startXPos between startXMin and startXMax
        this.startXPos = randomRange(this.startXMin, this.startXMax);
        // Randomize moveDuration between minMoveDuration and maxMoveDuration
        this.moveDuration = randomRange(this.minMoveDuration, this.maxMoveDuration);
    }

    private startTween() {
        tween(this.node)
            .to(this.moveDuration, { position: new Vec3(this.endXPos, this.node.position.y, this.node.position.z) })
            .call(() => {
                // Reset the node's position to the new random startXPos
                this.randomizeValues();
                this.node.setPosition(this.startXPos, this.node.position.y, this.node.position.z);

                // Start the tween again
                this.startTween();
            })
            .start();
    }
}
