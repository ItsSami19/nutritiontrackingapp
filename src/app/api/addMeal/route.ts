// app/api/addMeal/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

interface MealCreateBody {
  title: string;
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
  containsMeat?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  imageUrl?: string | null;
  rating?: number;
  environmentalScore?: number;
  co2Savings?: number | null;
  date?: string;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Set default values if not provided
    const mealData = {
      userId: session.user.id,
      title: data.title,
      calories: Number(data.calories) || 0,
      carbohydrates: Number(data.carbohydrates) || 0,
      fat: Number(data.fat) || 0,
      protein: Number(data.protein) || 0,
      containsMeat: data.containsMeat ?? false,
      vegetarian: data.vegetarian ?? false,
      vegan: data.vegan ?? false,
      imageUrl: data.imageUrl || null,
      rating: data.rating ?? 3,
      environmentalScore: data.environmentalScore ?? 2,
      co2Savings: data.co2Savings ? Number(data.co2Savings) : null,
      date: data.date ? new Date(data.date) : new Date(), // Handle date properly
    };

    const newMeal = await prisma.meal.create({
      data: mealData,
      include: {
        user: { select: { email: true } },
      },
    });

    return NextResponse.json(newMeal, { status: 201 });
  } catch (error) {
    console.error("Error adding meal:", error);
    return NextResponse.json({ error: "Failed to add meal" }, { status: 500 });
  }
}
