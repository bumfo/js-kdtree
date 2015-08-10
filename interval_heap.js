/**
 * An implementation of an implicit binary interval heap.
 */
var defaultCapacity = 64;

var IntervalHeap = function(capacity) {
	this.data = new Array(capacity);
	this.keys = new Array(capacity);
	this.capacity = capacity || defaultCapacity;
	this.size = 0;
};
IntervalHeap.prototype = {
	__proto__: null,

	offer(key, value) {
		// If move room is needed, double array size
		if (this.size >= this.capacity) {
			this.capacity *= 2;
			this.data.length = this.capacity;
			this.keys.length = this.capacity;
		}

		// Insert new value at the end
		this.size++;
		this.data[this.size - 1] = value;
		this.keys[this.size - 1] = key;
		this.siftInsertedValueUp();
	},

	removeMin() {
		if (this.size == 0)
			throw new IllegalStateException();

		this.size--;
		this.data[0] = this.data[this.size];
		this.keys[0] = this.keys[this.size];
		this.data[this.size] = null;
		this.siftDownMin(0);
	},

	replaceMin(key, value) {
		if (this.size == 0)
			throw new IllegalStateException();

		this.data[0] = value;
		this.keys[0] = key;
		if (this.size > 1) {
			// Swap with pair if necessary
			if (this.keys[1] < key)
				this.swap(0, 1);
			this.siftDownMin(0);
		}
	},

	removeMax() {
		if (this.size == 0)
			throw new IllegalStateException();
        else if (this.size == 1) {
			this.removeMin();
			return;
		}

		this.size--;
		this.data[1] = this.data[this.size];
		this.keys[1] = this.keys[this.size];
		this.data[this.size] = null;
		this.siftDownMax(1);
	},

	replaceMax(key, value) {
		if (this.size == 0)
			throw new IllegalStateException();
        else if (this.size == 1) {
			this.replaceMin(key, value);
			return;
		}

		this.data[1] = value;
		this.keys[1] = key;
		// Swap with pair if necessary
		if (key < this.keys[0])
			this.swap(0, 1);
		this.siftDownMax(1);
	},

	getMin() {
		if (this.size == 0)
			throw new IllegalStateException();

		return this.data[0];
	},

	getMax() {
		if (this.size == 0)
			throw new IllegalStateException();
        else if (this.size == 1)
			return this.data[0];

		return this.data[1];
	},

	getMinKey() {
		if (this.size == 0)
			throw new IllegalStateException();

		return this.keys[0];
	},

	getMaxKey() {
		if (this.size == 0)
			throw new IllegalStateException();
        else if (this.size == 1)
			return this.keys[0];

		return this.keys[1];
	},

	swap(x, y) {
		var yData = this.data[y];
		var yDist = this.keys[y];
		this.data[y] = this.data[x];
		this.keys[y] = this.keys[x];
		this.data[x] = yData;
		this.keys[x] = yDist;
		return y;
	},

	/**
	 * Min-side (u % 2 == 0):
	 * - leftchild:  2u + 2
	 * - rightchild: 2u + 4
	 * - parent:     (x/2-1)&~1
	 *
	 * Max-side (u % 2 == 1):
	 * - leftchild:  2u + 1
	 * - rightchild: 2u + 3
	 * - parent:     (x/2-1)|1
	 */

	siftInsertedValueUp() {
		var u = this.size - 1;
		if (u == 0)
			;// Do nothing if it's the only element!
        else if (u == 1) {
			// If it is the second element, just sort it with it's pair
			if (this.keys[u] < this.keys[u - 1]) { // If less than it's pair
				this.swap(u, u - 1); // Swap with it's pair
			}
		} else if (u % 2 == 1) {
			// Already paired. Ensure pair is ordered right
			var p = (u / 2 - 1) | 1; // The larger value of the parent pair
			if (this.keys[u] < this.keys[u - 1]) { // If less than it's pair
				u = this.swap(u, u - 1); // Swap with it's pair
				if (this.keys[u] < this.keys[p - 1]) { // If smaller than smaller parent pair
					// Swap into min-heap side
					u = this.swap(u, p - 1);
					this.siftUpMin(u);
				}
			} else {
				if (this.keys[u] > this.keys[p]) { // If larger that larger parent pair
					// Swap into max-heap side
					u = this.swap(u, p);
					this.siftUpMax(u);
				}
			}
		} else {
			// Inserted in the lower-value slot without a partner
			var p = (u / 2 - 1) | 1; // The larger value of the parent pair
			if (this.keys[u] > this.keys[p]) { // If larger that larger parent pair
				// Swap into max-heap side
				u = this.swap(u, p);
				this.siftUpMax(u);
			} else if (this.keys[u] < this.keys[p - 1]) { // If smaller than smaller parent pair
				// Swap into min-heap side
				u = this.swap(u, p - 1);
				this.siftUpMin(u);
			}
		}
	},

	siftUpMin(c) {
		// Min-side parent: (x/2-1)&~1
		for (var p = (c / 2 - 1) & ~1; p >= 0 && this.keys[c] < this.keys[p]; c = p, p = (c / 2 - 1) & ~1) {
			this.swap(c, p);
		}
	},

	siftUpMax(c) {
		// Max-side parent: (x/2-1)|1
		for (var p = (c / 2 - 1) | 1; p >= 0 && this.keys[c] > this.keys[p]; c = p, p = (c / 2 - 1) | 1) {
			this.swap(c, p);
		}
	},

	siftDownMin(p) {
		for (var c = p * 2 + 2; c < this.size; p = c, c = p * 2 + 2) {
			if (c + 2 < this.size && this.keys[c + 2] < this.keys[c])
				c += 2;
			if (this.keys[c] < this.keys[p]) {
				this.swap(p, c);
				// Swap with pair if necessary
				if (c + 1 < this.size && this.keys[c + 1] < this.keys[c])
					this.swap(c, c + 1);
			} else {
				break;
			}
		}
	},

	siftDownMax(p) {
		for (var c = p * 2 + 1; c <= this.size; p = c, c = p * 2 + 1) {
			if (c == this.size) {
				// If the left child only has half a pair
				if (this.keys[c - 1] > this.keys[p])
					this.swap(p, c - 1);
				break;
			} else if (c + 2 == this.size) {
				// If there is only room for a right child lower pair
				if (this.keys[c + 1] > this.keys[c]) {
					if (this.keys[c + 1] > this.keys[p])
						this.swap(p, c + 1);
					break;
				}
			} else if (c + 2 < this.size) {
				// If there is room for a right child upper pair
				if (this.keys[c + 2] > this.keys[c])
					c += 2;
			}
			if (this.keys[c] > this.keys[p]) {
				this.swap(p, c);
				// Swap with pair if necessary
				if (this.keys[c - 1] > this.keys[c])
					this.swap(c, c - 1);
			} else {
				break;
			}
		}
	},

	toString() {
		// java.text.DecimalFormat twoPlaces = new java.text.DecimalFormat("0.00");
		// StringBuffer str = new StringBuffer(IntervalHeap.class.getCanonicalName());
		// str.append(", this.size: ").append(this.size()).append(" this.capacity: ").append(this.capacity());
		// var i = 0, p = 2;
		// while (i < this.size()) {
		// 	var x = 0;
		// 	str.append("\t");
		// 	while ((i + x) < this.size() && x < p) {
		// 		str.append(twoPlaces.format(this.keys[i + x])).append(", ");
		// 		x++;
		// 	}
		// 	str.append("\n");
		// 	i += x;
		// 	p *= 2;
		// }
		// return str.toString();
	},

	validateHeap() {
		// Validate left-right
		for (var i = 0; i < this.size - 1; i += 2) {
			if (this.keys[i] > this.keys[i + 1]) return false;
		}
		// Validate within parent interval
		for (var i = 2; i < this.size; i++) {
			var maxParent = this.keys[(i / 2 - 1) | 1];
			var minParent = this.keys[(i / 2 - 1) & ~1];
			if (this.keys[i] > maxParent || this.keys[i] < minParent) return false;
		}
		return true;
	},
}
