#![allow(warnings)]
use rand::RngExt;
use std::cmp;

#[derive(Debug, Clone)]
struct Point {
    x: u16,
    y: u16,
    scannedRadius: u16,
    closestPoint: Option<[u16; 2]>,
    closestDistance: Option<u32>,
}

type coordinateVector = Vec<Point>;

fn main() {
    println!("Test");
    let mut initializedPoints = initialize_random_points(5, 400, 400);
    println!("{:?}", closestPair(&mut initializedPoints, 400));
}

fn initialize_random_points(amount: u16, canvasX: u16, canvasY: u16) -> Vec<Point> {
    let mut coordinateVector = Vec::new();
    let mut rng = rand::rng();
    for _ in (0..amount) {
        let mut xPos: u16 = rng.random_range(0..canvasX);
        let mut yPos: u16 = rng.random_range(0..canvasY);
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
    return coordinateVector;
}
fn closestPair(coordinateVector: &mut Vec<Point>, canvasX: u32) -> Point {
    let mut shrinkedCoordinateVector = Vec::new();
    if coordinateVector.len() == 1 {
        shrinkedCoordinateVector.push(coordinateVector[0].clone());
        return Point {
            x: 0,
            y: 0,
            scannedRadius: 69,
            closestDistance: None,
            closestPoint: None,
        };
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
        shrinkedCoordinateVector.push(coordinateVector[0].clone());
        shrinkedCoordinateVector.push(coordinateVector[1].clone());
        return coordinateVector[0].clone();
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
            return coordinateVector[0].clone();
        }
        if (distAToC <= distAToB && distAToC <= distBToC) {
            coordinateVector[0].closestDistance = Some(distAToC);
            coordinateVector[2].closestDistance = Some(distAToC);
            return coordinateVector[2].clone();
        }
        if (distBToC <= distAToB && distBToC <= distAToC) {
            coordinateVector[1].closestDistance = Some(distBToC);
            coordinateVector[2].closestDistance = Some(distBToC);
            return coordinateVector[1].clone();
        }
        shrinkedCoordinateVector.push(coordinateVector[0].clone());
        shrinkedCoordinateVector.push(coordinateVector[1].clone());
        shrinkedCoordinateVector.push(coordinateVector[2].clone());
    }
    let mut leftHalf = coordinateVector.clone();
    let mut rightHalf = leftHalf.split_off((coordinateVector.len() / 2));

    let shortestLeft = closestPair(&mut leftHalf, canvasX);
    let shortestRight = closestPair(&mut rightHalf, canvasX);
    if shortestLeft.closestDistance > shortestRight.closestDistance {
        closestMidPair(
            coordinateVector.clone(),
            (canvasX / 2) as u32,
            shortestRight.closestDistance.unwrap(),
        );
        return shortestRight;
    } else {
        closestMidPair(
            coordinateVector.clone(),
            (canvasX / 2) as u32,
            shortestLeft.closestDistance.unwrap(),
        );
        return shortestLeft;
    }
}
fn closestMidPair(mut middleStrip: Vec<Point>, cutOffLine: u32, shortestDist: u32) {
    let mut leftPoints = Vec::new();
    let mut rightPoints = Vec::new();
    let mut currentRange: [u32; 2] = [0, 0];
    let mut newMin = shortestDist;
    middleStrip = middleStrip
        .clone()
        .into_iter()
        .filter(|node| {
            if ((node.x as i32 - cutOffLine as i32) < 0
                && ((node.x as i32 - cutOffLine as i32).abs() as u32) < shortestDist)
            {
                leftPoints.push(node.clone());
            } else if ((node.x as i32 - cutOffLine as i32) > 0
                && ((node.x as i32 - cutOffLine as i32).abs() as u32) < shortestDist)
            {
                rightPoints.push(node.clone())
            }
            ((node.x as i32 - cutOffLine as i32).abs() as u32) < shortestDist
        })
        .collect::<Vec<Point>>();
    middleStrip.sort_by(|a, b| a.y.cmp(&b.y));
    for leftNode in (leftPoints) {
        if shortestDist < (leftNode.y as u32) {
            (currentRange[0]) = leftNode.y as u32 - shortestDist;
        } else {
            currentRange[0] = 0
        }
        currentRange[1] = shortestDist + leftNode.y as u32;
        //ensures y point within red rectangle
        for rightNode in (rightPoints.clone()) {
            if (rightNode.y as u32) < currentRange[1] && rightNode.y as u32 > currentRange[0] {
                if calculateDistance(&leftNode, &rightNode) < newMin {
                    newMin = (calculateDistance(&leftNode, &rightNode))
                }
            }
        }
    }
    println!("{newMin:?}");
}

fn calculateDistance(point: &Point, point2: &Point) -> u32 {
    return (((point2.x as i32 - point.x as i32).pow(2) + (point.y as i32 - point2.y as i32).pow(2))
        .isqrt() as u32);
}
