# js-kdtree
Javascript Version of [Rednaxela's KdTree](https://bitbucket.org/rednaxela/knn-benchmark/src/de97871b1569/ags/utils/dataStructures/trees/thirdGenKD/?at=default)
## Usage
```javascript
var KdTree = require('./kdtree.js'),
    ManhattanDistanceFunction = require('./manhattan.js');

var tree = new KdTree(2);

for (var i = 0; i < 24; ++i)
    tree.addPoint([i, i], i);

var nearest = tree.findNearestNeighbors([5, 7], 3, ManhattanDistanceFunction);
```
