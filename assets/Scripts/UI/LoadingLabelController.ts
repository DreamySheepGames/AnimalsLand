import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingLabelController')
export class LoadingLabelController extends Component {
    private waitingDuration = 0.5;
    private dotCount = 1; // To keep track of the number of dots

    onEnable() {
        this.node.getComponent(Label).string = "Loading.";

        // Start updating the label with more dots
        this.schedule(this.updateLoadingText, this.waitingDuration);
    }

    private updateLoadingText() {
        const label = this.node.getComponent(Label);

        // Cycle through "Loading.", "Loading..", and "Loading..."
        this.dotCount = (this.dotCount % 3) + 1;
        label.string = "Loading" + ".".repeat(this.dotCount); // Add the appropriate number of dots
    }

    onDisable() {
        // Stop the scheduled function when the component is disabled
        this.unschedule(this.updateLoadingText);
    }
}
