import { _decorator, Component, Collider2D, ITriggerEvent, Contact2DType, IPhysics2DContact, tween, Vec3 } from 'cc';
import {PlayerController} from "db://assets/Scripts/Player/PlayerController";
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
const { ccclass, property } = _decorator;

@ccclass('PlayerColliderController')
export class PlayerColliderController extends Component {
    @property({ type: PlayerController })
    private playerController: PlayerController = null; // Reference to the PlayerController

    start() {
        var collider = this.getComponent(Collider2D);

        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        console.log('onBeginContact' + otherCollider.name);

        // Check if the other collider is the enemy (tag = 1)
        if (otherCollider.tag === 1 && !this.playerController.isReturnAfterEnemyHit) {
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
    }
}
