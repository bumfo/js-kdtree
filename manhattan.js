var ManhattanDistanceFunction = {
   distance(p1, p2) {
      var d = 0;

      for (var i = p1.length; i-- > 0;)
         d += Math.abs(p1[i] - p2[i]);

      return d;
   },

   distanceToRect(point, min, max) {
      var d = 0;

      for (var i = point.length; i-- > 0;) {
         var diff = 0;
         if (point[i] > max[i])
            diff = (point[i] - max[i]);
         else if (point[i] < min[i])
            diff = (point[i] - min[i]);
         d += Math.abs(diff);
      }

      return d;
   }
};

module.exports = ManhattanDistanceFunction;
