import { _decorator, Component, Node, RigidBody2D, Vec3, Quat } from 'cc';
import { SpinSprite } from "db://assets/Scripts/EnemyAndItems/SpinSprite";
const { ccclass, property } = _decorator;

@ccclass('EnemyFXController')
export class EnemyFXController extends Component {
    @property(Node)
    private lockFX: Node;

    @property(Node)
    private spinSprite: Node;

    private angularVelocity: number;

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
