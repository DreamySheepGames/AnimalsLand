import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PrizePanelController')
export class PrizePanelController extends Component {
    @property(Node)
    private prizeName: Node;

    @property(Node)
    private prizeDescription: Node;

    onEnable()
    {
        this.node.setScale(1, 1, 1);
        //this.prizeDescription.active = false;
        this.prizeNamePop();
    }

    private prizeNamePop()
    {
        this.prizeName.setScale(0.1, 0.1, 0.1);
        tween(this.prizeName)
            .to(0.4, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .call(() => this.prizeDescriptionPop())
            .start();
    }

    private prizeDescriptionPop()
    {
        this.prizeDescription.setScale(0.1, 0.1, 0.1);
        //this.prizeDescription.active = true;
        tween(this.prizeDescription)
            .to(0.35, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();
    }
}


