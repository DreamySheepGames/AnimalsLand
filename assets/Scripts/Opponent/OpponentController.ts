import { _decorator, Component, Node, Vec3, tween, Tween, RigidBody2D, Vec2, Sprite, Color, UITransform } from 'cc';
import { EndlessBGManager } from "db://assets/Scripts/GamePlay/EndlessBGManager";
import {EndlessGameManagerOpponent} from "db://assets/Scripts/GamePlay/EndlessGameManagerOpponent";
import {CheckEnemyController} from "db://assets/Scripts/Opponent/CheckEnemyController";
const { ccclass, property } = _decorator;

@ccclass('OpponentController')
export class OpponentController extends Component {
    private _hasGoneUp: boolean = false; // To track direction (player at bottom: false, player at top: true)
    private _isMoving: boolean = false;  // To track if the player is moving

    @property({ type: Vec3 })
    private startPosition: Vec3 = new Vec3(0, -267, 0);

    @property({ type: Vec3 })
    private targetPosition: Vec3 = new Vec3(0, 267, 0);

    @property
    private moveSpeed: number = 0.3;

    @property
    private moveSpeedFast: number = 0.2;

    @property(Node)
    private backgroundManager: Node;

    @property(CheckEnemyController)
    private checkEnemyController: CheckEnemyController;

    private _isInvincible: boolean = false;
    private _currentTween: Tween<Node> = null; // Reference to the active tween
    private _isReturnAfterEnemyHit: boolean = false;
    private rb: RigidBody2D;
    private clonedNode: Node;
    private startAuto: boolean = false;

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

        this.schedule(() => {
            this.startAuto = true;
        }, 0.4);
    }

    update()
    {
        if (!EndlessGameManagerOpponent.Instance.IsGameOver && this.startAuto)
        {
            if (!this.checkEnemyController.HasEnemy)
                this.togglePosition();
            else
                if (this.isInvincible)
                    this.togglePosition();
        }
    }

    public togglePosition() {
        // Apply a pseudo-force because the sensor collider won't be triggered witout it... yeah... this is shit...
        this.applyPseudoForce();
        this.applyReversePseudoForce();

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

    private applyReversePseudoForce() {
        this.rb.applyForceToCenter(new Vec2(0, -100), true); // Adjust small force as needed
    }

    private applyIdlePseudoForce() {
        this.schedule(() => {
            if (!this._isMoving) {
                // Apply a very small force to keep physics engine active without moving the object
                this.rb.applyForceToCenter(new Vec2(0, 1), true); // Adjust force as needed
            }
        }, 1); // Adjust interval if needed
    }

    private applyReverseIdlePseudoForce() {
        this.schedule(() => {
            if (!this._isMoving) {
                // Apply a very small force to keep physics engine active without moving the object
                this.rb.applyForceToCenter(new Vec2(0, -1), true); // Adjust force as needed
            }
        }, 1); // Adjust interval if needed
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
                    EndlessGameManagerOpponent.Instance.incrementScore();

                    // Move BG down
                    this.backgroundManager.getComponent(EndlessBGManager).moveBackground();
                }

                this.applyIdlePseudoForce();
                this.applyReverseIdlePseudoForce();

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

    turnOnInvincible()
    {
        this._isInvincible = true;

        const spriteComponent = this.node.getComponent(Sprite);
        const originalTransform = this.node.getComponent(UITransform); // Get UITransform of the original node

        if (spriteComponent) {
            // Clone the node
            if (this.clonedNode == null)
            {
                this.clonedNode = new Node("ClonedSprite");
                const clonedSprite = this.clonedNode.addComponent(Sprite);
                clonedSprite.spriteFrame = spriteComponent.spriteFrame; // Clone the sprite frame

                // Set layer to UI_3D (index 23)
                this.clonedNode.layer = this.node.layer;

                // Add the cloned node as a child of the original node
                this.clonedNode.setParent(this.node);

                // Set the clone's content size to the original node's content size
                const clonedTransform = this.clonedNode.addComponent(UITransform);
                clonedTransform.setContentSize(originalTransform.contentSize);

                // Set the cloned sprite's scale to 0.9 (keep it normal size)
                this.clonedNode.setScale(new Vec3(0.9, 0.9, 0.9));
                this.clonedNode.setPosition(new Vec3(0, 0, 0));
            }
            else
                this.clonedNode.active = true;

            // Scale the original node (parent) by 1.1
            this.node.setScale(new Vec3(1.1, 1.1, 1.1));

            // Set the color of the parent node's sprite to red
            spriteComponent.color = new Color(255, 0, 0);
        } else {
            console.error("No Sprite component found on the node.");
        }
    }

    turnOffInvincible()
    {
        this._isInvincible = false;

        // change this node's color back to normal
        this.node.getComponent(Sprite).color = new Color(255, 255, 255);
        this.node.setScale(new Vec3(1, 1, 1));

        // turn off the child
        if (this.clonedNode)
            this.clonedNode.active = false;
        else
            console.error("No cloned node found");

    }
}
