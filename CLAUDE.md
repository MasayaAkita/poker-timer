# CLAUDE.md
必ず日本語で回答してください。
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a poker timer web application built with vanilla HTML, CSS, and JavaScript. It's designed to manage poker tournament blind levels and timing, featuring both preset blind structures and custom configuration options.

## Architecture

- **Frontend-only application**: Pure client-side web app with no backend dependencies
- **Core files**:
  - `index.html`: Main application structure with dual-pane layout (timer + settings)
  - `script.js`: All application logic including timer management, blind progression, and settings
  - `styles.css`: Complete styling with responsive design and custom fonts
  - `Dockerfile`: Simple nginx-based containerization for deployment

## Key Features

- **Dual-mode operation**: Default preset blind levels vs. custom user-defined settings
- **Timer management**: Start/stop/reset functionality with level progression
- **Blind structure**: Configurable BB/SB/Ante with automatic progression
- **Responsive design**: Mobile-first with breakpoints at 900px and 600px

## Development Commands

Since this is a static web application, there are no build commands or package management tools. Development is straightforward:

- **Local development**: Open `index.html` directly in browser or serve via local HTTP server
- **Docker deployment**: `docker build -t poker-timer .` and `docker run -p 8080:80 poker-timer`

## Code Structure

The application uses a functional programming approach with:
- **State management**: Global variables for timer state, blind levels, and mode tracking
- **Event handling**: Direct DOM event listeners for user interactions
- **Timer logic**: `setInterval`-based countdown with automatic level progression
- **Blind progression**: Array-based preset levels with fallback doubling logic

## Styling Notes

- **Custom font**: Uses MADENZ.ttf loaded via @font-face
- **Color scheme**: Teal/cyan theme (#017165, #38dcd5, #a0f0f0)
- **Layout**: Flexbox-based responsive design with side-by-side panels
- **Typography**: Responsive font sizes using clamp() for scalability

## Important Implementation Details

- The app operates in two modes: default preset blind levels and custom user settings
- Timer automatically advances to next level when countdown reaches zero
- Blind values follow either preset progression or doubling logic in custom mode
- All UI updates happen through direct DOM manipulation
- Application state is entirely client-side with no persistence