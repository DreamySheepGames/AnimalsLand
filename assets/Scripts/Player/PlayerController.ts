import { _decorator, Component, Node, Vec3, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    private hasGoneUp: boolean = false; // To track direction (player at bottom: false, player at top: true)
    private isMoving: boolean = false;  // To track if the player is moving

    @property({ type: Vec3 })
    private startPosition: Vec3 = new Vec3(0, -267, 0);

    @property({ type: Vec3 })
    private targetPosition: Vec3 = new Vec3(0, 267, 0);

    @property
    private moveSpeed: number = 0.25;

    @property
    private moveSpeedFast: number = 0.15;

    private isInvincible: boolean = false;

    private currentTween: Tween<Node> = null; // Reference to the active tween

    start() {
        this.node.setPosition(this.startPosition); // Set initial position
    }

    public togglePosition() {
        if (!this.isMoving) {                       // anti spam tap
            if (this.isInvincible) {
                this.hasGoneUp ? this.goDownFast() : this.goUpFast();
            } else {
                this.hasGoneUp ? this.goDown() : this.goUp();
            }

            // change direction
            this.hasGoneUp = !this.hasGoneUp;
        }
    }

    private moveToPosition(targetPosition: Vec3, speed: number) {
        this.isMoving = true; // Set moving flag

        this.currentTween = tween(this.node)
            .to(speed, { position: targetPosition })
            .call(() => {
                this.isMoving = false;  // Reset moving flag when done
            })
            .start();
    }

    private goUp() {
        this.moveToPosition(this.targetPosition, this.moveSpeed);
    }

    private goDown() {
        this.moveToPosition(this.startPosition, this.moveSpeed);
    }

    private goUpFast() {
        this.moveToPosition(this.targetPosition, this.moveSpeedFast);
    }

    private goDownFast() {
        this.moveToPosition(this.startPosition, this.moveSpeedFast);
    }
}
