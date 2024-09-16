import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TimerManager')
export class TimerManager extends Component {
    @property(Node)
    timerSuperHero: Node;

    timerSuperHeroOn()
    {
        this.timerSuperHero.active = true;
    }
}


