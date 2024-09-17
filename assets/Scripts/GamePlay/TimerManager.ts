import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TimerManager')
export class TimerManager extends Component {
    @property(Node)
    timerSuperHero: Node;

    @property(Node)
    timerDouble: Node;

    @property(Node)
    timerSlowdown: Node;

    @property(Node)
    timerFreeze: Node;

    timerSuperHeroOn()
    {
        this.timerSuperHero.active = true;
    }

    timerDoubleOn()
    {
        this.timerDouble.active = true;
    }

    timerSlowdownOn()
    {
        this.timerSlowdown.active = true;
    }

    timerFreezeOn()
    {
        this.timerFreeze.active = true;
    }
}


