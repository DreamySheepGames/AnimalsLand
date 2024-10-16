import { _decorator, Component, Node, Color, tween, UIOpacity, Button, director } from 'cc';
import {GameManager} from "db://assets/Scripts/GamePlay/GameManager";
import {TransitionCanvasController} from "db://assets/Scripts/UI/TransitionCanvasController";
const { ccclass, property } = _decorator;

@ccclass('PlayModeButtons')
export class PlayModeButtons extends Component {
    @property(Node)
    private buttonEndless: Node;

    @property(Node)
    private buttonChallenge: Node;

    @property(Node)
    private buttonEndlessHighlight: Node;

    @property(Node)
    private buttonChallengeHighlight: Node;

    private opacityTweenTime = 0.12;

    @property(TransitionCanvasController)
    private transitionCanvasController: TransitionCanvasController;

    start()
    {
        // if (GameManager.Instance.isEndlessMode)
        //     this.changeToEndless();
        // else
        //     this.changeToChallenge();
    }

    public changeToEndless()
    {
        GameManager.Instance.isEndlessMode = true;

        this.transitionCanvasController.outTransition();

        this.scheduleOnce(() => {
            director.loadScene("Endless");
        }, this.transitionCanvasController.TransitionDuration + 0.15)

        // Change buttonEndless color
        // const endlessSprite = this.buttonEndless.getComponent(Button);
        // if (endlessSprite) {
        //     endlessSprite.normalColor = this.hexToColor("#FFFFFF");
        // }
        //
        // const challengeSprite = this.buttonChallenge.getComponent(Button);
        // if (challengeSprite) {
        //     challengeSprite.normalColor = this.hexToColor("#D6D6D6");
        // }
        //
        // // Tween alpha buttonEndlessHighlight from 0 to 1
        // const highlightOpacity = this.buttonEndlessHighlight.getComponent(UIOpacity);
        // if (highlightOpacity) {
        //     tween(highlightOpacity)
        //         .to(this.opacityTweenTime, { opacity: 255 }, { easing: 'smooth' }) // Tween to full opacity (255)
        //         .start();
        // }
        //
        // const challengeHighlightOpacity = this.buttonChallengeHighlight.getComponent(UIOpacity);
        // if (challengeHighlightOpacity) {
        //     tween(challengeHighlightOpacity)
        //         .to(this.opacityTweenTime, { opacity: 0 }, { easing: 'smooth' }) // Tween to full opacity (255)
        //         .start();
        // }
    }

    public changeToChallenge()
    {
        GameManager.Instance.isEndlessMode = false;
        this.transitionCanvasController.outTransition();

        this.scheduleOnce(() => {
            director.loadScene("VS");
        }, this.transitionCanvasController.TransitionDuration + 0.15)

        // Change buttonEndless color
        // const endlessSprite = this.buttonEndless.getComponent(Button);
        // if (endlessSprite) {
        //     endlessSprite.normalColor = this.hexToColor("#D6D6D6");
        // }
        //
        // const challengeSprite = this.buttonChallenge.getComponent(Button);
        // if (challengeSprite) {
        //     challengeSprite.normalColor = this.hexToColor("#FFFFFF");
        // }
        //
        // // Tween alpha buttonEndlessHighlight from 0 to 1
        // const highlightOpacity = this.buttonEndlessHighlight.getComponent(UIOpacity);
        // if (highlightOpacity) {
        //     tween(highlightOpacity)
        //         .to(this.opacityTweenTime, { opacity: 0 }, { easing: 'smooth' }) // Tween to full opacity (255)
        //         .start();
        // }
        //
        // const challengeHighlightOpacity = this.buttonChallengeHighlight.getComponent(UIOpacity);
        // if (challengeHighlightOpacity) {
        //     tween(challengeHighlightOpacity)
        //         .to(this.opacityTweenTime, { opacity: 255 }, { easing: 'smooth' }) // Tween to full opacity (255)
        //         .start();
        // }
    }

    private hexToColor(hex: string): Color {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return new Color(r, g, b);
    }
}


