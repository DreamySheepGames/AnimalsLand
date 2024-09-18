import { _decorator, Component, Node, Contact2DType, IPhysics2DContact, Collider2D, Vec3 } from 'cc';
import {EndlessGameManagerOpponent} from "db://assets/Scripts/GamePlay/EndlessGameManagerOpponent";
const { ccclass, property } = _decorator;

@ccclass('OpponentMagnetZoneController')
export class OpponentMagnetZoneController extends Component {
    private attractedItems: Node[] = [];

    start() {
        var collider = this.getComponent(Collider2D);

        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        // only pick up items
        if (EndlessGameManagerOpponent.Instance.Magnet && otherCollider.tag > 1)
        {
            const itemNode = otherCollider.node;
            this.attractedItems.push(itemNode); // Track the item
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        const itemNode = otherCollider.node;
        // Remove the item from the list when it leaves the magnet zone
        const index = this.attractedItems.indexOf(itemNode);
        if (index > -1) {
            this.attractedItems.splice(index, 1);
        }
    }

    // Continuously move the items towards the magnet zone's y-position
    update(deltaTime: number) {
        const magnetY = this.node.parent.position.y; // Magnet zone's y-position

        this.attractedItems.forEach(item => {
            const itemPos = item.position;

            const newY = this.lerp(itemPos.y, magnetY, deltaTime * 4); // Move smoothly toward magnet
            // Update the item's y position while keeping the x and z unchanged
            item.setPosition(new Vec3(itemPos.x, newY, itemPos.z));
        });
    }

    // Linear interpolation function for smooth movement
    private lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }
}