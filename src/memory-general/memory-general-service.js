const MemoryGeneralService = {

    getHighScores(db, level){
        return db
            .select(
                'memory_user.player_name',
                `memory_general.quickest_game_played_${level}`,
            )
            .from('memory_user')
            .join('memory_general', 'memory_general.player_id','memory_user.id')
            .orderBy(`memory_general.quickest_game_played_${level}`, 'asc')
            .where(`memory_general.quickest_game_played_${level}`, '>', 0 ) 
            .returning('*')
            .then(rows=>{
                return (rows[0])
            }
            )

        },

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

        setPlayerInitialStats(db, player_id){
            return db
                .into('memory_general')
                .insert({player_id})
                .returning('*')
                .then(rows => {
                    return rows[0];
                });
        },

        postTimes(db, player_id, experience, total_time, is_quickest){
            if(is_quickest){
                switch(experience){
                    case('beginner'):
                        return db
                        .into('memory_general')
                        .where({'player_id':player_id})
                        .increment('games_played', 1)
                        .increment('total_time_played', total_time)
                        .update({ quickest_game_played_beginner : total_time})
                        .returning('*')
                        .then(rows => {
                            return rows[0];
                        });
                    break;
                    case('easy'):
                        return db
                        .into('memory_general')
                        .where({'player_id':player_id})
                        .increment('games_played', 1)
                        .increment('total_time_played', total_time)
                        .update({ quickest_game_played_easy : total_time})
                        .returning('*')
                        .then(rows => {
                            return rows[0];
                        });
                        break;
                    case('medium'):
                        return db
                        .into('memory_general')
                        .where({'player_id':player_id})
                        .increment('games_played', 1)
                        .increment('total_time_played', total_time)
                        .update({ quickest_game_played_medium : total_time })
                        .returning('*')
                        .then(rows => {
                            return rows[0];
                        });
                        break;
                    case('hard'):
                        return db
                        .into('memory_general')
                        .where({'player_id':player_id})
                        .increment('games_played', 1)
                        .increment('total_time_played', total_time)
                        .update({ quickest_game_played_hard : total_time})
                        .returning('*')
                        .then(rows => {
                            return rows[0];
                        });
                        break;
                    case('expert'):
                        return db
                            .into('memory_general')
                            .where({'player_id':player_id})
                            .increment('games_played', 1)
                            .increment('total_time_played', total_time)
                            .update({ quickest_game_played_expert})
                            .returning('*')
                            .then(rows => {
                                return rows[0];
                            });
                        break;
                }
            } else {
                    return db 
                        .from('memory_general')
                        .where({'player_id' : player_id})
                        .increment('games_played', 1)
                        .increment('total_time_played', total_time)
                        .returning('*')
                        .then(rows => {
                          return rows[0];
                        })
                }

        },

}

module.exports = MemoryGeneralService;