import { NextResponse } from 'next/server';
import { getAllAvatars } from '@/lib/weekly-avatar/avatar-service';

/**
 * GET /api/weekly-avatar/all
 * Returns all generated avatars for the gallery page
 */
export async function GET() {
  try {
    const avatars = await getAllAvatars();

    return NextResponse.json({
      success: true,
      avatars: avatars.map((avatar) => ({
        id: avatar.id,
        week_date: avatar.week_date,
        image_url: avatar.image_url,
        headlines: avatar.headlines,
        generated_prompt: avatar.generated_prompt,
        created_at: avatar.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching all avatars:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch avatars',
        avatars: [],
      },
      { status: 500 }
    );
  }
}
