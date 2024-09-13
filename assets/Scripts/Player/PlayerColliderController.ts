import { _decorator, Component, Collider2D, ITriggerEvent, Contact2DType, IPhysics2DContact, tween, Vec3, Node } from 'cc';
import {PlayerController} from "db://assets/Scripts/Player/PlayerController";
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
import {InvincibleMeterController} from "db://assets/Scripts/UI/InvincibleMeterController";
import {Diamond} from "db://assets/Scripts/EnemyAndItems/Diamond";
const { ccclass, property } = _decorator;

@ccclass('PlayerColliderController')
export class PlayerColliderController extends Component {
    @property({ type: InvincibleMeterController})
    private invincibleMeter: InvincibleMeterController;

    @property({ type: PlayerController })
    private playerController: PlayerController = null; // Reference to the PlayerController

    start() {
        var collider = this.getComponent(Collider2D);

        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        //console.log('onBeginContact' + otherCollider.name);

        // Check if the other collider is the enemy (tag = 1)
        if (otherCollider.tag === 1 && !this.playerController.isReturnAfterEnemyHit && !this.playerController.isInvincible) {
            this.hitEnemy();
        }

        // Check if the other collider is the gaze hitbox of the enemy (tag = 0.5)
        if (otherCollider.tag === 0.5 && !this.playerController.isReturnAfterEnemyHit && !this.playerController.isInvincible) {
            this.hitEnemyGaze();
        }

        // other collider is diamond (tag = 2)
        if (otherCollider.tag === 2 && !this.playerController.isReturnAfterEnemyHit) {
            const otherNode = otherCollider.node;
            this.hitDiamond(otherCollider, otherNode);
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

    hitDiamond(otherCollider, otherNode)
    {
        // update total received diamond value
        EndlessGameManager.Instance.ReceivedDiamond += otherNode.getComponent(Diamond).Value;

        // we have to destroy the diamond AFTER the colliding callback has completed, so we have to use schedule callback
        this.scheduleOnce(() => {
            if (otherNode && otherNode.isValid) {
                otherNode.destroy();
            }
        }, 0);
    }
}
