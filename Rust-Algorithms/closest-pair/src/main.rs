#![allow(warnings)]
use rand::RngExt;
use std::cmp;
use std::cmp::min;
use wasm_bindgen::prelude::*;

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
struct Point {
    x: u128,
    y: u128,
    scannedRadius: u128,
    closestPoint: Option<[u128; 2]>,
    closestDistance: Option<u128>,
}

struct Canvas {
    x: u128,
    y: u128,
    scannedRadius: u128,
    closestPoint: Option<[u128; 2]>,
    closestDistance: Option<u128>,
}

type coordinateVector = Vec<Point>;

fn main() {
    let mut orderVector = Vec::new();
    let mut initializedPoints = initialize_random_points(10, 500, 500);

    println!("Points before {initializedPoints:?}");
    closestPair(&mut initializedPoints[0].clone(), &mut initializedPoints[1], 500, &mut orderVector);
    println!("{orderVector:?}");
    println!("Points after {initializedPoints:?}")
}

#[wasm_bindgen]
pub fn returnClosestPoints()->Vec<String>{
    
    let mut orderVector = Vec::new();
    let mut initializedPoints = initialize_random_points(10, 500, 500);
    closestPair(&mut initializedPoints[0].clone(), &mut initializedPoints[1], 500, &mut orderVector);
    orderVector
}

fn initialize_random_points(amount: u128, canvasX: u128, canvasY: u128) -> [Vec<Point>;2] {
    let mut coordinateVector = Vec::new();
    let mut rng = rand::rng();
    for _ in (0..amount) {
        let mut xPos: u128 = rng.random_range(0..canvasX);
        let mut yPos: u128 = rng.random_range(0..canvasY);
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
fn closestPair(coordinateVector: &mut [Point], coordinateVectorY: &mut [Point],  canvasX: u128, orderCollector: &mut Vec<String>) -> Option<u128>{
    if coordinateVector.len() == 1 {

            let message = format!("b: {}, {},", &coordinateVector[0].x, &coordinateVector[0].y);
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
        let message = format!("n: {}, {}, {}, {}.", &coordinateVector[0].x, &coordinateVector[0].y,  &coordinateVector[1].x, &coordinateVector[1].y);
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
            let message = format!("n: {}, {}, {}, {}.", &coordinateVector[0].x, &coordinateVector[0].y,  &coordinateVector[1].x, &coordinateVector[1].y);
            orderCollector.push(message);
            return coordinateVector[0].closestDistance;
        }
        if (distAToC <= distAToB && distAToC <= distBToC) {
            coordinateVector[0].closestDistance = Some(distAToC);
            coordinateVector[2].closestDistance = Some(distAToC);

            let message = format!("n: {}, {}, {}, {}.", &coordinateVector[0].x, &coordinateVector[0].y,  &coordinateVector[2].x, &coordinateVector[2].y);
            orderCollector.push(message);
            return coordinateVector[2].closestDistance;
        }
        if (distBToC <= distAToB && distBToC <= distAToC) {
            coordinateVector[1].closestDistance = Some(distBToC);
            coordinateVector[2].closestDistance = Some(distBToC);

            let message = format!("n: {}, {}, {}, {}. ", &coordinateVector[1].x, &coordinateVector[1].y,  &coordinateVector[2].x, &coordinateVector[2].y);
            orderCollector.push(message);
            return coordinateVector[1].closestDistance;
        }
    }
    let lengthOfVec = coordinateVector.len()/2;
    let (leftHalf, rightHalf) = & mut coordinateVector.split_at_mut(lengthOfVec);
    let midPoint = leftHalf[leftHalf.len()-1].x as u128;
    let shortestLeft = closestPair(leftHalf, coordinateVectorY, midPoint, orderCollector);
    let shortestRight = closestPair(rightHalf, coordinateVectorY,midPoint, orderCollector);
    let minOfSides = min(shortestLeft, shortestRight);

    if shortestLeft > shortestRight {
        let closestMidPair = closestMidPair(
            &coordinateVectorY,
            midPoint,
            shortestRight.unwrap(),
            orderCollector
        );
        return min (shortestRight, closestMidPair);
    } else {
        let closestMidPair = closestMidPair(
           &coordinateVectorY,
            midPoint,
            shortestLeft.unwrap(),
            orderCollector
        );
        return min (shortestLeft, closestMidPair);
    }
    
}
fn closestMidPair(middleStrip1: &[Point],  cutOffLine: u128, shortestDist: u128, orderCollector: &mut Vec<String>) -> Option<u128> {
    let mut newMin = shortestDist;
    let mut middleStrip = middleStrip1
        .iter()
        .filter(|&node| {
            ((node.x as i32 - cutOffLine as i32).abs() as u128) < shortestDist
        })
        .collect::<Vec<&Point>>();
    for i in (0..middleStrip.len()){
        let pointP = &middleStrip[i];
        let upperBound = min(i+8,middleStrip.len());
        let lowerBound = min(i+1,middleStrip.len());
        for j in (lowerBound..upperBound){
            let pointQ = &middleStrip[j];
            let message = format!("d: {}, {}, {}, {}. {}", pointP.x, pointP.y, pointQ.x,pointQ.y, cutOffLine);
            if ((((pointP.x as i32 - cutOffLine as i32).abs() as u128) < shortestDist)==false){
                panic!();
            }
            orderCollector.push(message);
            newMin = min(calculateDistance(pointQ,pointP),newMin);
        }
    }
    return Some(newMin);
}

fn calculateDistance(point: &Point, point2: &Point) -> u128 {
    return (((point2.x as i128 - point.x as i128).pow(2) + (point.y as i128 - point2.y as i128).pow(2))
        .isqrt() as u128);
}

//AI written TESTS
#[cfg(test)]
mod tests {
    use super::*;
    use rand::Rng;

    fn p(x: u128, y: u128) -> Point {
        Point {
            x,
            y,
            scannedRadius: 0,
            closestPoint: None,
            closestDistance: None,
        }
    }

    // brute force reference solution
    fn bf(points: &[Point]) -> Option<u128> {
        let mut best: Option<u128> = None;

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
    #[test] fn t1() { run(vec![p(0,0), p(1,0)]); }

    // 2
    #[test] fn t2() { run(vec![p(0,0), p(0,5)]); }

    // 3
    #[test] fn t3() { run(vec![p(0,0), p(3,4)]); }

    // 4
    #[test] fn t4() { run(vec![p(0,0), p(2,0), p(1,1)]); }

    // 5 duplicates
    #[test] fn t5() { run(vec![p(5,5), p(5,5), p(10,10)]); }

    // 6 cross boundary
    #[test] fn t6() { run(vec![p(49,0), p(50,0), p(0,0), p(100,100)]); }

    // 7 strip vertical
    #[test] fn t7() { run(vec![p(10,0), p(10,5), p(11,0)]); }

    // 8 strip horizontal
    #[test] fn t8() { run(vec![p(0,10), p(5,10), p(0,11)]); }

    // 9 cluster + outlier
    #[test] fn t9() { run(vec![p(0,0), p(1,1), p(2,2), p(1000,1000)]); }

    // 10 duplicates cluster
    #[test] fn t10() { run(vec![p(7,7); 8]); }

    // 11 random stress small
    
}