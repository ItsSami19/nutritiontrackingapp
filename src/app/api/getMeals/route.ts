import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const meals = await prisma.meal.findMany({
            select: {
                id: true,
                user: true,
                userId: true,
                title: true,
                calories: true,
                carbohydrates: true,
                fat: true,
                protein: true,
                containsMeat: true,
                vegetarian: true,
                vegan: true,
                imageUrl: true,
                date: true,
                rating: true,
                environmentalScore: true,
                co2Savings: true,
                posts: true,
                mealPlanItems: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return NextResponse.json(meals);
    } catch (error) {
        console.error("Error fetching vacation summary:", error);    
        return NextResponse.json(
            {error: "Failed to fetch meals"},
            {status: 500 }
        );
    }
}