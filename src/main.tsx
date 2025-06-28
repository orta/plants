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
  leafType?: 'oval' | 'elongated' | 'heart' | 'compound' | 'spiky';
  angle?: number;
}

const generateLeaf = ({ x, y, size, random, leafType = 'oval', angle = 0 }: LeafProps) => {
  const wobble = (value: number) => random.wobble(value, 1);
  
  // Different leaf shapes based on type
  let leafPath = '';
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  // Helper to rotate point around leaf center
  const rotatePoint = (px: number, py: number) => {
    const dx = px - x;
    const dy = py - y;
    return {
      x: x + (dx * cos - dy * sin),
      y: y + (dx * sin + dy * cos)
    };
  };

  // Generate watercolor wash for leaf
  const generateLeafWatercolor = (leafPath: string) => {
    const colors = ['#a8d5a8', '#b8e6b8', '#c8f0c8', '#95c895', '#88bb88'];
    const color = colors[Math.floor(random.next() * colors.length)];
    
    return (
      <path
        d={leafPath}
        style={{
          fill: color,
          opacity: random.range(0.2, 0.4),
          mixBlendMode: 'multiply',
        }}
      />
    );
  };

  switch (leafType) {
    case 'oval':
      // Classic oval leaf shape
      const p1 = rotatePoint(wobble(x), wobble(y));
      const p2 = rotatePoint(wobble(x - size * 0.6), wobble(y - size * 0.3));
      const p3 = rotatePoint(wobble(x), wobble(y - size * 1.2));
      const p4 = rotatePoint(wobble(x + size * 0.6), wobble(y - size * 0.3));
      leafPath = `M ${p1.x} ${p1.y} Q ${p2.x} ${p2.y} ${p3.x} ${p3.y} Q ${p4.x} ${p4.y} ${p1.x} ${p1.y}`;
      break;
      
    case 'elongated':
      // Long, narrow leaf
      const e1 = rotatePoint(wobble(x), wobble(y));
      const e2 = rotatePoint(wobble(x - size * 0.3), wobble(y - size * 0.4));
      const e3 = rotatePoint(wobble(x), wobble(y - size * 1.8));
      const e4 = rotatePoint(wobble(x + size * 0.3), wobble(y - size * 0.4));
      leafPath = `M ${e1.x} ${e1.y} Q ${e2.x} ${e2.y} ${e3.x} ${e3.y} Q ${e4.x} ${e4.y} ${e1.x} ${e1.y}`;
      break;
      
    case 'heart':
      // Heart-shaped leaf (like pothos)
      const h1 = rotatePoint(wobble(x), wobble(y));
      const h2 = rotatePoint(wobble(x - size * 0.7), wobble(y - size * 0.2));
      const h3 = rotatePoint(wobble(x - size * 0.3), wobble(y - size * 0.8));
      const h4 = rotatePoint(wobble(x), wobble(y - size * 1.1));
      const h5 = rotatePoint(wobble(x + size * 0.3), wobble(y - size * 0.8));
      const h6 = rotatePoint(wobble(x + size * 0.7), wobble(y - size * 0.2));
      leafPath = `M ${h1.x} ${h1.y} Q ${h2.x} ${h2.y} ${h3.x} ${h3.y} Q ${h4.x} ${h4.y} ${h5.x} ${h5.y} Q ${h6.x} ${h6.y} ${h1.x} ${h1.y}`;
      break;
      
    case 'spiky':
      // Spiky/serrated leaf
      const s1 = rotatePoint(wobble(x), wobble(y));
      const s2 = rotatePoint(wobble(x - size * 0.4), wobble(y - size * 0.3));
      const s3 = rotatePoint(wobble(x - size * 0.2), wobble(y - size * 0.6));
      const s4 = rotatePoint(wobble(x - size * 0.3), wobble(y - size * 0.9));
      const s5 = rotatePoint(wobble(x), wobble(y - size * 1.3));
      const s6 = rotatePoint(wobble(x + size * 0.3), wobble(y - size * 0.9));
      const s7 = rotatePoint(wobble(x + size * 0.2), wobble(y - size * 0.6));
      const s8 = rotatePoint(wobble(x + size * 0.4), wobble(y - size * 0.3));
      leafPath = `M ${s1.x} ${s1.y} L ${s2.x} ${s2.y} L ${s3.x} ${s3.y} L ${s4.x} ${s4.y} L ${s5.x} ${s5.y} L ${s6.x} ${s6.y} L ${s7.x} ${s7.y} L ${s8.x} ${s8.y} Z`;
      break;
      
    case 'compound':
      // Simple compound leaf (multiple leaflets)
      return (
        <g>
          {[0, 1, 2].map(i => {
            const leafletY = y - size * 0.4 * i;
            const leafletSize = size * (0.8 - i * 0.1);
            const c1 = rotatePoint(wobble(x), wobble(leafletY));
            const c2 = rotatePoint(wobble(x - leafletSize * 0.4), wobble(leafletY - leafletSize * 0.2));
            const c3 = rotatePoint(wobble(x), wobble(leafletY - leafletSize * 0.6));
            const c4 = rotatePoint(wobble(x + leafletSize * 0.4), wobble(leafletY - leafletSize * 0.2));
            const compoundPath = `M ${c1.x} ${c1.y} Q ${c2.x} ${c2.y} ${c3.x} ${c3.y} Q ${c4.x} ${c4.y} ${c1.x} ${c1.y}`;
            
            return (
              <g key={i}>
                {/* Watercolor base */}
                {generateLeafWatercolor(compoundPath)}
                {/* Black outline */}
                <path
                  d={compoundPath}
                  style={{
                    fill: "none",
                    stroke: "#2d2d2d",
                    strokeWidth: "0.8",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    filter: "url(#roughPaper)",
                  }}
                />
              </g>
            );
          })}
          {/* Stem connecting leaflets */}
          <line
            x1={x}
            y1={y}
            x2={x}
            y2={y - size * 1.2}
            style={{
              stroke: "#2d2d2d",
              strokeWidth: "1",
              strokeLinecap: "round",
            }}
          />
        </g>
      );
  }

  // Add central vein for single leaves
  const veinStart = rotatePoint(x, y - size * 0.1);
  const veinEnd = rotatePoint(x, y - size * (leafType === 'elongated' ? 1.6 : 1.0));

  return (
    <g>
      {/* Watercolor base */}
      {generateLeafWatercolor(leafPath)}
      {/* Black outline */}
      <path
        d={leafPath}
        style={{
          fill: "none",
          stroke: "#2d2d2d",
          strokeWidth: "1",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          filter: "url(#roughPaper)",
        }}
      />
      {/* Central vein */}
      <line
        x1={veinStart.x}
        y1={veinStart.y}
        x2={veinEnd.x}
        y2={veinEnd.y}
        style={{
          stroke: "#2d2d2d",
          strokeWidth: "0.5",
          opacity: "0.6",
        }}
      />
    </g>
  );
};

