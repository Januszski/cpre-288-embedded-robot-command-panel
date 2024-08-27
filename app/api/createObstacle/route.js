import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { PlusOneOutlined } from "@mui/icons-material";

const prisma = new PrismaClient();

export async function POST(req, res) {
  // Add the robot to the database
  const newObstacle = await prisma.obstacle.create({
    data: {
      // Provide some sample data for the robot

      pillars: [],
    },
  });

  return Response.json({
    message: "Pillars created succesfully",
    newObstacle,
  });
}
