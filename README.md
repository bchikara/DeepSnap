
# DeepSnap - Screenshot Solver with DeepSeek Integration

Welcome to **DeepSnap**! A powerful Chrome extension that captures screenshots and solves problems using the DeepSeek API. It provides a seamless experience for capturing web pages or specific areas, processing images using OCR (Tesseract.js), and solving problems from the captured content.

## Features

- **Dual Screenshot Capture Modes:**
  - **Full Page Capture:** Capture the entire visible page with a single click.
  - **Area Selection Capture:** Select an area on the page to capture and solve.

- **DeepSeek API Integration:** Automatically send screenshots to DeepSeek to get solutions for problems.

- **OCR (Tesseract.js):** Extract text and code from screenshots, enabling intelligent problem-solving.

- **Rich User Interface:**
  - Dark theme UI for a sleek, modern design.
  - Draggable and resizable dialog for result display.
  - Annotation tools for marking up your screenshots.
  - History panel to show the last 10 captured results.
  - Export captured screenshots and results in **PNG** or **JSON** format.

## Technical Stack

- **Build Tools:** Vite, SWC, TypeScript
- **Frontend:** React, Material UI, react-markdown
- **Chrome Extension:** Manifest V3, Service Workers
- **OCR:** Tesseract.js for text extraction
- **API Integration:** DeepSeek API for problem-solving

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bchikara/DeepSnap.git
   ```

2. **Install dependencies:**
   ```bash
   cd DeepSnap
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Load the unpacked extension in Chrome:**
   - Open `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked** and select the `dist` folder

## Usage

1. **Capture Full Page:** Press `Ctrl+Shift+1` (Windows/Linux) or `Cmd+Shift+1` (Mac).
2. **Capture Area:** Press `Ctrl+Shift+2` (Windows/Linux) or `Cmd+Shift+2` (Mac).
3. Processed results will appear in the dialog, ready for review.
4. You can export results in PNG or JSON format.

## Contributing

We welcome contributions to make **DeepSnap** even better! Here's how you can get involved:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature-name`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to your branch (`git push origin feature-name`).
5. Open a Pull Request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

Happy coding and solving problems with **DeepSnap**! 🚀
