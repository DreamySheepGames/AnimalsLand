import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButttonManager')
export class ButttonManager extends Component {
    public onClick()
    {
        console.log("Button Clicked");
    }
}


