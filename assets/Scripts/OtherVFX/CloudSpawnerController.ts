import { _decorator, Component, Node, instantiate, tween, Vec3, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CloudSpawnerController')
export class CloudSpawnerController extends Component {
    @property({ type: [Prefab] })
    private cloudPrefabs: Prefab[] = [];

    private leftSpawnX: number = -330;
    private rightSpawnX: number = 330;

    private minSpawnY: number = -327;
    private maxSpawnY: number = 327;

    private minCountdown: number = 1;
    private maxCountdown: number = 3;

    private maxChildrenCount: number = 4;  // Cap for number of clouds allowed on screen

    private tweenSpeed: number = 0.25;

    start() {
        this.spawnCloudRepeatedly();
    }

    private spawnCloudRepeatedly() {
        const countdown = 2;
        this.schedule(() => {
            // Randomize countdown duration for next spawn
            //const countdown = this.randomRange(this.minCountdown, this.maxCountdown);

            // Randomize spawn position (X and Y)
            const spawnX = Math.random() > 0.5 ? this.leftSpawnX : this.rightSpawnX;  // Choose left or right spawn
            const spawnY = this.randomRange(this.minSpawnY, this.maxSpawnY);

            // Choose a random cloud prefab to instantiate
            const randomCloudIndex = Math.floor(Math.random() * this.cloudPrefabs.length);
            const cloudPrefab = this.cloudPrefabs[randomCloudIndex];

            // Instantiate and position the cloud
            if (this.node.children.length <= this.maxChildrenCount) {
                const cloud = instantiate(cloudPrefab);
                console.log("spawn cloud");
                cloud.setPosition(spawnX, spawnY, 0);
                this.node.addChild(cloud);  // Add cloud as child of this node
            }
            // Repeat the process
            //this.spawnCloudRepeatedly();
        }, countdown);
    }

    public moveAllCloudsDown(moveDownDistance: number) {
        // Iterate over all children (clouds) and move them down
        this.node.children.forEach((cloud) => {
            const currentPos = cloud.getPosition();

            // Tween to move the cloud down
            tween(cloud)
                .to(this.tweenSpeed, { position: new Vec3(currentPos.x, currentPos.y - moveDownDistance, currentPos.z) }, { easing: 'circOut' })
                .start();

            // If the cloud is out of bounds, destroy it
            if (currentPos.y < -330) {
                cloud.destroy();
                console.log("cloud destroyed");
            }
        });
    }

    // Helper function to generate a random number in a range
    private randomRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}
