import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingForFont')
export class LoadingForFont extends Component {
    // add this in style.css
    // @font-face {
    //     font-family: 'Comicy';
    //     src: url('assets/fonts/Comicy.ttf') format('truetype');
    //     font-weight: normal;
    //     font-style: normal;
    // }

    @property(Node)
    private panel: Node;

    start() {
        this.panel.active = true;
        this.scheduleOnce(() => {
            director.loadScene("MainMenu");
        }, 0.5);
    }
}


