import { supabaseAdmin } from '@/lib/supabase/server';
import { fetchTopHeadlines } from './news-service';
import { generateImagePrompt } from './prompt-generator';
import { generateAvatarImage } from './image-generator';
import { uploadToR2, generatePublicId } from './r2-service';
import { WeeklyAvatar, Headline } from './types';

/**
 * Gets the Monday of the current week (week start date)
 */
export function getWeekStartDate(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

/**
 * Gets the current week's avatar, or the most recent one if not available
 */
export async function getCurrentAvatar(): Promise<WeeklyAvatar | null> {
  const weekDate = getWeekStartDate();

  // First try to get this week's avatar
  const { data: currentAvatar, error: currentError } = await supabaseAdmin
    .from('weekly_avatars')
    .select('*')
    .eq('week_date', weekDate)
    .eq('status', 'success')
    .single();

  if (currentAvatar && !currentError) {
    return currentAvatar as WeeklyAvatar;
  }

  // Fall back to the most recent successful avatar
  const { data: recentAvatar, error: recentError } = await supabaseAdmin
    .from('weekly_avatars')
    .select('*')
    .eq('status', 'success')
    .order('week_date', { ascending: false })
    .limit(1)
    .single();

  if (recentError) {
    console.error('Error fetching recent avatar:', recentError);
    return null;
  }

  return recentAvatar as WeeklyAvatar;
}

/**
 * Gets all successful avatars for the gallery page
 */
export async function getAllAvatars(): Promise<WeeklyAvatar[]> {
  const { data, error } = await supabaseAdmin
    .from('weekly_avatars')
    .select('*')
    .eq('status', 'success')
    .order('week_date', { ascending: false });

  if (error) {
    console.error('Error fetching avatars:', error);
    return [];
  }

  return data as WeeklyAvatar[];
}

/**
 * Checks if generation is paused (for sensitive events)
 */
export async function isGenerationPaused(): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('weekly_avatars')
    .select('is_paused')
    .eq('is_paused', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return !!data?.is_paused;
}

/**
 * Main function to generate the weekly avatar
 * This is called by the cron job
 */
export async function generateWeeklyAvatar(): Promise<{
  success: boolean;
  avatar?: WeeklyAvatar;
  error?: string;
}> {
  const weekDate = getWeekStartDate();
  const publicId = generatePublicId(weekDate);

  // Check if already generated for this week
  const { data: existing } = await supabaseAdmin
    .from('weekly_avatars')
    .select('*')
    .eq('week_date', weekDate)
    .single();

  if (existing?.status === 'success') {
    return { success: true, avatar: existing as WeeklyAvatar };
  }

  // Check if generation is paused
  if (await isGenerationPaused()) {
    return { success: false, error: 'Generation is paused for sensitive events' };
  }

  // Create or update the record to 'generating' status
  const { data: record, error: upsertError } = await supabaseAdmin
    .from('weekly_avatars')
    .upsert(
      {
        week_date: weekDate,
        status: 'generating',
        headlines: [],
        generated_prompt: '',
        image_url: '',
      },
      { onConflict: 'week_date' }
    )
    .select()
    .single();

  if (upsertError) {
    console.error('Error creating avatar record:', upsertError);
    return { success: false, error: 'Failed to create avatar record' };
  }

  let headlines: Headline[] = [];
  let visualConcept = '';

  try {
    // Step 1: Fetch headlines
    console.log('Fetching headlines...');
    headlines = await fetchTopHeadlines(5);

    // Step 2: Generate visual concept from headlines
    console.log('Generating visual concept...');
    visualConcept = await generateImagePrompt(headlines);

    // Step 3: Generate the image
    console.log('Generating avatar image...');
    const { base64 } = await generateAvatarImage(visualConcept);

    // Step 4: Upload to R2
    console.log('Uploading to R2...');
    const imageUrl = await uploadToR2(base64, publicId);

    // Step 5: Update the record with success
    const { data: updatedAvatar, error: updateError } = await supabaseAdmin
      .from('weekly_avatars')
      .update({
        status: 'success',
        image_url: imageUrl,
        headlines: headlines,
        generated_prompt: visualConcept,
      })
      .eq('week_date', weekDate)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update avatar record: ${updateError.message}`);
    }

    console.log('Weekly avatar generated successfully!');
    return { success: true, avatar: updatedAvatar as WeeklyAvatar };
  } catch (error) {
    console.error('Error generating weekly avatar:', error);

    // Update record with failure
    await supabaseAdmin
      .from('weekly_avatars')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        headlines: headlines,
        generated_prompt: visualConcept,
      })
      .eq('week_date', weekDate);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
