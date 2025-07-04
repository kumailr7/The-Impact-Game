# The Impact Level Game

This is a web-based game where users can test their knowledge of software engineering by guessing the impact level of various scenarios. The game is built with Next.js and uses NextAuth.js for authentication.

## Features

- User authentication with Google
- A game where users can guess the impact level of various software engineering scenarios
- A scoreboard to track user scores
- Questions are generated based on the user's selected role and difficulty level

## Getting Started

To get started, you'll need to have Node.js and npm installed.

1. Clone the repository:

```bash
git clone https://github.com/your-username/the-impact-game.git
```

2. Install the dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:3000` to play the game.

5. Create a .env file and add these values
```
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXTAUTH_URL
GEMINI_API_KEY
```
## How to Play

1. Sign in with your Google account.
2. Select your role and the difficulty level.
3. Read the scenario and select the impact level that you think is most appropriate.
4. Click the "Submit" button to see if you're correct.
5. The game will continue until you've answered all of the questions.
6. Your score will be saved to the scoreboard.

## Project Structure

The project is organized as follows:

- `src/app`: The main application code
- `src/app/api`: The API routes
- `src/app/game`: The game page
- `src/app/scoreboard`: The scoreboard page
- `src/components`: The React components
- `src/data`: The data files
- `src/lib`: The library files
- `src/types`: The type definition files
