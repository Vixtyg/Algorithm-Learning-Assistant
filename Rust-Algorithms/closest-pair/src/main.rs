#![allow(warnings)]
use rand::RngExt;
use std::cmp;
use std::cmp::min;
use wasm_bindgen::prelude::*;

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
#[wasm_bindgen]
struct Point {
    x: u32,
    y: u32,
    scannedRadius: u32,
    closestPoint: Option<[u32; 2]>,
    closestDistance: Option<u32>,
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
#[wasm_bindgen]
struct Canvas {
    x: u32,
    y: u32,
    pointsSortedByX: Vec<Point>,
    pointsSortedByY: Vec<Point>,
    pointsAmount: u32,
    operations: Vec<String>,
    closestDistance: u32,
}

type coordinateVector = Vec<Point>;


#[wasm_bindgen]
impl Canvas {
    #[wasm_bindgen]
    pub fn initializeCanvas(&mut self, amount: u32, xsize: u32, ysize: u32) {
        let mut closestDistance = 0;
        self.x = xsize;
        self.y = ysize;
        self.pointsAmount = amount;
        let [sortedByX, sortedByY] = initialize_random_points(amount, xsize, ysize);
        self.pointsSortedByX = sortedByX.clone();
        self.pointsSortedByY = sortedByY.clone();
        self.operations = returnClosestPoints(sortedByX, sortedByY, &mut closestDistance);
        self.closestDistance = closestDistance;
    }
    #[wasm_bindgen]
    pub fn  returnPointsX(&self) -> Vec<String> {
        let points = self.pointsSortedByX.clone();
        points
            .into_iter()
            .map(|node| format!("({},{})", node.x, node.y))
            .collect::<Vec<String>>()
    }
    #[wasm_bindgen]
    pub fn returnPointsY(&self) -> Vec<Point> {
        self.pointsSortedByY.clone()
    }
    #[wasm_bindgen]
    pub fn returnOperation(&self) -> Vec<String> {
        self.operations.clone()
    }
    #[wasm_bindgen]
    pub fn returnClosestDistance(&self) -> u32 {
        self.closestDistance.clone()
    }
}

fn main() {
    let mut instance = instantiateStruct();
    instance.initializeCanvas(10, 500, 500);
    println!("{:#?}", instance.returnOperation());
}

#[wasm_bindgen]
pub fn instantiateStruct() -> Canvas {
    let emptyPoint = Point {
        x: 0,
        y: 0,
        scannedRadius: 0,
        closestPoint: None,
        closestDistance: None,
    };
    Canvas {
        x: 0,
        y: 0,
        pointsSortedByX: vec![emptyPoint.clone()],
        pointsSortedByY: vec![emptyPoint.clone()],
        pointsAmount: 0,
        operations: vec!["".to_string()],
        closestDistance: 0,
    }
}

pub fn returnClosestPoints(
    pointsX: Vec<Point>,
    pointsY: Vec<Point>,
    closestDistance: &mut u32,
) -> Vec<String> {
    let mut orderVector = Vec::new();
    let mut initializedPoints = vec![pointsX, pointsY];
    *closestDistance = closestPair(
        &mut initializedPoints[0].clone(),
        &mut initializedPoints[1],
        500,
        &mut orderVector,
    )
    .unwrap();
    orderVector
}

#[wasm_bindgen]
pub fn initializeClosestPointsX(amount: u32, xSize: u32, ySize: u32) -> Vec<Point> {
    let mut initializedPoints = initialize_random_points(amount, xSize, ySize);
    initializedPoints[0].clone()
}

#[wasm_bindgen]
pub fn initializeClosestPointsY(amount: u32, xSize: u32, ySize: u32) -> Vec<Point> {
    let mut initializedPoints = initialize_random_points(amount, xSize, ySize);
    initializedPoints[1].clone()
}

fn initialize_random_points(amount: u32, canvasX: u32, canvasY: u32) -> [Vec<Point>; 2] {
    let mut coordinateVector = Vec::new();
    let mut rng = rand::rng();
    for _ in (0..amount) {
        let mut xPos: u32 = rng.random_range(0..canvasX);
        let mut yPos: u32 = rng.random_range(0..canvasY);
        let mut initializedPoint = Point {
            x: xPos,
            y: yPos,
            scannedRadius: 2,
            closestPoint: None,
            closestDistance: None,
        };
        coordinateVector.push(initializedPoint)
    }
    coordinateVector.sort_by(|a, b| a.x.cmp(&b.x));
    let mut clonedY = coordinateVector.clone();
    clonedY.sort_by(|a, b| a.y.cmp(&b.y));
    return [coordinateVector, clonedY];
}
fn closestPair(
    coordinateVector: &mut [Point],
    coordinateVectorY: &mut [Point],
    canvasX: u32,
    orderCollector: &mut Vec<String>,
) -> Option<u32> {
    if coordinateVector.len() == 1 {
        let message = format!(
            "b: ({},{}).",
            &coordinateVector[0].x, &coordinateVector[0].y
        );
        orderCollector.push(message);
        return Some(999999);
    }
    if coordinateVector.len() == 2 {
        coordinateVector[0].closestDistance = Some(calculateDistance(
            &coordinateVector[0],
            &coordinateVector[1],
        ));
        coordinateVector[1].closestDistance = Some(calculateDistance(
            &coordinateVector[0],
            &coordinateVector[1],
        ));
        let message = format!(
            "n: ({},{}), ({},{}).",
            &coordinateVector[0].x,
            &coordinateVector[0].y,
            &coordinateVector[1].x,
            &coordinateVector[1].y
        );
        orderCollector.push(message);
        return coordinateVector[0].closestDistance;
    }
    if coordinateVector.len() == 3 {
        //We compare using brute force all paths branhcing from the 3 nodes.
        //Node 0 to 1, 0 to 2 (is reciprocated, 3 to 0 and 1 to 0), Determines
        //Shortest path for Nodes 0 and 3

        //Node 1 to 2 is to be compared with 0 to 2 and 0 to 1
        let distAToB = calculateDistance(&coordinateVector[0], &coordinateVector[1]);
        let distAToC = calculateDistance(&coordinateVector[0], &coordinateVector[2]);
        let distBToC = calculateDistance(&coordinateVector[1], &coordinateVector[2]);

        if (distAToB <= distAToC && distAToB <= distBToC) {
            coordinateVector[0].closestDistance = Some(distAToB);
            coordinateVector[1].closestDistance = Some(distAToB);
            let message = format!(
                "N: ({}, {}), ({},{}), ({},{}). ",
                &coordinateVector[0].x,
                &coordinateVector[0].y,
                &coordinateVector[1].x,
                &coordinateVector[1].y,
                &coordinateVector[2].x,
                &coordinateVector[2].y
            );
            orderCollector.push(message);
            return coordinateVector[0].closestDistance;
        }
        if (distAToC <= distAToB && distAToC <= distBToC) {
            coordinateVector[0].closestDistance = Some(distAToC);
            coordinateVector[2].closestDistance = Some(distAToC);

            let message = format!(
                "N: ({}, {}), ({},{}), ({},{}). ",
                &coordinateVector[0].x,
                &coordinateVector[0].y,
                &coordinateVector[1].x,
                &coordinateVector[1].y,
                &coordinateVector[2].x,
                &coordinateVector[2].y
            );
            orderCollector.push(message);
            return coordinateVector[2].closestDistance;
        }
        if (distBToC <= distAToB && distBToC <= distAToC) {
            coordinateVector[1].closestDistance = Some(distBToC);
            coordinateVector[2].closestDistance = Some(distBToC);

            let message = format!(
                "N: ({}, {}), ({},{}), ({},{}). ",
                &coordinateVector[0].x,
                &coordinateVector[0].y,
                &coordinateVector[1].x,
                &coordinateVector[1].y,
                &coordinateVector[2].x,
                &coordinateVector[2].y
            );
            orderCollector.push(message);
            return coordinateVector[1].closestDistance;
        }
    }
    let lengthOfVec = (coordinateVector.len() / 2);
    let (leftHalf, rightHalf) = &mut coordinateVector.split_at_mut(lengthOfVec);
    let midPoint = leftHalf[leftHalf.len() - 1].x as u32;
    let shortestLeft = closestPair(leftHalf, coordinateVectorY, midPoint, orderCollector);
    let shortestRight = closestPair(rightHalf, coordinateVectorY, midPoint, orderCollector);
    let minOfSides = min(shortestLeft, shortestRight);
    if shortestLeft > shortestRight {
        let closestMidPair = closestMidPair(
            &coordinateVectorY,
            midPoint,
            shortestRight.unwrap(),
            orderCollector,
        );
        return min(shortestRight, closestMidPair);
    } else {
        let closestMidPair = closestMidPair(
            &coordinateVectorY,
            midPoint,
            shortestLeft.unwrap(),
            orderCollector,
        );
        return min(shortestLeft, closestMidPair);
    }
}
fn closestMidPair(
    middleStrip1: &[Point],
    cutOffLine: u32,
    shortestDist: u32,
    orderCollector: &mut Vec<String>,
) -> Option<u32> {
    let mut newMin = shortestDist;
    let mut middleStrip = middleStrip1
        .iter()
        .filter(|&node| ((node.x as i32 - cutOffLine as i32).abs() as u32) < shortestDist)
        .collect::<Vec<&Point>>();
    for i in (0..middleStrip.len()) {
        let pointP = &middleStrip[i];
        let upperBound = min(i + 8, middleStrip.len());
        let lowerBound = min(i + 1, middleStrip.len());
        for j in (lowerBound..upperBound) {
            let pointQ = &middleStrip[j];
            println!("POINT Q {pointQ:?}");
            let message = format!(""
            );
            if ((((pointP.x as i32 - cutOffLine as i32).abs() as u32) < shortestDist) == false) {
                panic!();
            }
            orderCollector.push(message);
            newMin = min(calculateDistance(pointQ, pointP), newMin);
        }
        if lowerBound == 1 && upperBound == 1 {
            let message = format!("Skipped at /{}/", cutOffLine);
            orderCollector.push(message);
        }
    }
    return Some(newMin);
}

fn calculateDistance(point: &Point, point2: &Point) -> u32 {
    return (((point2.x as i128 - point.x as i128).pow(2)
        + (point.y as i128 - point2.y as i128).pow(2))
    .isqrt() as u32);
}

//AI written TESTS
#[cfg(test)]
mod tests {
    use super::*;
    use rand::Rng;

