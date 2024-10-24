import { _decorator, Component, Widget, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LayoutController')
export class LayoutController extends Component {
    @property({ type: [Widget] })
    private buttonWidgets: Widget[] = [];

    onLoad() {
        const visibleSize = view.getVisibleSize();
        const designSize = view.getDesignResolutionSize();

        if (visibleSize.width <= designSize.width) {
            this.toggleWidgets(true);
        }
    }

    start() {
        this.onResize();
        window.addEventListener('resize', this.onResize.bind(this));
    }

    onResize() {
        const visibleSize = view.getVisibleSize();
        const designSize = view.getDesignResolutionSize();

        if (visibleSize.width <= designSize.width) {
            this.toggleWidgets(true);
        } else {
            this.toggleWidgets(false);
        }
    }

    private toggleWidgets(enable: boolean) {
        if (this.buttonWidgets && this.buttonWidgets.length > 0) {
            this.buttonWidgets.forEach(widget => {
                widget.enabled = enable;
            });
        }
    }
}
