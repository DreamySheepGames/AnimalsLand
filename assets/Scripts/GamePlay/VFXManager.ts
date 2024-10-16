import { _decorator, Component, Node, Prefab, Vec3, instantiate, sp } from 'cc';
import {DecoderModule} from "draco3dgltf";
const { ccclass, property } = _decorator;

@ccclass('VFXManager')
export class VFXManager extends Component {
    @property({ type: Prefab })
    private vfxPrefab: Prefab;

    @property(Node)
    private canvas: Node;

    // start() {
    //     this.PlayVFXOnce(new Vec3(0, 0, 0), "FX_collider", 1.5);
    //     this.PlayVFXOnce(new Vec3(0, 100, 0), "FX_click", 1.5);
    // }

    public PlayVFXOnce(pos: Vec3, vfxName: string, vfxTimeScale: number = 1)
    {
        // spawn vfx and add it into the canvas
        const vfx = instantiate(this.vfxPrefab);
        this.canvas.addChild(vfx);
        vfx.setPosition(pos.x, pos.y, 0);

        // play vfx animation with a timescale
        const vfxSkeleton = vfx.getComponent(sp.Skeleton);
        if (vfxSkeleton) {
            vfxSkeleton.setAnimation(0, vfxName);         // set animmation

            vfxSkeleton.timeScale = vfxTimeScale;               // set timescale

            vfxSkeleton.setCompleteListener(() => {             // destroy when completed
                vfx.destroy();
            });
        }
    }
}


