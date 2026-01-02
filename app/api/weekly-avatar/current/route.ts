import { NextResponse } from 'next/server';
import { getCurrentAvatar } from '@/lib/weekly-avatar/avatar-service';

/**
 * GET /api/weekly-avatar/current
 * Returns the current week's avatar or the most recent one
 */
export async function GET() {
  try {
    const avatar = await getCurrentAvatar();

    if (!avatar) {
      return NextResponse.json(
        {
          success: false,
          error: 'No avatar available',
          fallback: '/images/moebius-sam.png',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      avatar: {
        week_date: avatar.week_date,
        image_url: avatar.image_url,
        headlines: avatar.headlines,
      },
    });
  } catch (error) {
    console.error('Error fetching current avatar:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch avatar',
        fallback: '/images/moebius-sam.png',
      },
      { status: 500 }
    );
  }
}
