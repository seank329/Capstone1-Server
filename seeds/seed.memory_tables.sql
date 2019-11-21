BEGIN;

TRUNCATE
    memory_general,
    memory_user
    RESTART IDENTITY CASCADE;

INSERT INTO memory_user(quickest_game_played, experience_level, background_theme, card_theme)
VALUES
('01:00:00', 'Beginner', 'Light', 'Numbers'),
('01:20:00', 'Easy', 'Dark', 'Numbers'),
('00:59:00', 'Medium', 'Dark', 'Numbers'),
('00:21:30', 'Hard', 'Dark', 'Numbers'),
('02:00:05', 'Expert', 'Dark', 'Numbers'),
('00:05:10', 'Beginner', 'Light', 'Numbers'),
('00:48:27', 'Expert', 'Light', 'Numbers'),
('00:15:00', 'Medium', 'Light', 'Numbers'),
('00:02:00', 'Beginner', 'Light', 'Numbers'),
('00:15:00', 'Easy', 'Dark', 'Numbers');

INSERT INTO memory_general(player_name, player_created, total_time_played, player_id)
VALUES
('sean', now(), '04:00:00', 1),
('jimbo41', now(), '10:00:00', 2),
('purpleLights85', now(), '04:00:05', 3),
('Ariana', now(), '04:30:00', 4),
('sean kc', now(), '01:00:00', 5),
('sean cooper', now(), '10:38:56', 6),
('Danielle', now(), '04:00:00', 7),
('Alexander', now(), '14:00:00', 8),
('Sasha', now(), '04:08:27', 9),
('Sophia', now(), '04:00:00', 10);

COMMIT;