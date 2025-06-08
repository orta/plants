# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `yarn dev` - Start development server with Vite
- `yarn build` - Build for production (runs TypeScript compilation then Vite build)
- `yarn preview` - Preview production build

## Project Architecture

This is a Vite-based TypeScript project using a non-React JSX setup with tsx-dom. Key characteristics:

- **JSX without React**: Uses tsx-dom library for JSX compilation instead of React
- **Custom JSX configuration**: JSX factory is set to `h` and fragment to `Fragment` in vite.config.ts
- **TypeScript configuration**: Configured for bundler mode with strict type checking
- **JSX import source**: Set to "tsx-dom" in tsconfig.json

The main entry point is `src/main.tsx` which creates JSX elements and appends them directly to the DOM using `document.getElementById("app")`.