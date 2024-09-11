import { _decorator, Component, Node, Event, director } from 'cc';
import {AudioManager} from "db://assets/Scripts/Audio/AudioManager";
const { ccclass, property } = _decorator;

@ccclass('ButttonManager')
export class ButttonManager extends Component {

    @property([Node])
    private panels: Node[] = []; // Array to store panel nodes

    @property(Node)
    private darkLayer: Node;

    public openPanel(event: Event, CustomEventData) {
        // Turn on dark layer
        if (this.darkLayer)
            this.darkLayer.active = true;

        // First, close all panels
        this.panels.forEach(panel => panel.active = false);

        // Then, open the desired panel based on the index
        if (this.panels[CustomEventData]) {
            this.panels[CustomEventData].active = true;
        }
    }

    public closeParent(event: Event) {
        if (this.darkLayer)
            this.darkLayer.active = false;

        const buttonNode = event.currentTarget as Node; // Get the button node
        const parentNode = buttonNode.parent; // Get the grandparent of the button (assuming this is the panel)

        if (parentNode) {
            parentNode.active = false; // Set the parent (panel) to inactive
        }
    }

    public onClick()
    {
        console.log("Button Clicked");
    }

    public playButtonPressedSFX()
    {
        AudioManager.Instance.playSFX(AudioManager.Instance.buttonPressed);
    }

    public openMenuScene()
    {
        director.loadScene('MainMenu');
    }

    public openEndlessScene()
    {
        director.loadScene('Endless');
    }
}


