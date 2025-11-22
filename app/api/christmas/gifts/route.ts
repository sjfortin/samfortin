import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// POST - Add a new gift
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { person_id, name, link, cost, status } = await request.json();

    // Verify person belongs to user
    const { data: person, error: personError } = await supabaseAdmin
        .from("christmas_people")
        .select('id')
        .eq('id', person_id)
        .eq('clerk_user_id', userId)
        .single();
    
    if (personError || !person) {
        return NextResponse.json({ error: "Person not found or unauthorized" }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin
      .from("christmas_gifts")
      .insert({
        person_id,
        name,
        link,
        cost: cost || 0,
        status: status || 'idea'
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating gift:", error);
      return NextResponse.json({ error: "Failed to create gift" }, { status: 500 });
    }

    return NextResponse.json({ gift: data });
  } catch (error) {
    console.error("Error in POST /api/christmas/gifts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update a gift
export async function PUT(request: Request) {
    try {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { id, name, link, cost, status } = await request.json();

      // Verify gift belongs to a person owned by user
      const { data: gift, error: giftError } = await supabaseAdmin
        .from("christmas_gifts")
        .select('person_id, christmas_people!inner(clerk_user_id)')
        .eq('id', id)
        .single();

      // @ts-ignore - supabase types inference might be tricky with joins
      if (giftError || !gift || gift.christmas_people?.clerk_user_id !== userId) {
         return NextResponse.json({ error: "Gift not found or unauthorized" }, { status: 404 });
      }

      const { data, error } = await supabaseAdmin
        .from("christmas_gifts")
        .update({
            name,
            link,
            cost,
            status
        })
        .eq('id', id)
        .select()
        .single();
  
      if (error) {
        console.error("Error updating gift:", error);
        return NextResponse.json({ error: "Failed to update gift" }, { status: 500 });
      }
  
      return NextResponse.json({ gift: data });
    } catch (error) {
      console.error("Error in PUT /api/christmas/gifts:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

// DELETE - Delete a gift
export async function DELETE(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Gift ID is required" }, { status: 400 });
        }

        // Verify ownership
        const { data: gift, error: giftError } = await supabaseAdmin
        .from("christmas_gifts")
        .select('person_id, christmas_people!inner(clerk_user_id)')
        .eq('id', id)
        .single();

        // @ts-ignore
        if (giftError || !gift || gift.christmas_people?.clerk_user_id !== userId) {
            return NextResponse.json({ error: "Gift not found or unauthorized" }, { status: 404 });
        }

        const { error } = await supabaseAdmin
            .from("christmas_gifts")
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting gift:", error);
            return NextResponse.json({ error: "Failed to delete gift" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /api/christmas/gifts:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
