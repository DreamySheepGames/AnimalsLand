import { _decorator, Component, Node, Vec3, view, UITransform, RigidBody2D } from 'cc';
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

    private moveDirection: number = 1; // 1 for right, -1 for left
    private speed: number; // Movement speed
    private speedMin: number = 200; // Minimum speed
    private speedMax: number = 400; // Maximum speed
    private screenWidth: number; // Width of the screen
    private oneTimeUseTriggered: boolean = false; // Tracks if one-time use was triggered

    private speedBurstFactor: number = 2; // Speed burst multiplier
    private speedBurstCountDownMin: number = 3; // Min countdown to burst in seconds
    private speedBurstCountDownMax: number = 6; // Max countdown to burst in seconds
    private returnToNormalSpeedAfter: number = 1; // Time in seconds to return to normal speed

    private speedBurstCountDown: number; // Countdown for next speed burst
    private isSpeedBurstActive: boolean = false; // Flag to check if burst is active
    private timeUntilNormalSpeed: number = 0; // Timer to track when to return to normal speed

    private spinForceMin: number = -10;
    private spinForceMax: number = 10;

    get IsMoveSideWay(): boolean {
        return this.isMoveSideWay;
    }

    set IsMoveSideWay(value: boolean){
        this.isMoveSideWay = value;
    }

    start() {
        if (this.isSpin)
        {
            var spinForce = Math.random() * (this.spinForceMax - this.spinForceMin) + this.spinForceMin;
            this.getComponent(RigidBody2D).angularVelocity = spinForce;
        }

        // Randomize normal speed between speedMin and speedMax
        this.speed = Math.random() * (this.speedMax - this.speedMin) + this.speedMin;

        if (view.getDesignResolutionSize().width > view.getVisibleSize().width)
            this.screenWidth = view.getVisibleSize().width / 2; // Get half the screen width
        else
            this.screenWidth = view.getDesignResolutionSize().width / 2; // Get half the screen width

        // Set initial direction based on position
        if (this.node.position.x < 0) {
            this.moveDirection = 1; // Move to the right
        } else {
            this.moveDirection = -1; // Move to the left
        }

        // Initialize speed burst countdown
        if (this.hasSpeedBurst) {
            this.setNewSpeedBurstCountDown();
        }
    }

    update(deltaTime: number) {
        // If the flag is false, stop sideways movement
        if (!this.isMoveSideWay) {
            // Check if the node is outside the screen bounds
            if (this.node.position.x > this.screenWidth || this.node.position.x < -this.screenWidth) {
                this.node.destroy(); // Destroy the item/enemy if outside the screen
            }
        }

        // Check for speed burst logic
        if (this.hasSpeedBurst) {
            this.handleSpeedBurst(deltaTime);
        }

        // Move the object sideways based on the current direction and speed
        const newPos = this.node.position.clone();
        newPos.x += this.moveDirection * this.speed * deltaTime;
        this.node.setPosition(newPos);

        // Get the current position and UITransform size of the node
        const uiTransform = this.node.getComponent(UITransform);
        const objectWidth = uiTransform.width / 2;

        // Check if the object has hit the edges of the screen
        if ((newPos.x + objectWidth >= this.screenWidth || newPos.x - objectWidth <= -this.screenWidth) && this.isMoveSideWay) {
            this.moveDirection *= -1; // Reverse the direction

            // If isOneTimeUse is true, stop moving sideways after the first hit
            if (this.isOneTimeUse && !this.oneTimeUseTriggered) {
                this.scheduleOnce(() => {
                    this.isMoveSideWay = false;         // set flag afer 0.1 second
                    this.oneTimeUseTriggered = true;
                }, 0.1); // Delay of 0.1 second
            }
        }
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
