
-- Create sample task categories
INSERT INTO public.task_categories (name, description) VALUES
('Music', 'Music-related tasks including Spotify activities'),
('Social', 'Social media engagement tasks'),
('Daily', 'Daily check-in and routine tasks'),
('Referral', 'Friend referral and community building tasks');

-- Create sample tasks
INSERT INTO public.tasks (
  title, description, instructions, category_id, points, difficulty, 
  verification_type, estimated_time, redirect_url, required_media, active
) VALUES
-- Music Tasks
('Follow SoundTrump on Spotify', 'Follow our official Spotify playlist to stay updated with the latest tracks', 'Click the link below to go to our Spotify page and hit the Follow button. Take a screenshot of the confirmation.', 
 (SELECT id FROM task_categories WHERE name = 'Music'), 50, 'Easy', 'Manual', '2 minutes', 'https://open.spotify.com/user/soundtrump', true, true),

('Create a Music Playlist', 'Create a playlist with at least 10 songs and share it', 'Create a new playlist on Spotify with at least 10 songs. Make it public and take a screenshot of the playlist.', 
 (SELECT id FROM task_categories WHERE name = 'Music'), 100, 'Medium', 'Manual', '15 minutes', 'https://open.spotify.com/browse', true, true),

('Listen to 5 New Artists', 'Discover and listen to 5 new artists you have never heard before', 'Use Spotify Discover Weekly or Browse to find 5 new artists. Listen to at least one full song from each artist.', 
 (SELECT id FROM task_categories WHERE name = 'Music'), 75, 'Easy', 'Automatic', '30 minutes', null, false, true),

-- Social Tasks
('Share SoundTrump on Twitter', 'Share about SoundTrump on your Twitter account', 'Post a tweet about SoundTrump mentioning @SoundTrump and use #SoundTrump hashtag. Include a screenshot of your tweet.', 
 (SELECT id FROM task_categories WHERE name = 'Social'), 80, 'Easy', 'Manual', '5 minutes', 'https://twitter.com/intent/tweet?text=Earning%20ST%20coins%20on%20@SoundTrump!%20%23SoundTrump', true, true),

('Join SoundTrump Discord', 'Join our Discord community and introduce yourself', 'Join our Discord server and post an introduction in the #introductions channel. Take a screenshot of your introduction message.', 
 (SELECT id FROM task_categories WHERE name = 'Social'), 60, 'Easy', 'Manual', '10 minutes', 'https://discord.gg/soundtrump', true, true),

('Instagram Story Share', 'Share SoundTrump on your Instagram story', 'Post about SoundTrump on your Instagram story. Tag @soundtrump.official and use #SoundTrump hashtag.', 
 (SELECT id FROM task_categories WHERE name = 'Social'), 70, 'Medium', 'Manual', '5 minutes', null, true, true),

-- Daily Tasks
('Daily Check-in', 'Complete your daily check-in to earn ST coins', 'Simply click the complete button to check in for today and earn your daily ST coins bonus.', 
 (SELECT id FROM task_categories WHERE name = 'Daily'), 25, 'Easy', 'Automatic', '1 minute', null, false, true),

('Rate 3 Songs', 'Rate 3 different songs on the platform', 'Go to the music section and rate at least 3 different songs. Your ratings help improve recommendations for everyone.', 
 (SELECT id FROM task_categories WHERE name = 'Daily'), 30, 'Easy', 'Automatic', '5 minutes', null, false, true),

('Complete Profile', 'Fill out your complete profile information', 'Add your profile picture, bio, and music preferences to complete your profile setup.', 
 (SELECT id FROM task_categories WHERE name = 'Daily'), 40, 'Easy', 'Manual', '10 minutes', null, true, true),

-- Referral Tasks
('Invite Your First Friend', 'Invite a friend to join SoundTrump using your referral code', 'Share your unique referral code with a friend and have them sign up using it. You both earn bonus ST coins!', 
 (SELECT id FROM task_categories WHERE name = 'Referral'), 150, 'Medium', 'Automatic', '5 minutes', null, false, true),

('Refer 5 Friends', 'Successfully refer 5 friends to the platform', 'Get 5 friends to sign up using your referral code. This is a high-value task with great rewards!', 
 (SELECT id FROM task_categories WHERE name = 'Referral'), 500, 'Hard', 'Automatic', '1 week', null, false, true),

('Social Media Referral', 'Share your referral code on social media', 'Post your referral code on your social media accounts (Twitter, Instagram, TikTok) and tag @SoundTrump.', 
 (SELECT id FROM task_categories WHERE name = 'Referral'), 100, 'Medium', 'Manual', '10 minutes', null, true, true);

-- Create sample rewards
INSERT INTO public.rewards (
  name, description, points_cost, quantity, image_url, active
) VALUES
('Premium Account (1 Month)', 'Upgrade to Premium tier for 1 month with exclusive benefits', 500, 100, null, true),
('Exclusive Playlist Access', 'Access to curated playlists from top artists', 200, 50, null, true),
('SoundTrump Merchandise', 'Official SoundTrump t-shirt and stickers pack', 300, 25, null, true),
('Concert Ticket Discount', '50% off concert tickets for partnered venues', 800, 10, null, true),
('Artist Meet & Greet', 'Virtual meet and greet with featured artists', 1000, 5, null, true),
('Custom Playlist Feature', 'Have your playlist featured on SoundTrump homepage', 400, 20, null, true),
('Early Access Pass', 'Early access to new features and beta testing', 150, 100, null, true),
('Music Producer Session', '1-hour session with a professional music producer', 1500, 3, null, true),
('Spotify Premium (3 Months)', 'Free Spotify Premium subscription for 3 months', 600, 15, null, true),
('Vinyl Record Collection', 'Curated vinyl record collection (5 albums)', 900, 8, null, true);
