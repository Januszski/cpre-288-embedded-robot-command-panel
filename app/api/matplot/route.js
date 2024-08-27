import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { PlusOneOutlined } from "@mui/icons-material";

const prisma = new PrismaClient();
function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export async function POST(req, res) {
  // Parse the incoming data, assuming it's JSON
  // console.log(Request.body);

  const data = await req.json();
  console.log("THIS DATA ", data);

  let updatedObstacle;

  if (data.distanceArray) {
    let pillarArray = [];
    let startDeg;
    let endDeg;
    let inObj = false;

    for (let i = 0; i <= 90; i++) {
      if (data.distanceArray[i] < 70 && !inObj) {
        inObj = true;
        startDeg = i * 2;
      }

      if ((data.distanceArray[i] >= 70 && inObj) || i == 90) {
        inObj = false;
        endDeg = i * 2;
      }

      if (startDeg && endDeg) {
        let objAngle = (endDeg + startDeg) / 2;
        let objWidth = endDeg - startDeg;
        let midLocation = Math.round(endDeg - objWidth / 2);
        let distIndex;
        if ((endDeg - midLocation) % 2 === 0) {
          distIndex = (endDeg - midLocation) / 2;
        } else {
          distIndex = (endDeg - midLocation + 1) / 2;
        }

        pillarArray.push({
          angle: objAngle,
          distance: data.distanceArray[startDeg / 2 + 2],
        });
        endDeg = 0;
        startDeg = 0;
      } // 10
    }
    console.log("Pillar array ", pillarArray);
    let pillarLocations = [];
    for (let i = 0; i < pillarArray.length; i++) {
      const pillar = pillarArray[i];
      let trueAngle;
      let xDistance;
      let yDistance;

      if (data.orientation >= 0 && data.orientation <= 90) {
        if (pillar.angle < 90) {
          trueAngle = Math.abs(90 - pillar.angle) + data.orientation;
        } else {
          trueAngle = data.orientation - Math.abs(90 - pillar.angle);
          if (trueAngle < 0) trueAngle += 360;
        }
      } else if (data.orientation > 90 && data.orientation <= 180) {
        if (pillar.angle < 90) {
          trueAngle = Math.abs(90 - pillar.angle) + data.orientation;
        } else {
          trueAngle = data.orientation - Math.abs(90 - pillar.angle);
        }
      } else if (data.orientation > 180 && data.orientation <= 270) {
        if (pillar.angle < 90) {
          console.log("HERE ROOT");
          trueAngle = Math.abs(90 - pillar.angle) + data.orientation;
          console.log("TRUE HOR ", trueAngle);
        } else {
          trueAngle = data.orientation - Math.abs(90 - pillar.angle);
        }
      } else if (data.orientation > 270 && data.orientation <= 360) {
        if (pillar.angle < 90) {
          trueAngle = Math.abs(90 - pillar.angle) + data.orientation;
          if (trueAngle > 360) trueAngle -= 360;
        } else {
          trueAngle = Math.abs(90 - pillar.angle) - data.orientation * -1;
        }
      }

      let radians = degreesToRadians(trueAngle);
      if (trueAngle <= 90) {
        console.log("sin", Math.sin(radians));
        console.log("cos", Math.cos(radians));

        yDistance = Math.cos(radians) * pillar.distance;
        xDistance = Math.sin(radians) * pillar.distance * -1;
      } else if (trueAngle <= 180) {
        yDistance =
          Math.cos(degreesToRadians(180 - trueAngle)) * pillar.distance * -1;
        xDistance =
          Math.sin(degreesToRadians(180 - trueAngle)) * pillar.distance * -1;
      } else if (trueAngle <= 270) {
        console.log("ANGLE HERE", trueAngle - 180);

        yDistance =
          Math.cos(degreesToRadians(trueAngle - 180)) * pillar.distance * -1;
        xDistance =
          Math.sin(degreesToRadians(trueAngle - 180)) * pillar.distance;
        console.log("ANGLE HERE", trueAngle - 180);
      } else if (trueAngle <= 360) {
        console.log("AM I HERE?");
        yDistance =
          Math.cos(degreesToRadians(360 - trueAngle)) * pillar.distance;
        xDistance =
          Math.sin(degreesToRadians(360 - trueAngle)) * pillar.distance;
      }

      const oldData = await prisma.robot.findFirst({ orderBy: { id: "desc" } });
      if (oldData) {
        pillarLocations.push({
          x: oldData.xCoordinate - xDistance,
          y: oldData.yCoordinate - yDistance,
        });
        console.log("FINAL X ", oldData.xCoordinate - xDistance);
        console.log("FINAL Y ", oldData.yCoordinate - yDistance);
      } else {
        pillarLocations.push({
          x: data.xCoordinate - xDistance,
          y: data.yCoordinate - yDistance,
        });
        console.log("FINAL X ", data.xCoordinate - xDistance);
        console.log("FINAL Y ", data.yCoordinate - yDistance);
      }
    }
    console.log(pillarLocations);
    const old = await prisma.obstacle.findFirst({ orderBy: { id: "desc" } });
    console.log("OLD ", old);
    console.log("LETS CHECK BOOLEAN", old.pillars.length > 0);
    if (old.pillars.push.length > 0) {
      console.log("WHY THE **** AM I HERE");
      const oldPillars = old.pillars.push;
      for (let n = 0; n < pillarLocations.length; n++) {
        let isIn = false;
        for (let k = 0; k < oldPillars.length; k++) {
          if (
            oldPillars[k].x === pillarLocations[n].x &&
            oldPillars[k].y === pillarLocations[n].y
          ) {
            isIn = true;
            break;
          }
        }
        if (!isIn) {
          oldPillars.push(pillarLocations[n]);
        }
      }
      updatedObstacle = await prisma.obstacle.update({
        where: { id: 8 },
        data: {
          pillars: {
            push: oldPillars,
          },
        },
      });
    } else {
      console.log("IN HERE NOW");
      updatedObstacle = await prisma.obstacle.update({
        where: { id: 8 },
        data: {
          pillars: {
            push: pillarLocations,
          },
        },
      });
    }
  }

  const oldData = await prisma.robot.findFirst({ orderBy: { id: "desc" } });
  let updateX;
  let updateY;
  let updateOrientation;
  if (oldData) {
    updateX = oldData.xCoordinate + data.xCoordinate;
    updateY = oldData.yCoordinate + data.yCoordinate;
    updateOrientation = oldData.orientation + data.orientation;
  }

  // Add the robot to the database
  const newRobot = await prisma.robot.create({
    data: {
      // Provide some sample data for the robot
      xCoordinate: updateX || data.xCoordinate || 0,
      yCoordinate: updateY || data.yCoordinate || 0,
      orientation: data.orientation || data.orientation || 0,
      distanceArray: data.distanceArray || [],
      degreeArray: data.degreeArray || [],
    },
  });

  return Response.json({
    message: "Robot added successfully",
    newRobot,
    updatedObstacle,
  });
}
