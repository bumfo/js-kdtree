/**
 * An implementation of an implicit binary heap. Min-heap and max-heap both supported
 */

var defaultCapacity = 64;

var BinaryHeap = function(capacity, direction) {
	this.direction = direction;
	this.data = new Array(capacity);
	this.keys = new Array(capacity);
	this.capacity = capacity;
	this.size = 0;
};
BinaryHeap.prototype = {
    __proto__: null,

	offer(key, value) {
		// If move room is needed, double array size
		if (this.size >= this.capacity) {
            this.capacity *= 2;
			this.data.length = this.capacity;
            this.keys.length = this.capacity;
		}

		// Insert new value at the end
		this.data[this.size] = value;
		this.keys[this.size] = key;
		this.siftUp(this.size);
		this.size++;
	},

	removeTip() {
		if (this.size == 0)
			throw new IllegalStateException();

		this.size--;
		this.data[0] = this.data[this.size];
		this.keys[0] = this.keys[this.size];
		this.data[this.size] = null;
		this.siftDown(0);
	},

	replaceTip(key, value) {
		if (this.size == 0)
			throw new IllegalStateException();

		this.data[0] = value;
		this.keys[0] = key;
		this.siftDown(0);
	},

	getTip() {
		if (this.size == 0)
			throw new IllegalStateException();

		return this.data[0];
	},

	getTipKey() {
		if (this.size == 0)
			throw new IllegalStateException();

		return this.keys[0];
	},

	siftUp(c) {
		for (var p = (c - 1) / 2; c != 0 && this.direction * this.keys[c] > this.direction * this.keys[p]; c = p, p = (c - 1) / 2) {
			var pData = this.data[p];
			var pDist = this.keys[p];
			this.data[p] = this.data[c];
			this.keys[p] = this.keys[c];
			this.data[c] = pData;
			this.keys[c] = pDist;
		}
	},

	siftDown(p) {
		for (var c = p * 2 + 1; c < this.size; p = c, c = p * 2 + 1) {
			if (c + 1 < this.size && this.direction * this.keys[c] < this.direction * this.keys[c + 1])
				c++;
			if (this.direction * this.keys[p] < this.direction * this.keys[c]) {
				// Swap the points
				var pData = this.data[p];
				var pDist = this.keys[p];
				this.data[p] = this.data[c];
				this.keys[p] = this.keys[c];
				this.data[c] = pData;
				this.keys[c] = pDist;
			} else
				break;
		}
	},

};

BinaryHeap.Max = function(capacity) {
    this.BinaryHeap(capacity || defaultCapacity, 1);
};
BinaryHeap.Max.prototype = {
    __proto__: BinaryHeap.prototype,
    BinaryHeap,

    removeMax() {
        this.removeTip();
    },
    replaceMax(key, value) {
        this.replaceTip(key, value);
    },
    getMax() {
        return this.getTip();
    },
    getMaxKey() {
        return this.getTipKey();
    },
};

BinaryHeap.Min = function(capacity) {
    this.BinaryHeap(capacity || defaultCapacity, -1);
};
BinaryHeap.Min.prototype = {
    __proto__: BinaryHeap.prototype,
    BinaryHeap,

    removeMin() {
        this.removeTip();
    },
    replaceMin(key, value) {
        this.replaceTip(key, value);
    },
    getMin() {
        return this.getTip();
    },
    getMinKey() {
        return this.getTipKey();
    },
};

module.exports = BinaryHeap;

function IllegalStateException() {
    return new Error('IllegalStateException');
}
