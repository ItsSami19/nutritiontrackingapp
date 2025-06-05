// src/app/api/removeMeal/route.ts

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
    const { id } = await request.json();

    // 1) Existiert das Meal, und gehört es zum eingeloggten User?
    const existing = await prisma.meal.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    // ───────────────────────────────────────────────
    // Neuer Schritt: zuerst alle TrackedMeal‐Einträge löschen, die auf dieses Meal verweisen
    await prisma.trackedMeal.deleteMany({
      where: { mealId: id },
    });
    // ───────────────────────────────────────────────

    // 2) Dann das Meal selbst löschen
    await prisma.meal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting meal:", error);
    return NextResponse.json(
      { error: "Failed to delete meal" },
      { status: 500 }
    );
  }
}
