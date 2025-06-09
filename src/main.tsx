// Names for leaf anatomy: https://www.sciencefacts.net/parts-of-a-leaf.html
// Style inspiration: https://www.youtube.com/watch?v=3tKo1kqMfJY
// Drawing pencil-like lines: https://heredragonsabound.blogspot.com/2020/02/creating-pencil-effect-in-svg.html

import { render } from "preact";
import { useState } from "preact/hooks";
import { DrawLineDefs } from "./DrawLine";
import { DrawPot } from "./DrawPot";
import { App } from "./UI";
import { SeededRandom } from "./SeededRandom";

export type Genome = [
  stems: 1 | 2 | 3 | 4,
  leafsPerStem: 1 | 2 | 3 | 4,
  petioles: 1 | 2 | 3,
  flags1: number
];

const FlagOne = {
  /** E.g. is there */
  Flowers: 1 << 0,
};

export const hasFlagOne = (flags: number, flag: keyof typeof FlagOne) =>
  (flags & FlagOne[flag]) !== 0;

export type Input = {
  time: 1 | 2 | 3 | 4;
};

// Growth stage documentation
export type GrowthStage = {
  id: 1 | 2 | 3 | 4;
  name: string;
  description: string;
  characteristics: string[];
};

export const GROWTH_STAGES: GrowthStage[] = [
  {
    id: 1,
    name: "Seedling",
    description: "Initial sprouting phase with minimal foliage",
    characteristics: [
      "Small stem height",
      "Minimal leaf development",
      "Focus on root establishment",
    ],
  },
  {
    id: 2,
    name: "Young Plant",
    description: "Active vegetative growth with developing structure",
    characteristics: [
      "Moderate stem elongation",
      "Leaf expansion",
      "Branch formation",
    ],
  },
  {
    id: 3,
    name: "Mature Plant",
    description: "Full vegetative development with established structure",
    characteristics: [
      "Maximum foliage",
      "Strong stem structure",
      "Optimal photosynthetic capacity",
    ],
  },
  {
    id: 4,
    name: "Flowering",
    description: "Reproductive phase with flower development",
    characteristics: [
      "Flower production",
      "Reproductive maturity",
      "Energy allocation to reproduction",
    ],
  },
];

// Simple state management
export type AppState = {
  stems: 1 | 2 | 3 | 4;
  leafsPerStem: 1 | 2 | 3 | 4;
  petioles: 1 | 2 | 3;
  selectedStage: 1 | 2 | 3 | 4;
};

interface LeafProps {
  x: number;
  y: number;
  size: number;
  random: SeededRandom;
}

const generateLeaf = ({ x, y, size, random }: LeafProps) => {
  // Add slight randomness for hand-drawn effect
  const wobble = (value: number) => random.wobble(value, 2);

  const leafPath = `M ${wobble(x)} ${wobble(y)} Q ${wobble(
    x - size / 2
  )} ${wobble(y - size)} ${wobble(x)} ${wobble(y - size * 1.5)} Q ${wobble(
    x + size / 2
  )} ${wobble(y - size)} ${wobble(x)} ${wobble(y)}`;

  return (
    <path
      d={leafPath}
      style={{
        fill: "#e8f5e9",
        stroke: "#2d2d2d",
        strokeWidth: "1",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        filter: "url(#roughPaper)",
      }}
    />
  );
};

interface StemProps {
  startX: number;
  startY: number;
  height: number;
  leafCount: number;
  leafSize: number;
  random: SeededRandom;
}

const generateStem = ({
  startX,
  startY,
  height,
  leafCount,
  leafSize,
  random,
}: StemProps) => {
  const elements = [];

  // Create a slightly curved stem for more organic look
  const wobbleAmount = 3;
  const midX = startX + (random.next() - 0.5) * wobbleAmount;
  const stemPath = `M ${startX} ${startY} Q ${midX} ${startY - height / 2} ${
    startX + (random.next() - 0.5) * 2
  } ${startY - height}`;

  elements.push(
    <path
      d={stemPath}
      style={{
        fill: "none",
        stroke: "#16a34a",
        strokeWidth: "2",
        strokeLinecap: "round",
        filter: "url(#roughPaper)",
      }}
    />
  );

  // Add leaves along the stem
  for (let i = 0; i < leafCount; i++) {
    const leafY = startY - (height * (i + 1)) / (leafCount + 1);
    const side = i % 2 === 0 ? -1 : 1;
    const leafX = startX + side * 15;
    elements.push(generateLeaf({ x: leafX, y: leafY, size: leafSize, random }));
  }

  return elements;
};

interface PlantSVGProps {
  genome: Genome;
  input: Input;
  random: SeededRandom;
}

export const GenerateSVG = ({ genome, input, random }: PlantSVGProps) => {
  const [stems, leafsPerStem, _petioles] = genome;
  const { time } = input;

  // Growth scaling based on time stage
  const growthScale = time * 0.25;
  const baseHeight = 100 * growthScale;
  const leafSize = 15 * growthScale;

  const svgElements = [];
  const svgWidth = 300;
  const svgHeight = 300;

  // Pot dimensions
  const potWidth = 100 + stems * 20; // Scale pot width based on number of stems
  const potHeight = 60;
  const potX = svgWidth / 2;
  const potY = svgHeight - 80;

  // Add pot to elements
  svgElements.push(
    <DrawPot
      x={potX}
      y={potY}
      width={potWidth}
      height={potHeight}
      style="tapered"
      random={random}
    />
  );

  // Generate stems starting from pot rim
  for (let stemIndex = 0; stemIndex < stems; stemIndex++) {
    const stemX =
      (stemIndex + 1) * (potWidth / (stems + 1)) + (potX - potWidth / 2);
    const stemY = potY + 5; // Start just inside the pot rim
    const stemHeight = baseHeight + (random.range(-10, 10)); // Small variation

    const stemElements = generateStem({
      startX: stemX,
      startY: stemY,
      height: stemHeight,
      leafCount: leafsPerStem,
      leafSize: leafSize,
      random: random,
    });
    svgElements.push(...stemElements);
  }

  // Add flowers if time stage 4
  if (time === 4) {
    for (let stemIndex = 0; stemIndex < stems; stemIndex++) {
      const stemX =
        (stemIndex + 1) * (potWidth / (stems + 1)) + (potX - potWidth / 2);
      const flowerY = potY + 5 - baseHeight;

      // Simple flower with sketch effect
      svgElements.push(
        <circle
          cx={stemX + (random.next() - 0.5) * 2}
          cy={flowerY + (random.next() - 0.5) * 2}
          r={8}
          style={{
            fill: "#fff8dc",
            stroke: "#2d2d2d",
            strokeWidth: "1",
            filter: "url(#roughPaper)",
          }}
        />
      );
    }
  }

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width={svgWidth + "px"}
      height={svgHeight + "px"}
    >
      <DrawLineDefs />
      {svgElements}
    </svg>
  );
};

// Main App component with hooks
const MainApp = () => {
  const [appState, setAppState] = useState<AppState>({
    stems: 2,
    leafsPerStem: 3,
    petioles: 2,
    selectedStage: 1,
  });

  const setState = (newState: Partial<AppState>) => {
    setAppState((prev) => ({ ...prev, ...newState }));
  };

  return <App state={appState} setState={setState} />;
};

// Initialize the app
const appContainer = document.getElementById("app");
if (appContainer) {
  render(<MainApp />, appContainer);
}
