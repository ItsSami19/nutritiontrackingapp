import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/lib/supabaseClient";

const prisma = new PrismaClient();

// Test-User
const testUser = { id: '1' };

async function getAuthenticatedUser(req: Request) {
  // Für Test
  return { user: testUser, error: null };

  /*
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return { user: null, error: "User not authenticated" };
  }
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return { user: null, error: "Invalid token" };
  }
  return { user: data.user, error: null };
  */
}

export async function GET(req: Request) {
  const { user, error } = await getAuthenticatedUser(req);
  if (error || !user) {
    return NextResponse.json({ error: error ?? "User not authenticated" }, { status: 401 });
  }

  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "Missing 'date' parameter" }, { status: 400 });
  }

  const dateStart = new Date(date);
  dateStart.setHours(0, 0, 0, 0);
  const dateEnd = new Date(date);
  dateEnd.setHours(23, 59, 59, 999);

  try {
    const meals = await prisma.meal.findMany({
      where: {
        userId: user.id,
        date: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
    });
    return NextResponse.json(meals);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { user, error } = await getAuthenticatedUser(req);
  if (error || !user) {
    return NextResponse.json({ error: error ?? "User not authenticated" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, calories, protein, fat, carbohydrates, containsMeat, date } = body;

  if (!name || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const newMeal = await prisma.meal.create({
      data: {
        title: name,
        calories,
        protein,
        fat,
        carbohydrates,
        containsMeat,
        date: new Date(date),
        userId: user.id,
      },
    });
    return NextResponse.json(newMeal, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { user, error } = await getAuthenticatedUser(req);
  if (error || !user) {
    return NextResponse.json({ error: error ?? "User not authenticated" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing meal ID" }, { status: 400 });
  }

  try {
    const meal = await prisma.meal.findUnique({ where: { id } });
    if (!meal || meal.userId !== user.id) {
      return NextResponse.json({ error: "Meal not found or unauthorized" }, { status: 404 });
    }
    await prisma.meal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