    fn p(x: u32, y: u32) -> Point {
        Point {
            x,
            y,
            scannedRadius: 0,
            closestPoint: None,
            closestDistance: None,
        }
    }

    // brute force reference solution
    fn bf(points: &[Point]) -> Option<u32> {
        let mut best: Option<u32> = None;

        for i in 0..points.len() {
            for j in i + 1..points.len() {
                let d = calculateDistance(&points[i], &points[j]);

                best = Some(match best {
                    None => d,
                    Some(x) => x.min(d),
                });
            }
        }

        best
    }

    fn run(mut pts: Vec<Point>) {
        let mut py = pts.clone();
        let mut px = pts.clone();

        px.sort_by(|a, b| a.x.cmp(&b.x));
        py.sort_by(|a, b| a.y.cmp(&b.y));

        let expected = bf(&pts);
        let got = closestPair(&mut px, &mut py, 10_000);

        assert_eq!(got, expected);
    }

    // 1
    #[test]
    fn t1() {
        run(vec![p(0, 0), p(1, 0)]);
    }

    // 2
    #[test]
    fn t2() {
        run(vec![p(0, 0), p(0, 5)]);
    }

    // 3
    #[test]
    fn t3() {
        run(vec![p(0, 0), p(3, 4)]);
    }

    // 4
    #[test]
    fn t4() {
        run(vec![p(0, 0), p(2, 0), p(1, 1)]);
    }

    // 5 duplicates
    #[test]
    fn t5() {
        run(vec![p(5, 5), p(5, 5), p(10, 10)]);
    }

    // 6 cross boundary
    #[test]
    fn t6() {
        run(vec![p(49, 0), p(50, 0), p(0, 0), p(100, 100)]);
    }

    // 7 strip vertical
    #[test]
    fn t7() {
        run(vec![p(10, 0), p(10, 5), p(11, 0)]);
    }

    // 8 strip horizontal
    #[test]
    fn t8() {
        run(vec![p(0, 10), p(5, 10), p(0, 11)]);
    }

    // 9 cluster + outlier
    #[test]
    fn t9() {
        run(vec![p(0, 0), p(1, 1), p(2, 2), p(1000, 1000)]);
    }

    // 10 duplicates cluster
    #[test]
    fn t10() {
        run(vec![p(7, 7); 8]);
    }

    // 11 random stress small
}
