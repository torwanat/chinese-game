# Chinese Game

A multiplayer board game application built with **Angular 17** and **PHP**, featuring real-time gameplay with internationalization support.

## What the project does

Chinese Game is a web-based multiplayer board game where up to 4 players compete to move their pawns around a board based on dice rolls. The game includes:

- **Multiplayer lobby system** - Create and join game lobbies with other players
- **Real-time game state management** - Live updates on player moves and game status
- **Dice roll mechanics** - Randomized movement determination
- **Multi-language support** - English and Polish localization built-in
- **Player authentication** - Unique player identities in games
- **Responsive board UI** - Interactive game board with visual feedback for playable moves

## Why the project is useful

This project demonstrates a complete full-stack game implementation with:

- **Modern frontend architecture** - Angular 17 with standalone components and reactive programming
- **Real-time synchronization** - PHP backend managing game state and player interactions
- **Internationalization** - Multi-language support using gettext (PO/MO files)
- **Type-safe development** - Full TypeScript implementation for the frontend
- **Service-based architecture** - Decoupled game and board services for clean data flow
- **Educational value** - Clear examples of component-based UI, API integration, and game logic

## Getting started

### Prerequisites

- **Node.js** 18+ with npm
- **PHP** 7.4+ (for backend server)
- **Angular CLI** 17+ (optional, for development)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd chinese-game
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Set up the backend server:**
   - Configure your PHP server to serve the `backend/` directory
   - Update the API endpoint in [src/app/apiPrefix.ts](src/app/apiPrefix.ts) if needed

### Running the application

**Development server:**
```bash
npm start
```
Navigate to `http://localhost:4200/`. The application automatically reloads when you modify source files.

**Build for production:**
```bash
npm run build
```
Build artifacts are stored in the `dist/` directory.

### Running tests

**Unit tests:**
```bash
npm test
```
Tests are executed via [Karma](https://karma-runner.github.io) and [Jasmine](https://jasmine.github.io).

## Project structure

```
src/
├── app/
│   ├── board/              # Board game display and interaction
│   ├── dice/               # Dice roll component
│   ├── game/               # Game service managing state and API calls
│   ├── board.service.ts    # Board logic and pawn movement
│   ├── game.service.ts     # Central game state management
│   ├── types.ts            # TypeScript type definitions
│   └── [other components]  # Login, Lobby, Language selection, Tile
│
└── assets/                 # Static assets

backend/
├── game.php                # Game logic and rules
├── player.php              # Player management
├── move.php                # Move validation and processing
├── game_data.php           # Game state persistence
└── Locale/                 # i18n translations (en_US, pl_PL)
```

## Usage example

1. **Start the game:**
   - Open the application and enter your player nickname
   - Choose a color (Red, Blue, Green, or Yellow)
   - Wait for other players to join the lobby

2. **During gameplay:**
   - When it's your turn, click the dice to roll
   - Available tiles highlight based on your roll
   - Select a highlighted tile to move your pawn
   - Game continues until one player wins

3. **Changing language:**
   - Use the language selector to toggle between English and Polish
   - Game interface and messages update in real-time

## Technologies used

- **Frontend:** Angular 17, TypeScript 5.3, RxJS 7.8
- **Backend:** PHP 7.4+
- **Localization:** gettext (PO/MO files)
- **Testing:** Jasmine, Karma
- **Build:** Angular CLI 17
