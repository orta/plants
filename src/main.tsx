// Names for leaf anatomy: https://www.sciencefacts.net/parts-of-a-leaf.html

import { render } from "./svgJSX";
import { App } from "./UI";

declare global {
  namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

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

let appState: AppState = {
  stems: 2,
  leafsPerStem: 3,
  petioles: 2,
  selectedStage: 1,
};

let appContainer: HTMLElement | null = null;

const setState = (newState: Partial<AppState>) => {
  appState = { ...appState, ...newState };
  renderApp();
};

interface LeafProps {
  x: number;
  y: number;
  size: number;
}

const generateLeaf = ({ x, y, size }: LeafProps): JSX.Element => {
  const leafPath = `M ${x} ${y} Q ${x - size / 2} ${y - size} ${x} ${
    y - size * 1.5
  } Q ${x + size / 2} ${y - size} ${x} ${y}`;
  return (
    <path
      d={leafPath}
      style={{ fill: "#4ade80", stroke: "#16a34a", strokeWidth: "1" }}
    />
  );
};

interface StemProps {
  startX: number;
  startY: number;
  height: number;
  leafCount: number;
  leafSize: number;
}

const generateStem = ({
  startX,
  startY,
  height,
  leafCount,
  leafSize,
}: StemProps): JSX.Element[] => {
  const elements: JSX.Element[] = [];

  // Stem line
  elements.push(
    <line
      x1={startX}
      y1={startY}
      x2={startX}
      y2={startY - height}
      style={{ stroke: "#16a34a", strokeWidth: "3" }}
    />
  );

  // Add leaves along the stem
  for (let i = 0; i < leafCount; i++) {
    const leafY = startY - (height * (i + 1)) / (leafCount + 1);
    const side = i % 2 === 0 ? -1 : 1;
    const leafX = startX + side * 15;
    elements.push(generateLeaf({ x: leafX, y: leafY, size: leafSize }));
  }

  return elements;
};

interface PlantSVGProps {
  genome: Genome;
  input: Input;
}

export const GenerateSVG = ({ genome, input }: PlantSVGProps): JSX.Element => {
  const [stems, leafsPerStem, _petioles] = genome;
  const { time } = input;

  // Growth scaling based on time stage
  const growthScale = time * 0.25;
  const baseHeight = 100 * growthScale;
  const leafSize = 15 * growthScale;

  const svgElements: JSX.Element[] = [];
  const svgWidth = stems * 80;
  const svgHeight = 200;

  // Generate stems
  for (let stemIndex = 0; stemIndex < stems; stemIndex++) {
    const stemX = (stemIndex + 1) * (svgWidth / (stems + 1));
    const stemY = svgHeight - 20;
    const stemHeight = baseHeight + (Math.random() * 20 - 10); // Small variation

    const stemElements = generateStem({
      startX: stemX,
      startY: stemY,
      height: stemHeight,
      leafCount: leafsPerStem,
      leafSize: leafSize,
    });
    svgElements.push(...stemElements);
  }

  // Add flowers if time stage 4
  if (time === 4) {
    for (let stemIndex = 0; stemIndex < stems; stemIndex++) {
      const stemX = (stemIndex + 1) * (svgWidth / (stems + 1));
      const flowerY = svgHeight - 20 - baseHeight;

      // Simple flower
      svgElements.push(
        <circle
          cx={stemX}
          cy={flowerY}
          r={8}
          style={{ fill: "#f59e0b", stroke: "#d97706", strokeWidth: "1" }}
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
      {svgElements}
    </svg>
  );
};

const renderApp = () => {
  if (!appContainer) return;

  appContainer.innerHTML = "";
  const appElement = render(<App state={appState} setState={setState} />);
  if (appElement) {
    appContainer.appendChild(appElement);
  }
};

// Initialize the app
appContainer = document.getElementById("app");
renderApp();
