'use strict';

const xss = require('xss');

const MemoryGeneralService = {
    getAllPlayers(db) {
        return db
        .from('memory_general')
        .select(
            'player_name'
        )
    },

    getHighScores(db) {
        return db
            .from('memory_general JOIN memory_user ON memory_general.player_name = memory_user.id')
            .select(
                'memory_general.player_name',
                'memory_user.experience_level',
                'memory_user.quickest_game_played'
            )
            .order_by('quickest_game_played')
            .using('>')         
    },

    postPlayer(db, name) {
        return db
            .into('memory_general')    
            .insert(name)
            .catch(err => {console.error(err)})
    },

    serializeNames(names) {
       return {
           name: xss(names.player_name),
           created: names.player_created,
           time: names.total_time_played
       }
    }
}

module.exports = MemoryGeneralService;