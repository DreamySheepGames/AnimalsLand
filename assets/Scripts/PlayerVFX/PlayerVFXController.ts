import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerVFXController')
export class PlayerVFXController extends Component {
    @property(Node) private fx_freeze: Node;
    @property(Node) private fx_magnet: Node;
    @property(Node) private fx_shield: Node;
    @property(Node) private fx_x2: Node;

    start() {
        this.fx_freeze.active = false;
        this.fx_magnet.active = false;
        this.fx_shield.active = false;
        this.fx_x2.active = false;
    }

    // turn fxs on
    public fxFreezeOn() {this.fx_freeze.active = true;}
    public fxMagnetOn() {this.fx_magnet.active = true;}
    public fxShieldOn() {this.fx_shield.active = true;}
    public fxX2On() {this.fx_x2.active = true;}

    // turn fxs off
    public fxFreezeOff() {this.fx_freeze.active = false;}
    public fxMagnetOff() {this.fx_magnet.active = false;}
    public fxShieldOff() {this.fx_shield.active = false;}
    public fxX2Off() {this.fx_x2.active = false;}

}


