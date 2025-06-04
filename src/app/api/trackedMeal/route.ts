// app/api/trackedMeal/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabaseClient"; // <— Hier Supabase importieren

// Hilfsfunktion, um den eingeloggten User (z. B. via Supabase-Token) zu ermitteln
async function getAuthenticatedUser(req: Request) {
  // Hier dein Supabase-Token-Check (oder Test-User wie weiter oben)
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return { user: null, error: "User not authenticated" };
  }
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return { user: null, error: "Invalid token" };
  }
  return { user: data.user, error: null };
}

// GET: TrackedMeals eines Tages abfragen
export async function GET(req: Request) {
  const { user, error } = await getAuthenticatedUser(req);
  if (error || !user) {
    return NextResponse.json(
      { error: error ?? "User not authenticated" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  if (!date) {
    return NextResponse.json(
      { error: "Missing 'date' parameter" },
      { status: 400 }
    );
  }
  const dateStart = new Date(date);
  dateStart.setHours(0, 0, 0, 0);
  const dateEnd = new Date(date);
  dateEnd.setHours(23, 59, 59, 999);

  try {
    const trackedMeals = await prisma.trackedMeal.findMany({
      where: {
        userId: user.id,
        date: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
      include: {
        meal: true, // damit du die eingetragene meal-Details hast
      },
    });
    return NextResponse.json(trackedMeals);
  } catch (err) {
    console.error("Prisma-Fehler (GET /trackedMeal):", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Neue TrackedMeal eintragen
export async function POST(req: Request) {
  const { user, error } = await getAuthenticatedUser(req);
  if (error || !user) {
    return NextResponse.json(
      { error: error ?? "User not authenticated" },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { mealId, date } = body;
  if (!mealId || !date) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const newTracked = await prisma.trackedMeal.create({
      data: {
        userId: user.id,
        mealId,
        date: new Date(date),
      },
      include: { meal: true },
    });
    return NextResponse.json(newTracked, { status: 201 });
  } catch (err) {
    console.error("Prisma-Fehler (POST /trackedMeal):", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Ein bestehendes TrackedMeal entfernen
export async function DELETE(req: Request) {
  const { user, error } = await getAuthenticatedUser(req);
  if (error || !user) {
    return NextResponse.json(
      { error: error ?? "User not authenticated" },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id } = body; // hier die ID aus trackedMeal
  if (!id) {
    return NextResponse.json(
      { error: "Missing trackedMeal ID" },
      { status: 400 }
    );
  }

  try {
    const tracked = await prisma.trackedMeal.findUnique({ where: { id } });
    if (!tracked || tracked.userId !== user.id) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );
    }
    await prisma.trackedMeal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Prisma-Fehler (DELETE /trackedMeal):", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
