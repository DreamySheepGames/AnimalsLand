import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VersusManager')
export class VersusManager extends Component {
    @property waitingDuration: number = 3;

    start() {
        this.openChallengeGameplay();
    }

    openChallengeGameplay() {
        this.scheduleOnce(() => {
            director.loadScene("Challenge");
        }, this.waitingDuration);
    }
}


