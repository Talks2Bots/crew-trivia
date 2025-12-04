# crew-trivia
Practice trivia project with multiple contributors

## Running the Game

Due to browser CORS security policies, you need to run a local server to play the game. Here are several options:

### Option 1: Python Server (Recommended)
If you have Python installed:
```bash
python server.py
```
Or simply double-click `server.bat` on Windows.

Then open http://localhost:8000/index.html in your browser.

### Option 2: Python Built-in Server
```bash
python -m http.server 8000
```
Then open http://localhost:8000/index.html in your browser.

### Option 3: Node.js (if installed)
```bash
npx http-server
```
Then open the URL shown in the terminal (usually http://localhost:8080/index.html).

### Option 4: VS Code Live Server
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Question Format

Questions are stored in `questions.json` with the following format:
```json
{
    "category": "Books",
    "question": "Your question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "A"
}
```