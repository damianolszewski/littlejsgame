/**
 * PoissonDiskSampler: Generates a guaranteed number of evenly spaced points.
 */
class PoissonDiskSampler {
    /**
     * @param {number} leftBound - Minimum x-coordinate of the area.
     * @param {number} rightBound - Maximum x-coordinate of the area.
     * @param {number} bottomBound - Minimum y-coordinate of the area.
     * @param {number} topBound - Maximum y-coordinate of the area.
     * @param {number} numPoints - Exact number of points to generate.
     * @param {number} radius - Desired minimum distance between points.
     */
    constructor(leftBound, rightBound, bottomBound, topBound, numPoints, radius) {
        this.leftBound = leftBound;
        this.rightBound = rightBound;
        this.bottomBound = bottomBound;
        this.topBound = topBound;
        this.numPoints = numPoints;
        this.radius = radius;

        this.cellSize = radius / Math.sqrt(2);
        this.cols = Math.ceil((rightBound - leftBound) / this.cellSize);
        this.rows = Math.ceil((topBound - bottomBound) / this.cellSize);

        this.points = [];               // Final list of points
        this.processList = [];          // Active list of points to process
        this.grid = Array(this.cols * this.rows).fill(-1); // Grid for spatial lookups
        this.k = 30;                    // Attempts to place points around each base point
    }

    /**
     * Converts (x, y) coordinates to a grid index.
     */
    getIndex(x, y) {
        const col = Math.floor((x - this.leftBound) / this.cellSize);
        const row = Math.floor((y - this.bottomBound) / this.cellSize);
        return col >= 0 && col < this.cols && row >= 0 && row < this.rows
            ? row * this.cols + col
            : -1;
    }

    /**
     * Checks if a point (x, y) is valid.
     */
    isValid(x, y) {
        if (x < this.leftBound || x > this.rightBound || y < this.bottomBound || y > this.topBound) {
            return false;
        }

        const col = Math.floor((x - this.leftBound) / this.cellSize);
        const row = Math.floor((y - this.bottomBound) / this.cellSize);

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const neighborIndex = this.getIndex(
                    (col + i) * this.cellSize + this.leftBound,
                    (row + j) * this.cellSize + this.bottomBound
                );
                if (neighborIndex !== -1 && this.grid[neighborIndex] !== -1) {
                    const neighbor = this.points[this.grid[neighborIndex]];
                    if (neighbor && Math.hypot(neighbor.x - x, neighbor.y - y) < this.radius) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Adds a point to the grid and active list.
     */
    addPoint(x, y) {
        const point = vec2(x, y);
        this.points.push(point);
        this.processList.push(point);
        const index = this.getIndex(x, y);
        if (index !== -1) this.grid[index] = this.points.length - 1;
    }

    /**
     * Generates points using Poisson Disk Sampling.
     */
    generatePoints() {
        // Phase 1: Poisson Disk Sampling
        this.addPoint(
            this.leftBound + Math.random() * (this.rightBound - this.leftBound),
            this.bottomBound + Math.random() * (this.topBound - this.bottomBound)
        );

        while (this.processList.length > 0 && this.points.length < this.numPoints) {
            const basePoint = this.processList.pop();

            for (let i = 0; i < this.k; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const dist = this.radius * (1 + Math.random());
                const newX = basePoint.x + Math.cos(angle) * dist;
                const newY = basePoint.y + Math.sin(angle) * dist;

                if (this.isValid(newX, newY)) {
                    this.addPoint(newX, newY);
                    if (this.points.length >= this.numPoints) break;
                }
            }
        }

        // Phase 2: Fill Remaining Points Randomly
        while (this.points.length < this.numPoints) {
            const randomX = this.leftBound + Math.random() * (this.rightBound - this.leftBound);
            const randomY = this.bottomBound + Math.random() * (this.topBound - this.bottomBound);
            this.addPoint(randomX, randomY);
        }

        return this.points;
    }
}
