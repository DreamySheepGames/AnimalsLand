import { _decorator, Component, Prefab, Node, instantiate, Vec3 } from 'cc';
import { MoveSideWay } from "db://assets/Scripts/EnemyAndItems/MoveSideWay";
import {EndlessGameManagerOpponent} from "db://assets/Scripts/GamePlay/EndlessGameManagerOpponent";
const { ccclass, property } = _decorator;

@ccclass('OpponentSpawnEnemyManager')
export class OpponentSpawnEnemyManager extends Component {
    @property({ type: [Prefab] })
    private enemyPrefabs: Prefab[] = [];

    @property(Node)
    private canvas: Node;

    @property({ type: [Node] })
    private spawnPos: Node[] = []; // Array of Nodes for spawn positions

    @property(Node)
    private spawnPosParent: Node; // The parent node of spawn positions

    private spawnX1: number = -262;
    private spawnX2: number = 262;

    private usedYPos: number[] = [];
    private unUsedYPos: number[] = [];

    get UnUsedYPos(): number[] {
        return this.unUsedYPos;
    }

    public spawnEnemy(spawnAmount: number, hasSpeedBurst: boolean) {
        if (spawnAmount > this.spawnPos.length) {
            console.error('Spawn amount exceeds available spawn positions.');
            return;
        }

        // Calculate Y-values based on parent and own position
        const yPositions = this.spawnPos.map(node => {
            if (this.spawnPosParent) {
                return this.spawnPosParent.position.y + node.position.y;
            } else {
                console.error('Spawn positions parent is not set.');
                return 0;
            }
        });

        // Shuffle the Y-values array
        const shuffledYPositions = this.shuffleArray(yPositions.slice());

        // Reset the used and un-used y position
        this.usedYPos = [];
        this.unUsedYPos = [];

        for (let i = 0; i < spawnAmount; i++) {
            const randomIndex = Math.floor(Math.random() * this.enemyPrefabs.length);
            const enemy = instantiate(this.enemyPrefabs[randomIndex]);

            if (this.canvas) {
                enemy.parent = this.canvas; // Set parent to Canvas
            } else {
                console.error("Canvas not found in the scene.");
                return;
            }

            // Randomly select x1 or x2 for X coordinate
            const randomX = Math.random() < 0.5 ? this.spawnX1 : this.spawnX2;

            // Get the Y position from the shuffled Y positions array
            const spawnYPos = shuffledYPositions[i];

            // Set the position of the enemy to (randomX, spawnYPos)
            enemy.setPosition(randomX, spawnYPos, 0);

            // Set move direction based on randomX
            const moveSideway = enemy.getComponent(MoveSideWay);
            if (moveSideway) {
                moveSideway.MoveDirection = randomX == this.spawnX1 ? 1 : -1;
            }

            // Decide if the enemy has speed burst ability or not
            if (hasSpeedBurst)
                enemy.getComponent(MoveSideWay).HasSpeedBurst = true;

            // Push the enemy to the enemyQueue
            EndlessGameManagerOpponent.Instance.enemyQueue.push(enemy);

            // assigned used y position
            this.usedYPos.push(shuffledYPositions[i]);
        }

        // assigned unused y positions
        for (let i = 0; i < shuffledYPositions.length; i++) {
            // Check if shuffledYPositions[i] is not in usedYPos
            if (this.usedYPos.indexOf(shuffledYPositions[i]) === -1) {
                // If not, push the value into unUsedYPos
                this.unUsedYPos.push(shuffledYPositions[i]);
            }
        }

    }

    // Utility function to shuffle an array
    private shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }
}
