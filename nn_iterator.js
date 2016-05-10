const BinaryHeap = require('./binary_heap.js');
const IntervalHeap = require('./interval_heap.js');

class NearestNeighborIterator {
	constructor(treeRoot, searchPoint, maxPointsReturned, distanceFunction) {
		this.searchPoint = searchPoint.slice();
		this.pointsRemaining = Math.min(maxPointsReturned, treeRoot.size);
		this.distanceFunction = distanceFunction;
		this.pendingPaths = new BinaryHeap.Min();
		this.pendingPaths.offer(0, treeRoot);
		this.evaluatedPoints = new IntervalHeap();
	}
	hasNext() {
		return pointsRemaining > 0;
	}
	next() {
		if (!hasNext()) {
			throw new IllegalStateException("NearestNeighborIterator has reached end!");
		}

		while (pendingPaths.size > 0 && (evaluatedPoints.size === 0 || (pendingPaths.getMinKey() < evaluatedPoints.getMinKey()))) {
			KdTree.nearestNeighborSearchStep(pendingPaths, evaluatedPoints, pointsRemaining, distanceFunction, searchPoint);
		}

		// Return the smallest distance point
		pointsRemaining--;
		lastDistanceReturned = evaluatedPoints.getMinKey();
		var value = evaluatedPoints.getMin();
		evaluatedPoints.removeMin();
		return value;
	}
	distance() {
		return lastDistanceReturned;
	}
	remove() {
		throw new UnsupportedOperationException();
	}
	iterator() {
		return this;
	}
}

module.exports = NearestNeighborIterator;

function UnsupportedOperationException() {
	return new Error('UnsupportedOperationException');
}

function IllegalStateException(msg) {
	return new Error('IllegalStateException: ' + msg);
}
