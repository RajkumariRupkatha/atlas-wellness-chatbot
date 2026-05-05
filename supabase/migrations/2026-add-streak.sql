-- Add streak tracking columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_streak INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS longest_streak INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_checkin_date DATE;

-- Backfill existing users: compute streak from daily_checkins history
-- For each user, find the most recent checkin date and set streak to 1
-- (full streak history recompute happens server-side on first API call)
UPDATE users u
SET
  last_checkin_date = (
    SELECT DATE(MAX(created_at))
    FROM daily_checkins dc
    WHERE dc.user_id = u.id
  )
WHERE EXISTS (
  SELECT 1 FROM daily_checkins dc WHERE dc.user_id = u.id
);
