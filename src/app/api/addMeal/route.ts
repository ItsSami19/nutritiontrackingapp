import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
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

        const createdMeal = await prisma.meal.create({
        data: {
            user: 
            date: new Date(),
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
        },
        });
    return NextResponse.json({ success: true, meal: createdMeal }, { status: 201 });
} catch (error) {
    console.error("POST /api/addMeal failed:", error);
    return NextResponse.json({ success: false, error: "API error" }, { status: 500 });
  }
}
