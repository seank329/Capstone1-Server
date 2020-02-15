'use strict';

const xss = require('xss');

const MemoryGeneralService = {
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
    setPlayerInitialStats(db, player_id){
        return db
            .into('memory_general')
            .insert({player_id})
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
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
    getPlayerStats(db, player_name){
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
            .where({player_name})
            .join('memory_general', 'memory_general.player_id','memory_user.id')
            .returning('*')
            .then(rows => {
                return rows[0];
              });
    },
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
    // getAllPlayers(db) {
    //     return db
    //     .from('memory_general')
    //     .select(
    //         'player_name'
    //     )
    // },

    // getHighScores(db) {
    //     return db
    //         .from('memory_general JOIN memory_user ON memory_general.player_name = memory_user.id')
    //         .select(
    //             'memory_general.player_name',
    //             'memory_user.experience_level',
    //             'memory_user.quickest_game_played'
    //         )
    //         .order_by('quickest_game_played')
    //         .using('>')         
    // },

    // postPlayer(db, name) {
    //     return db
    //         .into('memory_general')    
    //         .insert(name)
    //         .catch(err => {console.error(err)})
    // },

    serializeNames(names) {
       return {
           name: xss(names.player_name),
           created: names.player_created,
           time: names.total_time_played
       }
    }
}

module.exports = MemoryGeneralService;