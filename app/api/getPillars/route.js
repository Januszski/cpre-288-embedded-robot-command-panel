import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET() {
  const data = await prisma.obstacle.findFirst({ orderBy: { id: "desc" } });
  console.log("DATA", data);
  //   const dataJson = await data.JSON();
  const retData = data.pillars.push;

  console.log(retData);

  return NextResponse.json(retData);
}
