Memory Challenge - Server
=========================

   <br />
   <br />
   
Link to Live
------------
https://memory-app-sigma.now.sh/   

   <br />
   <br />
   
API Documentation
-----------------


  ### Routes ###


  * ##### /api/auth, authRouter
    Route for authentication.   <br />
    Endpoints: 
      * .post (/login)   <br />
         > Login Credentials, Posting   <br />
      * .post (/refresh)   <br />
         > Login Credentials, Refreshing
         
  
  * ##### /api/users, userRouter
    Route for registering new users.   <br />
    Endpoints:
      * .post (/)   <br />
         > Registering a new player
  
  * ##### /api/memory-general, generalRouter.   
    Route for getting and receiving game data.   <br />
    Endpoints:
       * .get (/experience/:level)   <br />
          > Route for getting high scores at each level. Returns time and player with top score.   <br />
       * .get, .post, .put (/player/:id)   <br />
          > Routes for getting, posting, and updating player data
  

       
   
   Screenshots
   -----------
   ![Alt Landing](/images/001.png)
   ![Alt High Scores](/images/002.png)
   ![Alt Login](/images/003.png)
   ![Alt Game Screen](/images/004.png)
   ![Alt Player Stats](/images/005.png)
      <br />
      <br />
      
   Description
   -----------
   This app is a fun game designed to challenge your memory! Cards are randomly ordered, face down. Try to find matching 
   pairs to clear the game board and try to get the lowest times possible. Login to keep track of your fastest games at each
   difficulty level, as well as total games played, and total time spent clearing the game-board!
      <br />
      <br />

       
   Technologies Used
   -----------------
   * React.JS
   * HTML
   * CSS
   * Node.JS
   * Express.JS
   * PostgresQL
   
