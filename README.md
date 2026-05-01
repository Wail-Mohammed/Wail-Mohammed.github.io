# Wail-Mohammed.github.io
Web Development Term Project 
Project name = Guess the Number

Project Description = This is a fun and interactive small web application that challenges players (one player at a time),
to guess a randomly generated "secret" number within a limited number of tries. 
If you guess the number with in the given attempts you get to score a dynamic score depending on how many attempts you have left and whether the game level is easy, medium or hard.

Features: 
1- There are three difficulty levels: Easy (1-50), Medium (1-100), and Hard (1-200).
2- There is a dynamic scoring system. Points are calculated based on the remaining attempts and chosen difficulty.
3- Hint system: If you are ever stuck or need help guessing (especially helpful in the hard difficulty level) then this can help you with guessing but it will also reduce your final score by 30%.
4- Leadership board: This project uses a database to store best or highest records in an SQLite database. It will display the top 5 scores with player's inputted Initials.
5- This project use dark mode styling variables and also has an offline fallback feature that saves into the browers local storage. (This is helpful when running the app without the database running in the backend.)

Tech Stack:
Frontend: JS, HTML and CSS
Backend: Python with Flask framework.
Database: SQLite.

How to run: 

1- In your terminal run : pip install flask flask-cors
2- Once you are in the main project folder run: python3 app.py
3- Play the game: Run http://127.0.0.1:5000 or click on the link within the terminal.

How to play: 

1- After launching the game, select your desired difficulty level from the dropdown menu.
2- Type your guess in the input box and click guess.
3- The game will tell you if your guess is "Too high" or "Too low".
4- Keep guessing until you find the number or run out of attempts.
5- If you win and get a high score, a prompt will ask for your initials to add you to the Leaderboard.