import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, tween, Vec3, Node } from 'cc';

import {InvincibleMeterController} from "db://assets/Scripts/UI/InvincibleMeterController";
//import {Diamond} from "db://assets/Scripts/EnemyAndItems/Diamond";
import {TimerManager} from "db://assets/Scripts/GamePlay/TimerManager";
import {OpponentController} from "db://assets/Scripts/Opponent/OpponentController";
import {EndlessGameManagerOpponent} from "db://assets/Scripts/GamePlay/EndlessGameManagerOpponent";
import {OpponentInvincibleMeterController} from "db://assets/Scripts/Opponent/UI/OpponentInvincibleMeterController";
const { ccclass, property } = _decorator;

@ccclass('OpponentColliderController')
export class OpponentColliderController extends Component {
    @property({ type: OpponentInvincibleMeterController})
    private invincibleMeter: OpponentInvincibleMeterController;

    @property({ type: OpponentController })
    private playerController: OpponentController = null; // Reference to the PlayerController

    @property({type: TimerManager})
    private timerManager: TimerManager;

    start() {
        var collider = this.getComponent(Collider2D);

        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        // Check if the other collider is the enemy (tag = 1)
        if (otherCollider.tag === 1 && !this.playerController.isReturnAfterEnemyHit && !this.playerController.isInvincible) {
            this.hitEnemy();
        }

        // Check if the other collider is the gaze hitbox of the enemy (tag = 0.5)
        if (otherCollider.tag === 0.5 && !this.playerController.isReturnAfterEnemyHit && !this.playerController.isInvincible) {
            this.hitEnemyGaze();
        }

        if (!this.playerController.isReturnAfterEnemyHit)
        {
            switch (otherCollider.tag)
            {
                case 2:     // other collider is diamond (tag = 2)
                    this.hitDiamond(otherCollider);
                    break;

                case 3:     // super hero item (tag = 3)
                    if (!this.playerController.isInvincible)
                        this.hitSuperHeroItem(otherCollider);
                    break;

                case 4:     // double item hit (tag = 4)
                    this.hitDouble(otherCollider);
                    break;

                case 5:     // slowdown item hit (tag = 5)
                    this.hitSlowdown(otherCollider);
                    break;

                case 6:     // freeze item hit (tag = 6)
                    this.hitFreeze(otherCollider);
                    break;

                case 7:     // magnet item hit (tag = 7)
                    this.hitMagnet(otherCollider);
                    break;
            }
        }
    }

    hitEnemy()
    {
        // decrease invincible filler and heart
        this.invincibleMeter.decreaseFiller();
        EndlessGameManagerOpponent.Instance.decreaseHeart();

        if (this.playerController.hasGoneUp) {
            // If hasGoneUp is true, set it to false (reverse direction)
            this.playerController.hasGoneUp = false;
        }

        // If hasGoneUp is false, cancel current tween and move back to start position
        if (this.playerController.currentTween) {
            this.playerController.currentTween.stop(); // Cancel the current tween
        }

        this.playerController.returnAfterEnemyHit(); // Move back to start position
    }

    hitEnemyGaze()
    {
        this.invincibleMeter.increaseFiller();
    }

    destroyCollidedNode(otherCollider)
    {
        let itemNode = otherCollider.node;
        this.scheduleOnce(() => {
            if (itemNode && itemNode.isValid) {
                itemNode.destroy();
            }
        }, 0);
    }

    hitDiamond(otherCollider)
    {
        // we have to destroy the diamond AFTER the colliding callback has completed, so we have to use schedule callback
        this.destroyCollidedNode(otherCollider);
    }

    hitSuperHeroItem(otherCollider)
    {
        // turn on invincible
        this.playerController.turnOnInvincible();

        // turn on countdown timer through TimerManager
        this.timerManager.timerSuperHeroOn();

        // destroy item
        this.destroyCollidedNode(otherCollider);
    }

    hitDouble(otherCollider)
    {
        this.timerManager.timerDoubleOn();
        this.destroyCollidedNode(otherCollider);
    }

    hitSlowdown(otherCollider)
    {
        EndlessGameManagerOpponent.Instance.slowdownEnemy();
        this.timerManager.timerSlowdownOn();
        this.destroyCollidedNode(otherCollider);
    }

    hitFreeze(otherCollider)
    {
        EndlessGameManagerOpponent.Instance.freezeEnemy();
        this.timerManager.timerFreezeOn();
        this.destroyCollidedNode(otherCollider);
    }

    hitMagnet(otherCollider)
    {
        EndlessGameManagerOpponent.Instance.Magnet = true;
        this.timerManager.timerMagnetOn();
        this.destroyCollidedNode(otherCollider);
    }
}