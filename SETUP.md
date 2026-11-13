# BrightBoard — Free AI Whiteboard Tutor

An original, tablet-first learning app inspired by visual AI tutoring workflows. It does not use Solvely's branding or assets.

## What works in this project

- Responsive React/TypeScript dashboard and tablet/mobile layouts.
- Interactive whiteboard with touch drawing, ink colour, zoom, step navigation and fullscreen.
- Spoken narration using the browser SpeechSynthesis API; speed control and stop/replay.
- Browser speech recognition where supported (typically Chrome; requires microphone permission).
- Local lesson persistence with IndexedDB; reopen, continue and delete lessons.
- PDF text extraction, DOCX text extraction and TXT import; extracted text is passed as context to the tutor.
- Lesson print-to-PDF export.
- Checkpoint UI when the connected model returns a checkpoint.
- Explicit AI connection status and a server-side AI gateway. No fake generated tutor content is presented as real AI.
- PWA manifest and service worker for installability/offline app shell.

## Important honest limitations

- The browser app itself is free and has no ads, subscriptions or paywalls. Hosting, internet access and any third-party model/API may have separate costs. A truly free hosted AI API cannot be guaranteed permanently.
- For genuinely free AI, run Ollama on a computer on the same Wi-Fi network as the tablet. Ollama generally cannot run directly on most Android tablets. Set `OLLAMA_URL` to that computer's LAN address and keep the gateway on that computer.
- PPTX, legacy DOC, and image OCR are accepted by the picker but not fully parsed in this starter. For reliable slide extraction, export PowerPoint to PDF first. Add Tesseract.js and a PPTX parser to extend these paths.
- Mermaid diagrams are displayed as source text in this first build; full SVG rendering can be added with Mermaid's render API.
- The lesson narration is read aloud on demand; fully synchronized animated handwriting/audio timing needs a dedicated timeline engine and is not claimed as complete here.
- Offline mode caches the app shell. AI generation requires a reachable gateway/model.

## Run locally

1. Install Node.js 20 or newer.
2. Unzip the project and open a terminal in this folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env` and adjust settings if needed.
5. Run `npm run dev` in one terminal.
6. Run `npm run server` in another terminal.
7. Open `http://localhost:5173`.

## Connect free local AI with Ollama

1. Install Ollama on a computer (not usually on the Android tablet) from https://ollama.com.
2. Download a model, for example `ollama pull llama3.2`.
3. Start Ollama and make it reachable from your local network. Configure its host/origin policy according to Ollama's current documentation; do not expose it directly to the public internet.
4. Set `OLLAMA_URL=http://127.0.0.1:11434` if the gateway runs on the same computer as Ollama. If different, use the Ollama computer's LAN IP.
5. Run the gateway on the same computer as Ollama. Set `ALLOWED_ORIGIN` to the tablet-accessible web app origin.
6. Set `VITE_AI_GATEWAY=http://<gateway-computer-LAN-IP>:8787` in a `.env` file before building/running the frontend. Restart Vite after changing it.
7. On the tablet, open the Vite host URL on the same Wi-Fi. Use Chrome's menu → Add to Home screen / Install app.

## Optional hosted compatible API

Set `AI_PROVIDER=openai-compatible`, `AI_BASE_URL`, `AI_MODEL` and `AI_API_KEY` in the server environment only. Never put secret keys in `VITE_*` variables or browser code. This option may not be free; check the provider's current pricing and limits.

## Security and privacy

Lesson data is stored in the browser's IndexedDB on the device. Uploaded extracted text is sent to the AI gateway only when requesting an explanation. Use a trusted private network for local hosting. Add authentication and HTTPS before exposing the gateway beyond a trusted LAN.
