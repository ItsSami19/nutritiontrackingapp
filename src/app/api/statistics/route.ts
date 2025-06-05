// app/api/statistics/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

function getStartDate(range: string): Date {
  const now = new Date();
  switch (range) {
    case "day": {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return start;
    }
    case "week": {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      return start;
    }
    case "month": {
      const start = new Date(now);
      start.setMonth(start.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
      return start;
    }
    case "year": {
      const start = new Date(now);
      start.setFullYear(start.getFullYear() - 1);
      start.setHours(0, 0, 0, 0);
      return start;
    }
    default: {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      return start;
    }
  }
}

export async function GET(request: Request) {
  try {
    // 1. Session prüfen
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // 2. Query-Parameter auslesen
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "week";
    const startDate = getStartDate(range);
    const endDate = new Date();

    // 3. Getrackte Mahlzeiten innerhalb des Zeitraums abfragen
    const trackedMeals = await prisma.trackedMeal.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        meal: true,
      },
    });

    // 4. Wasser-Einträge innerhalb des Zeitraums abfragen
    const waterEntries = await prisma.waterIntake.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
    });

    // 5. Letzten Gewichtseintrag abrufen (unabhängig vom Zeitraum)
    const latestWeightEntry = await prisma.weightEntry.findFirst({
      where: { userId },
      orderBy: { date: "desc" },
    });

    // 6. Statistics berechnen
    let totalCalories = 0;
    let totalCO2Savings = 0;
    let sumProtein = 0;
    let sumFat = 0;
    let sumCarbs = 0;
    let sumRatings = 0;
    let countRatedMeals = 0;
    let countVegan = 0;
    let countVegetarian = 0;
    let countMeat = 0;

    for (const t of trackedMeals) {
      const m = t.meal;

      // Kalorien & CO2
      totalCalories += m.calories;
      totalCO2Savings += m.co2Savings ?? 0;

      // Makros
      sumProtein += m.protein;
      sumFat += m.fat;
      sumCarbs += m.carbohydrates;

      // Rating nur berücksichtigen, wenn > 0
      if (m.rating > 0) {
        sumRatings += m.rating;
        countRatedMeals++;
      }

      // Mahlzeitentyp
      if (m.vegan) {
        countVegan++;
      } else if (m.vegetarian) {
        countVegetarian++;
      } else if (m.containsMeat) {
        countMeat++;
      }
    }

    const totalMacroSum = sumProtein + sumFat + sumCarbs;
    const proteinPercentage =
      totalMacroSum > 0 ? Math.round((sumProtein / totalMacroSum) * 100) : 0;
    const fatPercentage =
      totalMacroSum > 0 ? Math.round((sumFat / totalMacroSum) * 100) : 0;
    const carbsPercentage =
      totalMacroSum > 0 ? Math.round((sumCarbs / totalMacroSum) * 100) : 0;

    const mealCount = trackedMeals.length;
    const veganPercentage =
      mealCount > 0 ? Math.round((countVegan / mealCount) * 100) : 0;
    const vegetarianPercentage =
      mealCount > 0 ? Math.round((countVegetarian / mealCount) * 100) : 0;
    const meatPercentage =
      mealCount > 0 ? Math.round((countMeat / mealCount) * 100) : 0;

    const averageRating =
      countRatedMeals > 0
        ? parseFloat((sumRatings / countRatedMeals).toFixed(2))
        : 0;

    const totalWaterIntakes = waterEntries.reduce(
      (acc, w) => acc + w.amountMl,
      0
    );

    const latestWeight = latestWeightEntry ? latestWeightEntry.weightKg : null;

    const stats = {
      proteinPercentage,
      fatPercentage,
      carbsPercentage,
      veganPercentage,
      vegetarianPercentage,
      meatPercentage,
      totalCalories,
      totalCO2Savings: parseFloat(totalCO2Savings.toFixed(2)),
      averageRating,
      totalWaterIntakes,
      latestWeight,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
