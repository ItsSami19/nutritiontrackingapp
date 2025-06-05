import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mealId, date } = await request.json();

    // Validierung der Eingabedaten
    if (!mealId || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Erstellung des TrackedMeal
    const trackedMeal = await prisma.trackedMeal.create({
      data: {
        userId: session.user.id,
        mealId: mealId,
        date: parsedDate,
      },
      include: {
        meal: true,
      },
    });

    return NextResponse.json(trackedMeal);
  } catch (error) {
    console.error("Error creating tracked meal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const trackedMeals = await prisma.trackedMeal.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        meal: true,
      },
    });

    return NextResponse.json(trackedMeals);
  } catch (error) {
    console.error("Error fetching tracked meals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} // Hier endet die GET-Funktion korrekt

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: trackedMealId } = await request.json();

    if (!trackedMealId) {
      return NextResponse.json(
        { error: "Missing tracked meal ID" },
        { status: 400 }
      );
    }

    // Überprüfe ob der Eintrag existiert und zum Benutzer gehört
    const existingEntry = await prisma.trackedMeal.findUnique({
      where: { id: trackedMealId },
      select: { userId: true },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Tracked meal not found" },
        { status: 404 }
      );
    }

    if (existingEntry.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this entry" },
        { status: 403 }
      );
    }

    // Lösche den Eintrag
    await prisma.trackedMeal.delete({
      where: { id: trackedMealId },
    });

    return NextResponse.json(
      { message: "Tracked meal removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tracked meal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
