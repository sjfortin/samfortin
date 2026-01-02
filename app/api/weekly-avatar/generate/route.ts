import { NextRequest, NextResponse } from 'next/server';
import { generateWeeklyAvatar } from '@/lib/weekly-avatar/avatar-service';

export const maxDuration = 120; // Allow up to 2 minutes for generation

/**
 * POST /api/weekly-avatar/generate
 * Triggers the weekly avatar generation
 * Called by Vercel Cron or manually for testing
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron or has a valid secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Allow requests from Vercel Cron (they include CRON_SECRET in authorization header)
    // or requests with the correct secret for manual testing
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if force parameter is set (for manual testing)
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    // On Hobby plan, cron runs daily - only generate on Mondays (or if forced)
    const today = new Date();
    const isMonday = today.getDay() === 1;
    
    if (!isMonday && !force) {
      return NextResponse.json({
        success: true,
        message: 'Skipped - not Monday. Use ?force=true to override.',
        day: today.toLocaleDateString('en-US', { weekday: 'long' }),
      });
    }

    console.log('Starting weekly avatar generation...');
    const result = await generateWeeklyAvatar();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Weekly avatar generated successfully',
        avatar: {
          week_date: result.avatar?.week_date,
          image_url: result.avatar?.image_url,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in weekly avatar generation endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/weekly-avatar/generate
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Weekly avatar generation endpoint is ready',
  });
}
