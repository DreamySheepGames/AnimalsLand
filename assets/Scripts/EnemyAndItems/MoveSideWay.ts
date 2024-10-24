import { _decorator, Component, Node, Vec3, view, UITransform, RigidBody2D, Vec2 } from 'cc';
import {EnemyFXController} from "db://assets/Scripts/EnemyAndItems/EnemyFXController";
const { ccclass, property } = _decorator;

@ccclass('MoveSideWay')
export class MoveSideWay extends Component {
    
    isMoveSideWay: boolean = true; // Flag to control if it should keep moving sideways

    @property
    isOneTimeUse: boolean = false; // Flag to stop moving after one hit

    @property
    hasSpeedBurst: boolean = false;

    @property
    isSpin: boolean = false;

    @property
    needFlipVertical: boolean = false;

    private moveDirection: number = 1;              // 1 for right, -1 for left
    private speed: number;                          // Movement speed
    private speedMin: number = 200;                 // Minimum speed
    private speedMax: number = 400;                 // Maximum speed
    private screenWidth: number;                    // Width of the screen
    private oneTimeUseTriggered: boolean = false;   // Tracks if one-time use was triggered

    private speedBurstFactor: number = 2;           // Speed burst multiplier
    private speedBurstCountDownMin: number = 3;     // Min countdown to burst in seconds
    private speedBurstCountDownMax: number = 6;     // Max countdown to burst in seconds
    private returnToNormalSpeedAfter: number = 1;   // Time in seconds to return to normal speed

    private speedBurstCountDown: number;            // Countdown for next speed burst
    private isSpeedBurstActive: boolean = false;    // Flag to check if burst is active
    private timeUntilNormalSpeed: number = 0;       // Timer to track when to return to normal speed
    private isSlowdown: boolean = false;            // Slowdown mode flag
    private isFreeze: boolean = false;              // Freeze mode flag

    private spinForceMin: number = -10;
    private spinForceMax: number = 10;

    private rb;

    get IsMoveSideWay(): boolean {
        return this.isMoveSideWay;
    }

    set IsMoveSideWay(value: boolean) {
        this.isMoveSideWay = value;
    }

    get MoveDirection(): number {
        return this.moveDirection;
    }

    set MoveDirection(value: number) {
        this.moveDirection = value;
    }

    get HasSpeedBurst(): boolean {
        return this.hasSpeedBurst;
    }

    set HasSpeedBurst(value: boolean) {
        this.hasSpeedBurst = value;
    }

    get Speed(): number {
        return this.speed;
    }

    set Speed(value: number) {
        this.speed = value;
    }

    get IsSlowdown(): boolean {
        return this.isSlowdown;
    }

    set IsSlowdown(value: boolean) {
        this.isSlowdown = value;
    }

    get IsFreeze(): boolean {
        return this.isFreeze;
    }

    set IsFreeze(value: boolean) {
        this.isFreeze = value;
    }

    start() {
        this.rb = this.node.getComponent(RigidBody2D);

        this.screenWidth = view.getDesignResolutionSize().width / 2; // Get half the screen width

        if (this.isSpin)
        {
            var spinForce = Math.random() * (this.spinForceMax - this.spinForceMin) + this.spinForceMin;
            this.getComponent(RigidBody2D).angularVelocity = spinForce;
        }


        // Randomize normal speed between speedMin and speedMax
        this.speed = Math.random() * (this.speedMax - this.speedMin) + this.speedMin;

        // Set initial direction based on position
        if (this.node.position.x < 0) {
            this.moveDirection = 1;         // Move to the right

            if (this.needFlipVertical)      // this can only be apllied if the sprite turn to the left by default
                this.node.setScale(-this.node.scale.x, this.node.scale.y);
        } else {
            this.moveDirection = -1; // Move to the left
        }

        // Initialize speed burst countdown
        if (this.hasSpeedBurst) {
            this.setNewSpeedBurstCountDown();
        }
    }

    update(deltaTime: number) {
        // this.applyPseudoForce();
        // this.applyReversePseudoForce();

        // If the flag is false, stop sideways movement
        if (!this.isMoveSideWay) {
            // Check if the node is outside the screen bounds
            if (this.node.position.x > this.screenWidth + 50 || this.node.position.x < -this.screenWidth - 50) {
                this.node.destroy(); // Destroy the item/enemy if outside the screen
            }
        }

        // Check for speed burst logic
        if (this.hasSpeedBurst) {
            this.handleSpeedBurst(deltaTime);
        }

        // Move the object sideways based on the current direction and speed
        const newPos = this.node.position.clone();

        if (!this.isFreeze)
        {
            newPos.x += this.isSlowdown ? (this.moveDirection * this.speed * deltaTime / 2)
                                        : (this.moveDirection * this.speed * deltaTime)

            this.node.setPosition(newPos);
        }

        // Get the current position and UITransform size of the node
        const uiTransform = this.node.getComponent(UITransform);
        const objectWidth = uiTransform.width / 2;

        // Check if the object has hit the edges of the screen
        if (((newPos.x + objectWidth >= this.screenWidth && this.moveDirection == 1)
            || (newPos.x - objectWidth <= -this.screenWidth && this.moveDirection == -1))
            && this.isMoveSideWay)
        {
            this.moveDirection *= -1; // Reverse the direction

            if (this.needFlipVertical)      // this can only be apllied if the sprite turn to the left by default
                this.node.setScale(-this.node.scale.x, this.node.scale.y);

            // If isOneTimeUse is true, stop moving sideways after the first hit
            if (this.isOneTimeUse && !this.oneTimeUseTriggered) {
                this.scheduleOnce(() => {
                    this.isMoveSideWay = false;         // set flag afer 0.1 second
                    this.oneTimeUseTriggered = true;
                }, 0.1); // Delay of 0.1 second
            }
        }
    }

    private applyPseudoForce() {
        // Apply a small force on a different axis (like z-axis or in Vec2 with small y-offset)
        // Since we are in 2D, applying in Vec2 will not change the player's position
        this.rb.applyForceToCenter(new Vec2(0, 500), true); // Adjust small force as needed
    }

    private applyReversePseudoForce() {
        this.rb.applyForceToCenter(new Vec2(0, -500), true); // Adjust small force as needed
    }

    private handleSpeedBurst(deltaTime: number) {
        // If speed burst is not active, decrease the countdown timer
        if (!this.isSpeedBurstActive) {
            this.speedBurstCountDown -= deltaTime;
            if (this.speedBurstCountDown <= 0) {
                this.activateSpeedBurst();
            }
        } else {
            // If speed burst is active, track time to return to normal speed
            this.timeUntilNormalSpeed -= deltaTime;
            if (this.timeUntilNormalSpeed <= 0) {
                this.deactivateSpeedBurst();
            }
        }
    }

    private activateSpeedBurst() {
        this.isSpeedBurstActive = true;
        this.speed *= this.speedBurstFactor; // Double the speed
        this.timeUntilNormalSpeed = this.returnToNormalSpeedAfter; // Set timer to return to normal speed
    }

    private deactivateSpeedBurst() {
        this.isSpeedBurstActive = false;
        this.speed /= this.speedBurstFactor; // Return to normal speed
        this.setNewSpeedBurstCountDown(); // Set a new countdown for the next burst
    }

    private setNewSpeedBurstCountDown() {
        // Randomize countdown for the next speed burst
        this.speedBurstCountDown = Math.random() * (this.speedBurstCountDownMax - this.speedBurstCountDownMin) + this.speedBurstCountDownMin;
    }
}
