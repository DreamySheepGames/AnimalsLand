import { _decorator, Component, Node, RigidBody2D, Vec3, Quat, sp, Contact2DType, Collider2D, IPhysics2DContact } from 'cc';
import { SpinSprite } from "db://assets/Scripts/EnemyAndItems/SpinSprite";
const { ccclass, property } = _decorator;

@ccclass('EnemyFXController')
export class EnemyFXController extends Component {
    @property(Node)
    private lockFX: Node;

    @property(Node)
    private spinSprite: Node;

    private angularVelocity: number;

    start() {
        var collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        if (otherCollider.tag === 100) {        // player tag is 100
            this.playerHit();
        }
    }

    playerHit()
    {
        const spine = this.spinSprite.getComponent(sp.Skeleton);

        // Play the 'hit' animation
        spine.setAnimation(0, "hit", false);

        // Set a listener to switch to the 'loop idle' animation after 'hit' completes
        spine.setCompleteListener(() => {
            spine.setAnimation(0, "idle", true);  // true makes it loop
        });
    }

    get AngularVelocity(): number {
        return this.angularVelocity;
    }

    set AngularVelocity(value: number) {
        this.angularVelocity = value;
    }

    public freezeFXOn() {
        this.lockFX.active = true;
        this.spinSprite.getComponent(RigidBody2D).angularVelocity = 0;

        // Sync the lockFX rotation with the spinSprite node's rotation
        this.lockFX.rotation = this.spinSprite.rotation;
    }

    public freezeFXOff() {
        // Reset the lockFX rotation to the default (zero rotation)
        //this.lockFX.setRotation(Quat.IDENTITY);
        this.lockFX.active = false;

        // Restore the angular velocity to its original value
        this.spinSprite.getComponent(RigidBody2D).angularVelocity = this.angularVelocity;
    }
}
