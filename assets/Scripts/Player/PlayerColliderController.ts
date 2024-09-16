import { _decorator, Component, Collider2D, ITriggerEvent, Contact2DType, IPhysics2DContact, tween, Vec3, Node } from 'cc';
import {PlayerController} from "db://assets/Scripts/Player/PlayerController";
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
import {InvincibleMeterController} from "db://assets/Scripts/UI/InvincibleMeterController";
import {Diamond} from "db://assets/Scripts/EnemyAndItems/Diamond";
import {TimerManager} from "db://assets/Scripts/GamePlay/TimerManager";
const { ccclass, property } = _decorator;

@ccclass('PlayerColliderController')
export class PlayerColliderController extends Component {
    @property({ type: InvincibleMeterController})
    private invincibleMeter: InvincibleMeterController;

    @property({ type: PlayerController })
    private playerController: PlayerController = null; // Reference to the PlayerController

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
                    const otherNode = otherCollider.node;
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
            }
        }
    }

    hitEnemy()
    {
        // decrease invincible filler and heart
        this.invincibleMeter.decreaseFiller();
        EndlessGameManager.Instance.decreaseHeart();

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

    hitDiamond(otherCollider)
    {
        // update total received diamond value
        EndlessGameManager.Instance.diamondIncrement(otherCollider.node.getComponent(Diamond).Value);

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
        EndlessGameManager.Instance.DoubleDiamond = true;
        this.timerManager.timerDoubleOn();
        this.destroyCollidedNode(otherCollider);
    }

    hitSlowdown(otherCollider)
    {
        EndlessGameManager.Instance.HasSlowdown = true;
        EndlessGameManager.Instance.slowdownEnemy();
        this.timerManager.timerSlowdownOn();
        this.destroyCollidedNode(otherCollider);
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
}
