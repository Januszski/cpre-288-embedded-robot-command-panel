import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET() {
  const data = await prisma.robot.findFirst({ orderBy: { id: "desc" } });
  console.log(data);
  let pillarArray = [];
  let startDeg;
  let endDeg;
  let inObj = false;

  for (let i = 0; i <= 90; i++) {
    if (data.distanceArray[i] < 70 && !inObj) {
      inObj = true;
      startDeg = i * 2;
    }

    if (data.distanceArray[i] >= 70 && inObj) {
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

  console.log(pillarArray);

  return NextResponse.json({ data });
}
