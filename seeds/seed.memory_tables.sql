BEGIN;

TRUNCATE
    memory_general,
    memory_user
    RESTART IDENTITY CASCADE;

INSERT INTO memory_user(player_name, password, player_created)
VALUES
('DEMO', 'pas5worD!' , now()),
('David', 'pas5worD!' , now()),
('Melissa', 'pas5worD!' , now()),
('Ashley', 'pas5worD!' , now()),
('Jimmy', 'pas5worD!' , now());

INSERT INTO memory_general(quickest_game_played_beginner, quickest_game_played_easy, quickest_game_played_medium, quickest_game_played_hard,
                            quickest_game_played_expert, total_time_played, games_played)
VALUES
(122, 300, 673, 1023, 1400 , 910, 22),
(105, 255, 620, 920, 1150, 913, 14),
(100, 304, 605, 905, 1237 , 1500, 23),
(144, 287, 632, 815, 1314, 1001, 8),
(0,0,0,0,0,0,0);

UPDATE memory_general SET player_id = 1 WHERE id = 1;
UPDATE memory_general SET player_id = 2 WHERE id = 2;
UPDATE memory_general SET player_id = 3 WHERE id = 3;
UPDATE memory_general SET player_id = 4 WHERE id = 4;
UPDATE memory_general SET player_id = 5 WHERE id = 5;

COMMIT;