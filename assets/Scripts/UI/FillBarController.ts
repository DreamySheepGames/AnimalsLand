import { _decorator, Component, Node, Slider, UITransform, RichText } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FillBarController')
export class FillBarController extends Component {
    @property({ type: Slider })
    private slider: Slider = null;

    @property({ type: Node })
    private fillNode: Node = null;

    @property(Node)
    private characterLayout: Node;

    @property(RichText)
    private unlockedCount: RichText;

    start()
    {
        this.updateFill();
    }

    public updateFill() {
        let unlockedCharacterCount = 0;
        let characterCount = this.characterLayout.children.length;

        // Check all the children of the characterLayout node
        for (let i = 0; i < characterCount; i++) {
            const childNode = this.characterLayout.children[i];

            // Check if the child has at least two children
            if (childNode.children.length > 1) {
                const secondChild = childNode.children[1]; // Get the second child of each child node

                // Check if the second child is inactive
                if (!secondChild.active) {
                    unlockedCharacterCount++;
                }
            }
        }

        // update count text 0/<color=#ffffff>30</color>
        this.unlockedCount.string = unlockedCharacterCount.toString() + "/<color=#ffffff>" + characterCount + "</color>";

        // Update the slider's progress based on unlockedCharacterCount
        this.slider.progress = unlockedCharacterCount / characterCount;

        const sliderValue = this.slider.progress; // Gets the slider's progress (0 to 1)
        const fillTransform = this.fillNode.getComponent(UITransform);
        const barTransform = this.slider.node.getComponent(UITransform);

        // Update the fill width based on the slider's progress
        fillTransform.width = barTransform.width * sliderValue;
    }
}


