class MathHelper {
    // push p2 out of p1, I think
    static overlapPolygons(p1, p2) {
        let greatestDistanceSquared = 0;
        let greatestDistanceVector = null;

        for (let i = 0; i < p2.length; i++) {
            const point = p2[i];

            // n2 lets go
            if (!PolygonMath.isPointInPolygon2D(point, p1)) {
                continue;
            }

            let smallestDistanceSquared = Number.MAX_VALUE;
            let smallestDistanceVector = null;
            for (let a = 0; a < p1.length; a++) {
                const curPoint = p1[a];
                const nextPoint = p1[(a + 1) % p1.length];
                const lineSegment = [curPoint, nextPoint];

                const lineSegmentPoint = PolygonMath.nearestPointOnLineSegment(lineSegment, point);
                const dx = lineSegmentPoint[0] - point[0];
                const dy = lineSegmentPoint[1] - point[1];

                const d2 = dx * dx + dy * dy;
                if (d2 < smallestDistanceSquared) {
                    smallestDistanceSquared = d2;
                    smallestDistanceVector = [dx, dy];
                }
            }

            if (smallestDistanceSquared > greatestDistanceSquared && smallestDistanceVector) {
                greatestDistanceSquared = smallestDistanceSquared;
                greatestDistanceVector = smallestDistanceVector;
            }
        }

        for (let i = 0; i < p1.length; i++) {
            const point = p1[i];

            // n2 lets go
            if (!PolygonMath.isPointInPolygon2D(point, p2)) {
                continue;
            }

            let smallestDistanceSquared = Number.MAX_VALUE;
            let smallestDistanceVector = null;
            for (let a = 0; a < p2.length; a++) {
                const curPoint = p2[a];
                const nextPoint = p2[(a + 1) % p2.length];
                const lineSegment = [curPoint, nextPoint];

                const lineSegmentPoint = PolygonMath.nearestPointOnLineSegment(lineSegment, point);
                const dx = lineSegmentPoint[0] - point[0];
                const dy = lineSegmentPoint[1] - point[1];

                const d2 = dx * dx + dy * dy;
                if (d2 < smallestDistanceSquared) {
                    smallestDistanceSquared = d2;
                    smallestDistanceVector = [-dx, -dy];
                }
            }

            if (smallestDistanceSquared > greatestDistanceSquared && smallestDistanceVector) {
                greatestDistanceSquared = smallestDistanceSquared;
                greatestDistanceVector = smallestDistanceVector;
            }
        }

        return greatestDistanceVector;
    }

    static isPointInsideOval(point, center, dimensions) {
        let dx = point[0] - center[0];
        let dy = point[1] - center[1];

        dx /= dimensions[0] / 2;
        dy /= dimensions[1] / 2;

        return dx * dx + dy * dy <= 1;
    }

    static overlapOval(centerA, dimensionsA, centerB, dimensionsB) {
        let dx = centerB[0] - centerA[0];
        let dy = centerB[1] - centerA[1];

        dx /= (dimensionsA[0] + dimensionsB[0]) / 2;
        dy /= (dimensionsA[1] + dimensionsB[1]) / 2;

        return dx * dx + dy * dy <= 1;
    }

    static radiansBetweenAngles(angleFrom, angleTo) {
        if (angleTo < angleFrom) {
            if (angleFrom - angleTo > Math.PI) {
                return Math.PI * 2 - (angleFrom - angleTo);
            } else {
                return -(angleFrom - angleTo);
            }
        } else {
            if (angleTo - angleFrom > Math.PI) {
                return -(Math.PI * 2 - (angleTo - angleFrom));
            } else {
                return angleTo - angleFrom;
            }
        }
    }

    static pointLineSide(point, line) {
        return Math.sign((line[1][0] - line[0][0]) * (point[1] - line[0][1]) - (line[1][1] - line[0][1]) * (point[0] - line[0][0]));
    }
}