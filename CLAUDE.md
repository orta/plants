# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `yarn dev` - Start development server with Vite. Do not run this, I will run it.
- `yarn build` - Build for production (runs TypeScript compilation then Vite build)
- `yarn preview` - Preview production build

## Seeded Random System

The project uses a seeded random number generator (`src/SeededRandom.ts`) for consistent, reproducible plant and pot generation:

- **SeededRandom class**: Linear Congruential Generator for deterministic randomness
- **Consistent results**: Same seed always produces identical output
- **Per-component seeding**: Each plant/pot gets unique seed based on configuration
- **Hand-drawn aesthetic**: Maintains organic, sketchy appearance while being reproducible

All random variations use the seeded system instead of `Math.random()` to ensure plants look the same across renders.

## Components

### Plant Generation (`src/main.tsx`)

- **GenerateSVG**: Main plant generation component
- **Genome system**: 4-tuple defining plant characteristics [stems, leavesPerStem, petioles, flags]
- **Growth stages**: 4 development phases (Seedling, Young, Mature, Flowering)
- **Seeded rendering**: Each configuration gets consistent appearance

### Pot Rendering (`src/DrawPot.tsx`)

- **Organic drawing**: Multiple overlapping line segments instead of single paths
- **Hand-drawn effect**: Jagged lines, sketch marks, variable stroke weights
- **Pot styles**: 'round', 'tapered', 'square', 'bowl'
- **Seeded variations**: Consistent wobble and construction marks

### UI Components (`src/UI.tsx`)

- **Main App**: Interactive timeline and controls
- **DevShowcase**: Development view showing all plant/pot combinations
- **Timeline**: Growth stage comparison
- **Controls**: Plant configuration sliders

### Drawing System (`src/DrawLine.tsx`)

- **SVG filters**: Rough paper texture effects
- **Line definitions**: Shared SVG defs for consistent styling

## Development Features

### Dev Showcase Mode

Access via "Dev Showcase" button in main app to view:

- All pot styles individually
- Many plant configurations
- All 4 growth stages with descriptions
- Pot & plant combinations

Useful for design iteration and seeing all available variations at once.

## Design Principles

### Hand-Drawn Aesthetic

- No perfectly straight lines or clean curves
- Multiple overlapping segments for organic feel
- Random sketch marks and construction lines
- Variable line weights and opacities
- Cross-hatching style shading

### No Background Elements

- Never draw background patterns or textures
- Keep sketch marks as part of objects themselves
- Focus on object-specific details and variations
