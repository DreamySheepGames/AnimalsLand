import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SplitController')
export class SplitController extends Component {
    @property(Node) loadingLabel: Node;

    start() {
        this.node.getComponent(sp.Skeleton).setCompleteListener(() => {
            if (this.loadingLabel)
                this.loadingLabel.active = true;
        })
    }
}


