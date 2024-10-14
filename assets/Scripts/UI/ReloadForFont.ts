import { _decorator, Component, Node, Label, RichText, Font } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ReloadForFont')
export class ReloadForFont extends Component {
    @property(Font)
    comicyFont: Font = null;

    @property(({ type: [Label] }))
    private resetLabel: Label [] = [];

    start() {
        if (this.resetLabel.length > 0) {
            for (let i = 0; i < this.resetLabel.length; i++) {
                this.resetLabel[i].font = this.comicyFont;
            }
        }
    }
}


