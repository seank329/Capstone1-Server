BEGIN;

TRUNCATE
    memory_general,
    memory_user
    RESTART IDENTITY CASCADE;

INSERT INTO memory_user(player_name, password, player_created)
VALUES
('Sean', 'ncc1701D!' , now()),
('David', 'ncc1701D!' , now()),
('Melissa', 'ncc1701D!' , now()),
('Ashley', 'ncc1701D!' , now()),
('Jimmy', 'ncc1701D!' , now());

INSERT INTO memory_general(quickest_game_played_beginner, quickest_game_played_easy, quickest_game_played_medium, quickest_game_played_hard,
                            quickest_game_played_expert, total_time_played, games_played)
VALUES
(73, 82, 91, 115, 300 , 200, 22),
(30, 51, 65, 110, 205 , 326, 10),
(22, 78, 85, 150, 310 , 447, 5),
(34, 55, 112, 144, 215 , 200, 44),
(0,0,0,0,0,0,0);

UPDATE memory_general SET player_id = 1 WHERE id = 1;
UPDATE memory_general SET player_id = 2 WHERE id = 2;
UPDATE memory_general SET player_id = 3 WHERE id = 3;
UPDATE memory_general SET player_id = 4 WHERE id = 4;
UPDATE memory_general SET player_id = 5 WHERE id = 5;

COMMIT;