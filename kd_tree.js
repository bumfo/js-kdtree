const KdNode = require('./kd_node.js');
const BinaryHeap = require('./binary_heap.js');
const NearestNeighborIterator = require('./nn_iterator.js');

class KdTree extends KdNode {
	constructor(dimensions, bucketCapacity) {
		super(dimensions, bucketCapacity || 24);
	}

	getNearestNeighborIterator(searchPoint, maxPointsReturned, distanceFunction) {
		return new NearestNeighborIterator(this, searchPoint, maxPointsReturned, distanceFunction);
	}
	findNearestNeighbors(searchPoint, maxPointsReturned, distanceFunction) {
		var pendingPaths = new BinaryHeap.Min();
		var evaluatedPoints = new BinaryHeap.Max();
		var pointsRemaining = Math.min(maxPointsReturned, this.size);
		pendingPaths.offer(0, this);

		while (pendingPaths.size > 0 && (evaluatedPoints.size < pointsRemaining || (pendingPaths.getMinKey() < evaluatedPoints.getMaxKey())))
			this.nearestNeighborSearchStep(pendingPaths, evaluatedPoints, pointsRemaining, distanceFunction, searchPoint);

		return evaluatedPoints;
	}
	nearestNeighborSearchStep(pendingPaths, evaluatedPoints, desiredPoints, distanceFunction, searchPoint) {
		// If there are pending paths possibly closer than the nearest evaluated point, check it out
		var cursor = pendingPaths.getMin();
		pendingPaths.removeMin();

		// Descend the tree, recording paths not taken
		while (!cursor.isLeaf()) {
			var pathNotTaken;
			if (searchPoint[cursor.splitDimension] > cursor.splitValue) {
				pathNotTaken = cursor.left;
				cursor = cursor.right;
			} else {
				pathNotTaken = cursor.right;
				cursor = cursor.left;
			}
			var otherDistance = distanceFunction.distanceToRect(searchPoint, pathNotTaken.minBound, pathNotTaken.maxBound);
			// Only add a path if we either need more points or it's closer than furthest point on list so far
			if (evaluatedPoints.size < desiredPoints || otherDistance <= evaluatedPoints.getMaxKey())
				pendingPaths.offer(otherDistance, pathNotTaken);
		}

		if (cursor.singlePoint) {
			var nodeDistance = distanceFunction.distance(cursor.points[0], searchPoint);
			// Only add a point if either need more points or it's closer than furthest on list so far
			if (evaluatedPoints.size < desiredPoints || nodeDistance <= evaluatedPoints.getMaxKey()) {
				for (var i = 0; i < cursor.size; i++) {
					var value = cursor.data[i];

					// If we don't need any more, replace max
					if (evaluatedPoints.size === desiredPoints)
						evaluatedPoints.replaceMax(nodeDistance, value);
					else
						evaluatedPoints.offer(nodeDistance, value);
				}
			}
		} else {
			// Add the points at the cursor
			for (var i = 0; i < cursor.size; i++) {
				var point = cursor.points[i];
				var value = cursor.data[i];
				var distance = distanceFunction.distance(point, searchPoint);
				// Only add a point if either need more points or it's closer than furthest on list so far
				if (evaluatedPoints.size < desiredPoints)
					evaluatedPoints.offer(distance, value);
				else if (distance < evaluatedPoints.getMaxKey())
					evaluatedPoints.replaceMax(distance, value);
			}
		}
	}
}

module.exports = KdTree;
