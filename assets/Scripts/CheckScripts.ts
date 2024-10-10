import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CheckScripts')
export class CheckScripts extends Component {
    start() {
        this.checkSpineAssets();
    }

    private checkSpineAssets() {
        const spineComponent = this.node.getComponent(sp.Skeleton);

        if (spineComponent && spineComponent.skeletonData) {
            console.log("Skeleton Data is assigned:", spineComponent.skeletonData);

            // Check if the skeleton data contains the atlas text
            const atlasText = spineComponent.skeletonData.atlasText;
            if (atlasText) {
                //console.log("Atlas data found:");

                // Log the atlas lines
                const atlasLines = atlasText.split('\n');
                for (const line of atlasLines) {
                    //console.log(line.trim());

                    // Log any line that ends with .png (should be the texture file)
                    if (line.trim().endsWith('.png')) {
                        console.log("PNG texture being used by atlas:", line.trim());
                    }
                }
            } else {
                console.error("Atlas data is missing or not loaded correctly.");
            }

            // Additional check for skins and attachments
            // const skins = spineComponent.skeletonData.getRuntimeData().skins;
            // if (skins && skins.length > 0) {
            //     console.log("Skins loaded:", skins);
            //     for (const skin of skins) {
            //         console.log("Skin name:", skin.name);
            //         for (const attachmentName in skin.attachments) {
            //             console.log(`Attachment found in skin ${skin.name}: ${attachmentName}`);
            //         }
            //     }
            // } else {
            //     console.log("No skins found. Check if .png and .atlas are correctly loaded.");
            // }
        } else {
            console.error("Skeleton Data not assigned or missing.");
        }

        spineComponent.setAnimation(0, "idle", true); // Assuming "idle" is a valid animation

    }
}
