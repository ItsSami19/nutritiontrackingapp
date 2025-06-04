import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const prisma = new PrismaClient();

  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const userId = user.user.id;

  const allMeals = await prisma.meal.findMany({ where: { userId } });
  const totalMealCount = allMeals.length;

  let veganCount = 0;
  let vegetarianCount = 0;
  let meatCount = 0;
  let totalCalories = 0;
  let totalCO2Savings = 0;
  let totalRating = 0;

  for (const meal of allMeals) {
    totalCalories += meal.calories;
    totalCO2Savings += meal.co2Savings || 0;
    totalRating += meal.rating;

    if (meal.vegan) {
      veganCount++;
    } else if (meal.vegetarian) {
      vegetarianCount++;
    } else if (meal.containsMeat) {
      meatCount++;
    }
  }

  const veganPercentage =
    totalMealCount > 0 ? Math.round((veganCount / totalMealCount) * 100) : 0;
  const vegetarianPercentage =
    totalMealCount > 0 ? Math.round((vegetarianCount / totalMealCount) * 100) : 0;
  const meatPercentage =
    totalMealCount > 0 ? Math.round((meatCount / totalMealCount) * 100) : 0;

  const macros = await prisma.meal.aggregate({
    where: { userId },
    _sum: {
      protein: true,
      fat: true,
      carbohydrates: true,
    },
  });

  const totalProtein = macros._sum.protein ?? 0;
  const totalFat = macros._sum.fat ?? 0;
  const totalCarbs = macros._sum.carbohydrates ?? 0;
  const macroSum = totalProtein + totalFat + totalCarbs;

  const proteinPercentage =
    macroSum > 0 ? Math.round((totalProtein / macroSum) * 100) : 0;
  const fatPercentage =
    macroSum > 0 ? Math.round((totalFat / macroSum) * 100) : 0;
  const carbsPercentage =
    macroSum > 0 ? Math.round((totalCarbs / macroSum) * 100) : 0;

  const weightEntries = await prisma.weightEntry.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  });
  
  const totalWeightEntries = weightEntries.length;
  const latestWeight = totalWeightEntries > 0 ? weightEntries[totalWeightEntries - 1] : null;

  const waterIntakes = await prisma.waterIntake.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  });

  const totalWaterIntakes = waterIntakes.reduce((acc, entry) => acc + entry.amountMl, 0);

  const averageRating = totalMealCount > 0 ? totalRating / totalMealCount : 0;

  return NextResponse.json({
    veganPercentage,
    vegetarianPercentage,
    meatPercentage,
    proteinPercentage,
    fatPercentage,
    carbsPercentage,
    totalCalories,
    totalCO2Savings,
    averageRating,
    latestWeight,
    totalWaterIntakes,
  });
}
