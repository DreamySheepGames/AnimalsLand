import { _decorator, Component, Node, Collider2D, IPhysics2DContact, Contact2DType, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CheckEnemyController')
export class CheckEnemyController extends Component {
    private hasEnemy: boolean = false;
    private enemies: Node[] = [];
    private rb: RigidBody2D;

    get HasEnemy(): boolean {
        return this.hasEnemy;
    }

    start() {
        var collider = this.getComponent(Collider2D);
        this.rb = this.getComponent(RigidBody2D);

        this.applyIdlePseudoForce();
        this.applyReverseIdlePseudoForce();

        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        if (otherCollider.tag === 1)
        {
            this.enemies.push(otherCollider.node); // Track the enemy
            this.hasEnemy = true;
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        // Remove the enemy from the list when it leaves the zone
        if (otherCollider.tag === 1)
        {
            const index = this.enemies.indexOf(otherCollider.node);
            if (index > -1) {
                this.enemies.splice(index, 1);
            }

            if (this.enemies.length == 0)
                this.hasEnemy = false;
        }
    }

    private applyIdlePseudoForce() {
        this.schedule(() => {
            // Apply a very small force to keep physics engine active without moving the object
            this.rb.applyForceToCenter(new Vec2(0, 1), true); // Adjust force as needed
        }, 0.1); // Adjust interval if needed
    }

    private applyReverseIdlePseudoForce() {
        this.schedule(() => {
            // Apply a very small force to keep physics engine active without moving the object
            this.rb.applyForceToCenter(new Vec2(0, -1), true); // Adjust force as needed
        }, 0.1); // Adjust interval if needed
    }
}


