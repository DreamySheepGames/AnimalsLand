import { _decorator, Component, Node, Vec3, tween, Tween, RigidBody2D, Vec2 } from 'cc';
import { EndlessGameManager } from "db://assets/Scripts/GamePlay/EndlessGameManager";
import { EndlessBGManager } from "db://assets/Scripts/GamePlay/EndlessBGManager";
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    private _hasGoneUp: boolean = false; // To track direction (player at bottom: false, player at top: true)
    private _isMoving: boolean = false;  // To track if the player is moving

    @property({ type: Vec3 })
    private startPosition: Vec3 = new Vec3(0, -267, 0);

    @property({ type: Vec3 })
    private targetPosition: Vec3 = new Vec3(0, 267, 0);

    @property
    private moveSpeed: number = 0.25;

    @property
    private moveSpeedFast: number = 0.15;

    @property(Node)
    private backgroundManager: Node;

    private _isInvincible: boolean = true;
    private _currentTween: Tween<Node> = null; // Reference to the active tween
    private _isReturnAfterEnemyHit: boolean = false;
    private rb: RigidBody2D;

    // Getter and Setter for _hasGoneUp
    get hasGoneUp(): boolean {
        return this._hasGoneUp;
    }

    set hasGoneUp(value: boolean) {
        this._hasGoneUp = value;
    }

    // Getter and Setter for _isMoving
    get isMoving(): boolean {
        return this._isMoving;
    }

    set isMoving(value: boolean) {
        this._isMoving = value;
    }

    // Getter and Setter for _isInvincible
    get isInvincible(): boolean {
        return this._isInvincible;
    }

    set isInvincible(value: boolean) {
        this._isInvincible = value;
    }

    // Getter and Setter for _currentTween
    get currentTween(): Tween<Node> {
        return this._currentTween;
    }

    set currentTween(tween: Tween<Node>) {
        this._currentTween = tween;
    }

    // Getter and Setter for _isReturnAfterEnemyHit
    get isReturnAfterEnemyHit(): boolean {
        return this._isReturnAfterEnemyHit;
    }

    set isReturnAfterEnemyHit(value: boolean) {
        this._isReturnAfterEnemyHit = value;
    }

    start() {
        this.rb = this.getComponent(RigidBody2D);
        this.node.setPosition(this.startPosition); // Set initial position
    }

    public togglePosition() {
        // Apply a pseudo-force because the sensor collider won't be triggered witout it... yeah... this is shit...
        this.applyPseudoForce();

        if (!this._isMoving) {  // anti-spam tap
            if (this._isInvincible) {
                this._hasGoneUp ? this.goDownFast() : this.goUpFast();
            } else {
                this._hasGoneUp ? this.goDown() : this.goUp();
            }
        }
    }

    // Apply a very small force to trigger collisions without affecting movement
    private applyPseudoForce() {
        // Apply a small force on a different axis (like z-axis or in Vec2 with small y-offset)
        // Since we are in 2D, applying in Vec2 will not change the player's position
        this.rb.applyForceToCenter(new Vec2(0, 100), true); // Adjust small force as needed
    }

    private cancelPseudoForce() {
        // Set the velocity to zero to stop any movement caused by the applied force
        this.rb.linearVelocity = new Vec2(0, 0);
    }

    private moveToPosition(targetPosition: Vec3, speed: number) {
        this._isMoving = true; // Set moving flag

        this._currentTween = tween(this.node)
            .to(speed, { position: targetPosition })
            .call(() => {
                // cancel the pseudo force we added
                this.cancelPseudoForce();

                this._isMoving = false;  // Reset moving flag when done

                // If the player reaches the start position, increase score
                if (targetPosition.equals(this.startPosition) && this._hasGoneUp) {
                    EndlessGameManager.Instance.incrementScore();

                    // Move BG down
                    this.backgroundManager.getComponent(EndlessBGManager).moveBackground();
                }

                // Change direction
                this._hasGoneUp = !this._hasGoneUp;
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

    public returnAfterEnemyHit()
    {
        this._isMoving = true; // Set moving flag
        this._isReturnAfterEnemyHit = true;

        this._currentTween = tween(this.node)
            .to(this.moveSpeed / 2, { position: this.startPosition })
            .call(() => {
                // cancel the pseudo force we added
                this.cancelPseudoForce();

                this._isMoving = false;  // Reset moving flag when done
                this._isReturnAfterEnemyHit = false;
            })
            .start();
    }
}