interface StemProps {
  startX: number;
  startY: number;
  height: number;
  leafCount: number;
  leafSize: number;
  random: SeededRandom;
  plantType?: 'upright' | 'bushy' | 'trailing' | 'spiky';
}

const generateStem = ({
  startX,
  startY,
  height,
  leafCount,
  leafSize,
  random,
  plantType = 'upright',
}: StemProps) => {
  const elements = [];

  // Determine leaf types based on plant type
  const getLeafType = (plantType: string) => {
    switch (plantType) {
      case 'bushy': return random.next() > 0.5 ? 'heart' : 'oval';
      case 'trailing': return 'heart';
      case 'spiky': return random.next() > 0.3 ? 'spiky' : 'elongated';
      case 'upright':
      default: return random.next() > 0.5 ? 'oval' : 'elongated';
    }
  };

  const leafType = getLeafType(plantType);

  if (plantType === 'bushy') {
    // Bushy plants have multiple short stems with clustered leaves
    const branchCount = Math.min(3, leafCount);
    
    for (let branch = 0; branch < branchCount; branch++) {
      const branchAngle = (branch - 1) * 0.5 + random.wobble(0, 0.3);
      const branchLength = height * (0.6 + random.next() * 0.4);
      const endX = startX + Math.sin(branchAngle) * branchLength * 0.7;
      const endY = startY - Math.cos(branchAngle) * branchLength;
      
      // Branch stem
      const midX = startX + Math.sin(branchAngle) * branchLength * 0.35 + random.wobble(0, 3);
      const midY = startY - Math.cos(branchAngle) * branchLength * 0.5;
      const branchPath = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
      
      elements.push(
        <path
          key={`branch-${branch}`}
          d={branchPath}
          style={{
            fill: "none",
            stroke: "#2d2d2d",
            strokeWidth: random.wobble(1.5, 0.5),
            strokeLinecap: "round",
            filter: "url(#roughPaper)",
          }}
        />
      );

      // Cluster leaves at branch ends
      const leavesPerBranch = Math.ceil(leafCount / branchCount);
      for (let i = 0; i < leavesPerBranch; i++) {
        // Calculate branch direction for better leaf orientation
        const branchDirection = Math.atan2(endY - startY, endX - startX);
        const leafAngleBase = branchDirection + random.range(-Math.PI / 3, Math.PI / 3);
        const leafDistance = random.range(8, 18);
        
        const leafX = endX + Math.cos(leafAngleBase) * leafDistance;
        const leafY = endY + Math.sin(leafAngleBase) * leafDistance;
        const leafRotation = leafAngleBase + random.wobble(0, 0.3);
        
        elements.push(
          generateLeaf({ 
            x: leafX, 
            y: leafY, 
            size: leafSize * random.range(1.0, 1.5),
            random, 
            leafType,
            angle: leafRotation
          })
        );
      }
    }
  } else if (plantType === 'trailing') {
    // Trailing plants have drooping, curved stems
    const segments = Math.ceil(height / 30);
    let currentX = startX;
    let currentY = startY;
    
    for (let segment = 0; segment < segments; segment++) {
      const segmentHeight = height / segments;
      const droop = segment * 8; // Increasing droop
      const nextX = currentX + random.wobble(droop, 5);
      const nextY = currentY - segmentHeight + random.wobble(0, 3);
      
      const controlX = currentX + random.wobble(droop * 0.5, 3);
      const controlY = currentY - segmentHeight * 0.5;
      
      const trailPath = `M ${currentX} ${currentY} Q ${controlX} ${controlY} ${nextX} ${nextY}`;
      
      elements.push(
        <path
          key={`trail-${segment}`}
          d={trailPath}
          style={{
            fill: "none",
            stroke: "#2d2d2d",
            strokeWidth: random.wobble(1.2, 0.3),
            strokeLinecap: "round",
            filter: "url(#roughPaper)",
          }}
        />
      );

      // Add leaves along trail
      if (segment < leafCount) {
        // Calculate perpendicular offset from the trail direction
        const trailDirection = Math.atan2(nextX - currentX, currentY - nextY);
        const side = segment % 2 === 0 ? -1 : 1;
        const leafDistance = random.range(8, 15);
        const perpendicular = trailDirection + Math.PI / 2;
        
        const leafX = nextX + Math.cos(perpendicular) * side * leafDistance;
        const leafY = nextY + Math.sin(perpendicular) * side * leafDistance * 0.3; // Slight upward bias
        const leafAngle = trailDirection + side * 0.3 + random.wobble(0, 0.3);
        
        elements.push(
          generateLeaf({ 
            x: leafX, 
            y: leafY, 
            size: leafSize * random.range(1.1, 1.4),
            random, 
            leafType,
            angle: leafAngle
          })
        );
      }
      
      currentX = nextX;
      currentY = nextY;
    }
  } else {
    // Upright and spiky plants - more traditional single stem
    const wobbleAmount = plantType === 'spiky' ? 1 : 3;
    const midX = startX + (random.next() - 0.5) * wobbleAmount;
    const endX = startX + (random.next() - 0.5) * 2;
    const endY = startY - height;
    const stemPath = `M ${startX} ${startY} Q ${midX} ${startY - height / 2} ${endX} ${endY}`;

    elements.push(
      <path
        d={stemPath}
        style={{
          fill: "none",
          stroke: "#2d2d2d",
          strokeWidth: plantType === 'spiky' ? random.wobble(3, 0.5) : random.wobble(2, 0.5),
          strokeLinecap: "round",
          filter: "url(#roughPaper)",
        }}
      />
    );

    // Function to calculate point along quadratic bezier curve
    const getPointOnStem = (t: number) => {
      // Quadratic bezier formula: (1-t)²P0 + 2(1-t)tP1 + t²P2
      const oneMinusT = 1 - t;
      const x = oneMinusT * oneMinusT * startX + 
                2 * oneMinusT * t * midX + 
                t * t * endX;
      const y = oneMinusT * oneMinusT * startY + 
                2 * oneMinusT * t * (startY - height / 2) + 
                t * t * endY;
      return { x, y };
    };

    // Function to calculate stem direction at point t
    const getStemDirection = (t: number) => {
      // Derivative of quadratic bezier for direction
      const dx = 2 * (1 - t) * (midX - startX) + 2 * t * (endX - midX);
      const dy = 2 * (1 - t) * ((startY - height / 2) - startY) + 2 * t * (endY - (startY - height / 2));
      return Math.atan2(dy, dx);
    };

    // Add leaves along the stem with more natural spacing
    for (let i = 0; i < leafCount; i++) {
      let stemT, leafX, leafY, leafAngle;
      
      if (plantType === 'spiky') {
        // Spiky plants have more structured leaf arrangement
        stemT = (i + 1) / (leafCount + 1);
        const stemPoint = getPointOnStem(stemT);
        const side = i % 2 === 0 ? -1 : 1;
        const stemDirection = getStemDirection(stemT);
        const perpendicular = stemDirection + Math.PI / 2;
        const leafDistance = random.range(10, 20);
        
        leafX = stemPoint.x + Math.cos(perpendicular) * side * leafDistance;
        leafY = stemPoint.y + Math.sin(perpendicular) * side * leafDistance * 0.3; // Slight upward bias
        leafAngle = side * 0.3 + random.wobble(0, 0.2);
      } else {
        // More organic spacing for other types
        stemT = 0.2 + (i * 0.7) / leafCount + random.wobble(0, 0.1);
        stemT = Math.max(0.05, Math.min(0.95, stemT)); // Keep within bounds
        const stemPoint = getPointOnStem(stemT);
        const side = i % 2 === 0 ? -1 : 1;
        const stemDirection = getStemDirection(stemT);
        const perpendicular = stemDirection + Math.PI / 2;
        const leafDistance = random.range(12, 25);
        
        leafX = stemPoint.x + Math.cos(perpendicular) * side * leafDistance;
        leafY = stemPoint.y + Math.sin(perpendicular) * side * leafDistance * 0.2; // Slight upward bias
        leafAngle = side * 0.4 + random.wobble(0, 0.4);
      }
      
      elements.push(
        generateLeaf({ 
          x: leafX, 
          y: leafY, 
          size: leafSize * random.range(1.0, 1.6),
          random, 
          leafType,
          angle: leafAngle
        })
      );
    }
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
  const leafSize = 25 * growthScale; // Increased from 15 to 25

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

  // Determine plant types based on genome
  const getPlantType = (stemIndex: number) => {
    const typeValue = (stemIndex + stems + leafsPerStem) % 4;
    switch (typeValue) {
      case 0: return 'upright';
      case 1: return 'bushy';
      case 2: return 'trailing';
      case 3: return 'spiky';
      default: return 'upright';
    }
  };

  // Generate stems starting from pot rim
  for (let stemIndex = 0; stemIndex < stems; stemIndex++) {
    const stemX =
      (stemIndex + 1) * (potWidth / (stems + 1)) + (potX - potWidth / 2);
    const stemY = potY + 5; // Start just inside the pot rim
    const stemHeight = baseHeight + (random.range(-10, 10)); // Small variation
    const plantType = getPlantType(stemIndex);

    const stemElements = generateStem({
      startX: stemX,
      startY: stemY,
      height: stemHeight,
      leafCount: leafsPerStem,
      leafSize: leafSize,
      random: random,
      plantType: plantType,
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
            fill: "none",
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
