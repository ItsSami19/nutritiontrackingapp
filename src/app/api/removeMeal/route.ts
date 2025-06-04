import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { id } = body;

    const createdMeal = await prisma.meal.delete({
      where: { id: id },
    });
    return NextResponse.json(
      { success: true, meal: createdMeal },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/removeMeal failed:", error);
    return NextResponse.json(
      { success: false, error: "API error" },
      { status: 500 }
    );
  }
}
