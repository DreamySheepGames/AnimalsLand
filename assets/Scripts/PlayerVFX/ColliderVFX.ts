import { _decorator, Component, Node, ParticleSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ColliderVFX')
export class ColliderVFX extends Component {
    @property(ParticleSystem)
    private explodeVFX: ParticleSystem;

    start()
    {
        //this.explodeVFX = this.node.getComponent(ParticleSystem);

        if (this.explodeVFX)
            console.log("there is vfx");
        else
            console.log("we got no vfx");

        // this.schedule(() => {
        //     console.log("play explode");
        //     this.getComponent(ParticleSystem).play;
        // }, 2);
    }
}


