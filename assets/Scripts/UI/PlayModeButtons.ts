import { _decorator, Component, Node, Color, tween, UIOpacity } from 'cc';
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

    public changeToEndless()
    {
        // Change buttonEndless color
        // const endlessSprite = this.buttonEndless.getComponent('cc.Sprite');
        // if (endlessSprite) {
        //     endlessSprite.color = new Color(255, 215, 0); // Change to gold (or whatever color you prefer)
        // }

        // Tween alpha buttonEndlessHighlight from 0 to 1
        const highlightOpacity = this.buttonEndlessHighlight.getComponent(UIOpacity);
        if (highlightOpacity) {
            tween(highlightOpacity)
                .to(this.opacityTweenTime, { opacity: 255 }, { easing: 'smooth' }) // Tween to full opacity (255)
                .start();
        }

        const challengeHighlightOpacity = this.buttonChallengeHighlight.getComponent(UIOpacity);
        if (challengeHighlightOpacity) {
            tween(challengeHighlightOpacity)
                .to(this.opacityTweenTime, { opacity: 0 }, { easing: 'smooth' }) // Tween to full opacity (255)
                .start();
        }
    }

    public changeToChallenge()
    {
        // Change buttonEndless color
        // const endlessSprite = this.buttonEndless.getComponent('cc.Sprite');
        // if (endlessSprite) {
        //     endlessSprite.color = new Color(255, 215, 0); // Change to gold (or whatever color you prefer)
        // }

        // Tween alpha buttonEndlessHighlight from 0 to 1
        const highlightOpacity = this.buttonEndlessHighlight.getComponent(UIOpacity);
        if (highlightOpacity) {
            tween(highlightOpacity)
                .to(this.opacityTweenTime, { opacity: 0 }, { easing: 'smooth' }) // Tween to full opacity (255)
                .start();
        }

        const challengeHighlightOpacity = this.buttonChallengeHighlight.getComponent(UIOpacity);
        if (challengeHighlightOpacity) {
            tween(challengeHighlightOpacity)
                .to(this.opacityTweenTime, { opacity: 255 }, { easing: 'smooth' }) // Tween to full opacity (255)
                .start();
        }
    }
}


