'use strict';

/*
    The 'MemoryGeneralService' handles all database transactions for resources related to everything but
    authentication and user creation.
*/
const MemoryGeneralService = {
    // Updates how many time the user has played
    updatePlayerGameTotal(db, newId){
        return db 
            .from('memory_general')
            .where({'player_id' : newId})
            .increment('games_played', 1)
            .returning('*')
            .then(rows => {
              return rows[0];
            });
    },
    // Sets player stats to defaults upon initial player creation
    setPlayerInitialStats(db, player_id){
        return db
            .into('memory_general')
            .insert({player_id})
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
    // Gets the quickest time played for the experience level
    getTimeForLevel(db, player_id, level){
        let experienceLevel = level.toLowerCase()
        return db
            .into('memory_general')
            .where({ 'player_id' : player_id })
            .select(`quickest_game_played_${experienceLevel}`)
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
    // Post the quickest time for each experience level if it is the quickest time
    postQuickest(db, player_id, experience, quickest_time){
        switch(experience){
            case('beginner'):
                return db
                .into('memory_general')
                .where({'player_id':player_id})
                .update({ quickest_game_played_beginner : quickest_time})
                .returning('*')
                .then(rows => {
                    return rows[0];
                });
            break;
            case('easy'):
                return db
                .into('memory_general')
                .where({'player_id':player_id})
                .update({ quickest_game_played_easy : quickest_time})
                .returning('*')
                .then(rows => {
                    return rows[0];
                });
                break;
            case('medium'):
                return db
                .into('memory_general')
                .where({'player_id':player_id})
                .update({ quickest_game_played_medium : quickest_time})
                .returning('*')
                .then(rows => {
                    return rows[0];
                });
                break;
            case('hard'):
                return db
                .into('memory_general')
                .where({'player_id':player_id})
                .update({ quickest_game_played_hard : quickest_time})
                .returning('*')
                .then(rows => {
                    return rows[0];
                });
                break;
            case('expert'):
                return db
                    .into('memory_general')
                    .where({'player_id':player_id})
                    .update({ quickest_game_played_expert : quickest_time})
                    .returning('*')
                    .then(rows => {
                        return rows[0];
                    });
                break;
        }
    },
    // Update how long the player has played the game in total (listed in seconds)
    updateTimePlayed(db, total_time_played, player_id){
        return db
            .into('memory_general')
            .where({ 'player_id' : player_id })
            .increment('total_time_played', total_time_played)
            .returning('*')
            .then(rows => {
                return rows[0];
              });
    },
    // Get all relevant player statistics for logged in users. For the player statistics screen
    getPlayerStats(db, id){
        return db
            .select(
                'memory_user.player_name',
                'memory_general.total_time_played',
                'memory_general.games_played',
                'memory_general.quickest_game_played_beginner',
                'memory_general.quickest_game_played_easy',
                'memory_general.quickest_game_played_expert',
                'memory_general.quickest_game_played_medium',
                'memory_general.quickest_game_played_hard'
            )
            .from('memory_user')
            .where({ 'player_id': id })
            .join('memory_general', 'memory_general.player_id','memory_user.id')
            .returning('*')
            .then(rows => {
                return rows[0] ;
            })
    },
    // Get the beginner level high score
    getHighScoresBeginner(db){
        return db
            .select(
                'memory_user.player_name',
                'memory_general.quickest_game_played_beginner',
            )
            .from('memory_user')
            .join('memory_general', 'memory_general.player_id','memory_user.id')
            .orderBy('memory_general.quickest_game_played_beginner', 'asc')
            .where('memory_general.quickest_game_played_beginner', '>', 0 )
            .returning('*')
            .then(rows => {
                return rows[0];
              });
    },
    // Get the easy difficulty level high score
    getHighScoresEasy(db){
        return db
            .select(
                'memory_user.player_name',
                'memory_general.quickest_game_played_easy',
            )
            .from('memory_user')
            .join('memory_general', 'memory_general.player_id','memory_user.id')
            .orderBy('memory_general.quickest_game_played_easy', 'asc')
            .where('memory_general.quickest_game_played_easy', '>', 0 )
            .returning('*')
            .then(rows => {
                return rows[0];
              });
    },
    // Get the medium difficulty level high score
    getHighScoresMedium(db){
        return db
            .select(
                'memory_user.player_name',
                'memory_general.quickest_game_played_medium',
            )
            .from('memory_user')
            .join('memory_general', 'memory_general.player_id','memory_user.id')
            .orderBy('memory_general.quickest_game_played_medium', 'asc')
            .where('memory_general.quickest_game_played_medium', '>', 0 )
            .returning('*')
            .then(rows => {
                return rows[0];
              });
    },
    // Get the hard difficulty level high scores
    getHighScoresHard(db){
        return db
            .select(
                'memory_user.player_name',
                'memory_general.quickest_game_played_hard',
            )
            .from('memory_user')
            .join('memory_general', 'memory_general.player_id','memory_user.id')
            .orderBy('memory_general.quickest_game_played_hard', 'asc')
            .where('memory_general.quickest_game_played_hard', '>', 0 )
            .returning('*')
            .then(rows => {
                return rows[0];
              });
    },
    // Get the expert difficulty level high scores
    getHighScoresExpert(db){
        return db
            .select(
                'memory_user.player_name',
                'memory_general.quickest_game_played_expert',
            )
            .from('memory_user')
            .join('memory_general', 'memory_general.player_id','memory_user.id')
            .orderBy('memory_general.quickest_game_played_expert', 'asc')
            .where('memory_general.quickest_game_played_expert', '>', 0 )
            .returning('*')
            .then(rows => {
                return rows[0];
              });
    },
}

module.exports = MemoryGeneralService;