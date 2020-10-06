const hermite = (t, points, tangentials) => {
    const n1 = 2 * t * t * t - 3 * t * t + 1;
    const n2 = t * t * t - 2 * t * t + t;
    const n3 = -2 * t * t * t + 3 * t * t;
    const n4 = t * t * t - t * t;

    return [
        n1 * points[0][0] + n2 * tangentials[0][0] + n3 * points[1][0] + n4 * tangentials[1][0],
        n1 * points[0][1] + n2 * tangentials[0][1] + n3 * points[1][1] + n4 * tangentials[1][1],
    ];
};