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

    @property(Node)
    private loadingLabel: Node;

    start() {
        this.panel.active = true;

        this.scheduleOnce(() => {
            if (this.loadingLabel)
                this.loadingLabel.active = true;
        }, 0.2);

        const sceneName = director.getScene().name;

        if (sceneName == "BootGame") {
            this.scheduleOnce(() => {
                director.loadScene("Loading");
            }, 0.4);
        }

        if (sceneName == "Loading") {
            this.scheduleOnce(() => {
                director.loadScene("MainMenu");
            }, 0.4);
        }


    }
}


