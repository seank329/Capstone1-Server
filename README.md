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
      * .post(/login)
         Login Credentials, Posting
      * .post(/refresh)
         Login Credentials, Refreshing
         
  
  * ##### /api/users, userRouter
    Route for registering new users.   <br />
    Endpoints:
      * .post(/)
  
  * ##### /api/memory-general, generalRouter.   
    Route for getting and receiving game data.   <br />
    Endpoints:
       * .get(/experience/:level)
       * .get(/player/:id)
       * .post(/player/:id)
       * .put(/player/:id
  

       
   
   Screenshots
   -----------
   Please Visit : https://github.com/seank329/Capstone1-UI/blob/master/README.md
      
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
   
