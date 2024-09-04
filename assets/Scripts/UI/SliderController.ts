import { _decorator, Component, Node, Slider, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SliderController')
export class SliderController extends Component {
    @property({ type: Slider })
    private slider: Slider = null;

    @property({ type: Node })
    private fillNode: Node = null;

    start() {
        this.updateFill();
        this.slider.node.on('slide', this.updateFill, this);
    }

    updateFill() {
        const sliderValue = this.slider.progress; // Gets the slider's progress (0 to 1)
        const fillTransform = this.fillNode.getComponent(UITransform);
        const barTransform = this.slider.node.getComponent(UITransform);

        // Update the fill width based on the slider's progress
        fillTransform.width = barTransform.width * sliderValue;
    }
}


