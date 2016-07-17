class KdNode {
	constructor(dimensions, bucketCapacity) {
		// Init base
		this.dimensions = dimensions;
		this.bucketCapacity = bucketCapacity;
		this.size = 0;
		this.singlePoint = true;

		// Init leaf elements
		this.points = new Array(bucketCapacity + 1);
		this.data = new Array(bucketCapacity + 1);

		// Init bounds
		this.minBound = null;
		this.maxBound = null;

		// Init stem
		// this.left = null;
		// this.right = null;
		// this.splitDimension = void 0;
		// this.splitValue = void 0;
	}

	isLeaf() {
		return this.points !== null;
	}

	addPoint(point, value) {
		var cursor = this;
		while (!cursor.isLeaf()) {
			cursor.extendBounds(point);
			cursor.size++;
			if (point[cursor.splitDimension] > cursor.splitValue)
				cursor = cursor.right;
			else
				cursor = cursor.left;
		}
		cursor.addLeafPoint(point, value);
	}
	addLeafPointNoSplit(point, value) {
		this.points[this.size] = point;
		this.data[this.size] = value;
		this.extendBounds(point);
		this.size++;
	}
	addLeafPoint(point, value) {
		this.points[this.size] = point;
		this.data[this.size] = value;
		this.extendBounds(point);
		this.size++;

		if (this.size !== this.points.length - 1)
			return;

		if (this.calculateSplit())
			this.splitLeafNode();
		else
			this.increaseLeafCapacity();
	}
	checkBounds(point) {
		for (var i = 0; i < this.dimensions; i++) {
			if (point[i] > this.maxBound[i]) return false;
			if (point[i] < this.minBound[i]) return false;
		}
		return true;
	}
	extendBounds(point) {
		if (this.minBound === null) {
			this.minBound = point.slice();
			this.maxBound = point.slice();
			return;
		}

		for (var i = 0; i < this.dimensions; i++) {
			if (isNaN(point[i])) {
				if (!isNaN(this.minBound[i]) || !isNaN(this.maxBound[i]))
					this.singlePoint = false;
				this.minBound[i] = NaN;
				this.maxBound[i] = NaN;
			} else if (this.minBound[i] > point[i]) {
				this.minBound[i] = point[i];
				this.singlePoint = false;
			} else if (this.maxBound[i] < point[i]) {
				this.maxBound[i] = point[i];
				this.singlePoint = false;
			}
		}
	}
	increaseLeafCapacity() {
		this.points.length *= 2;
		this.data.length *= 2;
	}
	calculateSplit() {
		if (this.singlePoint) return false;

		var width = 0;
		for (var i = 0; i < this.dimensions; i++) {
			var dwidth = (this.maxBound[i] - this.minBound[i]);
			if (isNaN(dwidth)) dwidth = 0;
			if (dwidth > width) {
				this.splitDimension = i;
				width = dwidth;
			}
		}

		if (width === 0)
			return false;

		// Start the split in the middle of the variance
		this.splitValue = (this.minBound[this.splitDimension] + this.maxBound[this.splitDimension]) * 0.5;

		// Never split on infinity or NaN
		if (this.splitValue === Number.POSITIVE_INFINITY)
			this.splitValue = Number.MAX_VALUE;
		else if (this.splitValue === Number.NEGATIVE_INFINITY)
			this.splitValue = -Number.MAX_VALUE;

		// Don't var the split value be the same as the upper value as
		// can happen due to rounding errors!
		if (this.splitValue === this.maxBound[this.splitDimension])
			this.splitValue = this.minBound[this.splitDimension];

		// Success
		return true;
	}
	splitLeafNode() {
		this.right = new KdNode(this.dimensions, this.bucketCapacity);
		this.left = new KdNode(this.dimensions, this.bucketCapacity);

		// Move locations into children
		for (var i = 0; i < this.size; i++) {
			var oldLocation = this.points[i];
			var oldData = this.data[i];
			if (oldLocation[this.splitDimension] > this.splitValue)
				this.right.addLeafPointNoSplit(oldLocation, oldData);
			else
				this.left.addLeafPointNoSplit(oldLocation, oldData);
		}

		this.points = null;
		this.data = null;
	}
}

module.exports = KdNode;
