import { _decorator, Component, Node, Vec3, randomRange } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CloudController')
export class CloudController extends Component {
    private leftXMin: number = -450;
    private leftXMax: number = -400;

    private rightXMin: number = 400;
    private rightXMax: number = 450;

    private minMoveDuration: number = 15;
    private maxMoveDuration: number = 50;

    private targetX: number = 0;        // The X position the cloud is moving towards
    private moveSpeed: number = 0;      // The speed at which the cloud will move

    start() {
        this.setNewTarget();
    }

    update(deltaTime: number) {
        // Move the cloud towards the targetX position
        const currentPos = this.node.getPosition();
        const direction = Math.sign(this.targetX - currentPos.x);  // Determine if moving left or right
        const distanceToMove = direction * this.moveSpeed * deltaTime;

        // Update the cloud's position
        const newPosX = currentPos.x + distanceToMove;

        // Check if the cloud has reached or passed the target X position
        if ((direction > 0 && newPosX >= this.targetX) || (direction < 0 && newPosX <= this.targetX)) {
            // Snap to the target position and set a new target
            this.node.setPosition(new Vec3(this.targetX, currentPos.y, currentPos.z));
            this.setNewTarget();
        } else {
            // Continue moving towards the target
            this.node.setPosition(new Vec3(newPosX, currentPos.y, currentPos.z));
        }
    }

    private setNewTarget() {
        // Check if the cloud is on the left or right side of the screen
        const currentXPos = this.node.position.x;

        if (currentXPos < 0) {
            // Move to a random position on the right
            this.targetX = this.randomRange(this.rightXMin, this.rightXMax);
        } else {
            // Move to a random position on the left
            this.targetX = this.randomRange(this.leftXMin, this.leftXMax);
        }

        // Calculate move speed based on a random move duration
        const moveDuration = this.randomRange(this.minMoveDuration, this.maxMoveDuration);
        this.moveSpeed = Math.abs(this.targetX - currentXPos) / moveDuration;
    }

    private randomRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}
