import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// GET - Fetch all people for the user, with their gifts
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: people, error } = await supabaseAdmin
      .from("christmas_people")
      .select(`
        *,
        gifts:christmas_gifts(*)
      `)
      .eq("clerk_user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching christmas people:", error);
      return NextResponse.json({ error: "Failed to fetch people" }, { status: 500 });
    }

    return NextResponse.json({ people });
  } catch (error) {
    console.error("Error in GET /api/christmas/people:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Add a new person
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, budget } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("christmas_people")
      .insert({
        clerk_user_id: userId,
        name,
        budget: budget || 0
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating person:", error);
      return NextResponse.json({ error: "Failed to create person" }, { status: 500 });
    }

    return NextResponse.json({ person: data });
  } catch (error) {
    console.error("Error in POST /api/christmas/people:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
