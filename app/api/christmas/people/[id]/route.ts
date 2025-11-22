import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const { data: person, error: personError } = await supabaseAdmin
      .from("christmas_people")
      .select('id')
      .eq('id', id)
      .eq('clerk_user_id', userId)
      .single();

    if (personError || !person) {
      return NextResponse.json({ error: "Person not found or unauthorized" }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from("christmas_people")
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting person:", error);
      return NextResponse.json({ error: "Failed to delete person" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/christmas/people/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
