import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
import {SpawnEnemyManager} from "db://assets/Scripts/GamePlay/SpawnEnemyManager";
const { ccclass, property } = _decorator;

@ccclass('SpawnDiamondManager')
export class SpawnDiamondManager extends Component {
    @property({ type: [Prefab] })
    private diamondPrefab: Prefab[] = [];

    @property(SpawnEnemyManager)
    private spawnEnemyManager: SpawnEnemyManager;

    @property(Node)
    private canvas: Node;

    @property
    private spawnRate:number = 0.7;    // after scoring, diamond will be spawned with this rate

    private spawnX1: number = -262;
    private spawnX2: number = 262;
    private spawnYPositions: number[] = [];

    private usedYPos: number[] = [];
    private unUsedYPos: number[] = [];

    get UnUsedYPos(): number[] {
        return this.unUsedYPos;
    }

    spawnDiamond()
    {
        // Randomly select x1 or x2 for X coordinate
        const randomX = Math.random() < 0.5 ? this.spawnX1 : this.spawnX2;

        // Get y positions
        this.spawnYPositions = this.spawnEnemyManager.UnUsedYPos;
        const randomY = this.spawnYPositions[Math.floor(Math.random() * this.spawnYPositions.length)];

        // Decide if we should spawn or not
        let shouldSpawn = Math.random() <= this.spawnRate ? true : false;

        // Reset used and un-used y pos
        this.usedYPos = [];
        this.unUsedYPos = [];

        if (shouldSpawn)
        {
            // Spawn blue diamond
            const diamond = instantiate(this.diamondPrefab[0]);

            if (this.canvas) {
                diamond.parent = this.canvas; // Set parent to Canvas
            } else {
                console.error("Canvas not found in the scene.");
                return;
            }

            // Set the position of the diamond to (randomX, spawnYPos)
            diamond.setPosition(randomX, randomY, 0);

            // Mark used y pos
            this.usedYPos.push(randomY);
        }

        // assigned unused y positions
        for (let i = 0; i < this.spawnYPositions.length; i++) {
            // Check if shuffledYPositions[i] is not in usedYPos
            if (this.usedYPos.indexOf(this.spawnYPositions[i]) === -1) {
                // If not, push the value into unUsedYPos
                this.unUsedYPos.push(this.spawnYPositions[i]);
            }
        }
    }
}


