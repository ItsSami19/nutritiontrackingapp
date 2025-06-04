import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
        id,
        title,
        calories,
        carbohydrates,
        fat,
        protein,
        containsMeat,
        vegetarian,
        vegan,
        imageUrl,
        rating,
        environmentalScore,
        co2Savings,
        } = body;

        const editedMeal = await prisma.meal.update({
        where: { id: id},
        data: {
            title,
            calories,
            carbohydrates,
            fat,
            protein,
            containsMeat,
            vegetarian,
            vegan,
            imageUrl,
            rating,
            environmentalScore,
            co2Savings,
            updatedAt: new Date(),
        },
        });
    return NextResponse.json({ success: true, meal: editedMeal }, { status: 201 });
} catch (error) {
    console.error("POST /api/editMeal failed:", error);
    return NextResponse.json({ success: false, error: "API error" }, { status: 500 });
  }
}
