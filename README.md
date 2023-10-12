# summarize-server

Usage:


POST /api/user/login -> Returns JWT token (auth-token)

    { 
        "email": <EMAIL> 
        "password": <PASSWORD> 
    }    
    
POST /api/user/register -> Create account

    { 
        "firstName": <NAME> 
        "lastName": <NAME> 
        "email": <EMAIL> 
        "password": <PASSWORD> 
    }    

POST /api/summarize 

Headers:

    { "auth-token": <JWT-Token from login> }

Body:

    { "text": <String to be summarized> }
