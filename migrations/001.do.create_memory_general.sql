DROP TABLE IF EXISTS memory_general;
DROP TABLE IF EXISTS memory_user;

CREATE TABLE memory_user (
    id SERIAL PRIMARY KEY,
    player_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    player_created TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE memory_general (
    id SERIAL PRIMARY KEY,
    quickest_game_played_beginner INTEGER DEFAULT 0,
    quickest_game_played_easy INTEGER DEFAULT 0,
    quickest_game_played_medium INTEGER DEFAULT 0,
    quickest_game_played_hard INTEGER DEFAULT 0,
    quickest_game_played_expert INTEGER DEFAULT 0,
    total_time_played INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0
);



ALTER TABLE memory_general
    ADD COLUMN
        player_id INTEGER REFERENCES memory_user(id)
        ON DELETE SET NULL;