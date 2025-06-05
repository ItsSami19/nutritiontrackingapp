// app/api/editMeal/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate meal ID
    if (!body.id || typeof body.id !== "string") {
      return NextResponse.json(
        { error: "Meal ID is required" },
        { status: 400 }
      );
    }

    // Check if meal exists and belongs to user
    const existingMeal = await prisma.meal.findFirst({
      where: {
        id: body.id,
        userId: session.user.id,
      },
    });

    if (!existingMeal) {
      return NextResponse.json(
        { error: "Meal not found or access denied" },
        { status: 404 }
      );
    }

    // Prepare updates
    const updates: any = {};

    // Validate and add title if provided
    if (body.title !== undefined) {
      if (typeof body.title !== "string") {
        return NextResponse.json(
          { error: "Title must be a string" },
          { status: 400 }
        );
      }
      updates.title = body.title;
    }

    // Validate and add numeric fields
    const numericFields = [
      "calories",
      "carbohydrates",
      "fat",
      "protein",
      "rating",
      "environmentalScore",
      "co2Savings",
    ];

    for (const field of numericFields) {
      if (body[field] !== undefined) {
        if (isNaN(body[field])) {
          return NextResponse.json(
            { error: `${field} must be a number` },
            { status: 400 }
          );
        }
        updates[field] = Number(body[field]);
      }
    }

    // Validate and add boolean fields
    if (body.containsMeat !== undefined) {
      updates.containsMeat = Boolean(body.containsMeat);
    }
    if (body.vegetarian !== undefined) {
      updates.vegetarian = Boolean(body.vegetarian);
    }
    if (body.vegan !== undefined) {
      updates.vegan = Boolean(body.vegan);
    }

    // Validate and add image URL
    if (body.imageUrl !== undefined) {
      updates.imageUrl = body.imageUrl || null;
    }

    // Update the meal
    const updatedMeal = await prisma.meal.update({
      where: { id: body.id },
      data: updates,
    });

    return NextResponse.json(updatedMeal);
  } catch (error) {
    console.error("Error updating meal:", error);
    return NextResponse.json(
      { error: "Failed to update meal" },
      { status: 500 }
    );
  }
}
