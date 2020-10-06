const PolygonMath = {
    overlapAABB: (aabb1, aabb2) => {
        return aabb1[0][0] <= aabb2[1][0] && aabb1[1][0] > aabb2[0][0] && aabb1[0][1] <= aabb2[1][1] && aabb1[1][1] > aabb2[0][1];
    },

    isPointInPolygon2D: (point, polygon) => {
        let j = polygon.length - 1;
        let oddNodes = false;

        for (let i = 0; i < polygon.length; i++) {
            if ((polygon[i][1] < point[1] && polygon[j][1] >= point[1]
                || polygon[j][1] < point[1] && polygon[i][1] >= point[1])
                && (polygon[i][0] <= point[0] || polygon[j][0] <= point[0])) {
                if (polygon[i][0] + (point[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1])
                    * (polygon[j][0] - polygon[i][0]) < point[0]) {
                    oddNodes = !oddNodes;
                }
            }

            j = i;
        }

        return oddNodes;
    },

    nearestPointOnLineSegment: (line, point) => {
        let length2 = PolygonMath._lengthSquared(line);
        if (length2 === 0) {
            return [line[0][0], line[0][1]];
        }

        let t = ((point[0] - line[0][0]) * (line[1][0] - line[0][0]) + (point[1] - line[0][1]) * (line[1][1] - line[0][1])) / length2;
        if (t < 0) {
            return [line[0][0], line[0][1]];
        }
        if (t > 1) {
            return [line[1][0], line[1][1]];
        }

        return [line[0][0] + t * (line[1][0] - line[0][0]), line[0][1] + t * (line[1][1] - line[0][1])];
    },

    isCCW: (polygon) => {
        let sum = 0;

        for (let index = 0; index < polygon.length; index++) {
            const nextIndex = (index + 1) % polygon.length;

            let currentVertex = [0, 0];
            let nextVertex = [0, 0];

            currentVertex[0] = polygon[index][0];
            currentVertex[1] = polygon[index][1];
            nextVertex[0] = polygon[nextIndex][0];
            nextVertex[1] = polygon[nextIndex][1];

            sum += (nextVertex[0] - currentVertex[0]) * (nextVertex[1] + currentVertex[1]);
        }

        if (!sum) {
            return null;
        }

        return sum < 0;
    },

    _lengthSquared: (line) => {
        const dx = line[1][0] - line[0][0];
        const dy = line[1][1] - line[0][1];

        return dx * dx + dy * dy;
    },
};