import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();
  const userId = "1"; // später dynamisch

  const goal = await prisma.goal.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const allMeals = await prisma.meal.findMany({ where: { userId } });
  const totalMealCount = allMeals.length;

  let veganCount = 0;
  let vegetarianCount = 0;
  let meatCount = 0;

  for (const meal of allMeals) {
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
    totalMealCount > 0
      ? Math.round((vegetarianCount / totalMealCount) * 100)
      : 0;
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

  const waterGoal = goal?.type === "CALORIE_INTAKE" ? goal.targetValue : 2000;
  const waterTotal = await prisma.waterIntake.aggregate({
    where: { userId },
    _sum: { amountMl: true },
  });

  const currentWater = waterTotal._sum.amountMl ?? 0;
  const waterPercentage = Math.min(
    Math.round((currentWater / waterGoal) * 100),
    100
  );

  return NextResponse.json({
    veganPercentage,
    vegetarianPercentage,
    meatPercentage,
    proteinPercentage,
    fatPercentage,
    carbsPercentage,
    waterPercentage,
  });
}
