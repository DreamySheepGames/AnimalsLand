import { _decorator, Component, view, Canvas, Node, screen } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResponsiveCanvas')
export class ResponsiveCanvas extends Component {
    //@property(Node) canvasNode: Node = null;
    @property private widthThreshold: number = 800; // Set the threshold width

    start() {
        // Initial check and set scaling mode
        this.adjustCanvasScale();

        // Add event listener for window resize
        window.addEventListener('resize', this.onResize.bind(this));
    }

    onDestroy() {
        // Clean up event listener to prevent memory leaks
        window.removeEventListener('resize', this.onResize.bind(this));
    }

    onResize() {
        // Adjust scaling mode on resize
        this.adjustCanvasScale();
    }

    adjustCanvasScale() {
        const screenWidth = screen.windowSize.width;
        const screenHeight = screen.windowSize.height;

        if (screenWidth >= this.widthThreshold) {
            // Scale with screen width
            view.setDesignResolutionSize(screenWidth, screenHeight, 4); // 4 is for `FIXED_WIDTH`
            console.log("Wider");
        } else {
            // Scale with screen height
            view.setDesignResolutionSize(screenWidth, screenHeight, 5); // 5 is for `FIXED_HEIGHT`
            console.log("Narrower");
        }
    }
}
