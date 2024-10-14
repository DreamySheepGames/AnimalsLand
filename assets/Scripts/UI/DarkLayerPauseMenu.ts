import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DarkLayerPauseMenu')
export class DarkLayerPauseMenu extends Component {
    @property(Node)
    private pauseMenuPanel: Node = null; // Reference to the pause menu panel

    @property(Node)
    private canvas: Node;

    onEnable() {
        this.onActive();
    }

    private onActive() {
        // Ensure the dark layer is above all nodes
        this.node.setSiblingIndex(this.canvas.children.length - 1);

        // Position the pause menu panel on the dark layer
        if (this.pauseMenuPanel) {
            this.pauseMenuPanel.setSiblingIndex(this.canvas.children.length - 1);
        } else {
            console.warn("Pause Menu Panel is not assigned.");
        }
    }
}


