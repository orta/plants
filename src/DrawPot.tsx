import { SeededRandom } from "./SeededRandom";

interface PotProps {
  x: number;
  y: number;
  width: number;
  height: number;
  style?: "round" | "round-concave" | "tapered" | "square" | "bowl";
  random: SeededRandom;
}

export const DrawPot = ({
  x,
  y,
  width,
  height,
  style = "tapered",
  random,
}: PotProps) => {
  // Helper to add random variations for hand-drawn effect
  const wobble = (value: number, amount: number = 2) => {
    return random.wobble(value, amount);
  };

  // Helper to create jagged points along a line
  const createJaggedPoints = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    segments: number = 5
  ) => {
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const jaggedX = wobble(startX + (endX - startX) * t, 2);
      const jaggedY = wobble(startY + (endY - startY) * t, 1.5);
      points.push({ x: jaggedX, y: jaggedY });
    }
    return points;
  };

  // Generate multiple overlapping pot segments
  const generatePotSegments = () => {
    // Adjust dimensions based on pot style for better differentiation
    let rimWidth = width;
    let baseWidth = width;
    let potHeight = height;

    switch (style) {
      case "tapered":
        baseWidth = width * 0.6; // More dramatic taper
        break;
      case "round":
        // Simple circular pot - same width top and bottom
        baseWidth = width * 0.9;
        break;
      case "round-concave":
        // Bulging middle for concave round pots
        baseWidth = width * 0.85;
        break;
      case "square":
        // Minimal taper for square pots
        baseWidth = width * 0.95;
        break;
      case "bowl":
        // Very wide rim, narrow base
        rimWidth = width * 1.2;
        baseWidth = width * 0.5;
        potHeight = height * 0.8; // Shorter
        break;
    }

    const segments = [];

    // Segment 1: Top rim area
    const rimPoints = createJaggedPoints(
      x - rimWidth / 2,
      y,
      x + rimWidth / 2,
      y,
      6
    );

    let rimPath = `M ${rimPoints[0].x} ${rimPoints[0].y}`;
    for (let i = 1; i < rimPoints.length; i++) {
      rimPath += ` L ${rimPoints[i].x} ${rimPoints[i].y}`;
    }

    segments.push({
      d: rimPath,
      strokeWidth: wobble(1.5, 0.3),
    });

    // Segment 2: Left side (multiple overlapping lines)
    for (let j = 0; j < 2; j++) {
      let leftPoints;

      if (style === "round") {
        // Create simple circular sides for round pots
        leftPoints = [];
        for (let i = 0; i <= 8; i++) {
          const t = i / 8;
          // Use a gentle curved side that maintains circular shape
          const curve = Math.sin(t * Math.PI) * width * 0.05; // Subtle outward curve
          const currWidth = rimWidth + (baseWidth - rimWidth) * t + curve;
          leftPoints.push({
            x: wobble(x - currWidth / 2, 1),
            y: wobble(y + t * potHeight, 1),
          });
        }
      } else if (style === "round-concave") {
        // Create bulging curve for concave round pots
        leftPoints = [];
        for (let i = 0; i <= 8; i++) {
          const t = i / 8;
          const bulge = Math.sin(t * Math.PI) * width * 0.1; // Bulge effect
          const currWidth = rimWidth + (baseWidth - rimWidth) * t - bulge;
          leftPoints.push({
            x: wobble(x - currWidth / 2, 1),
            y: wobble(y + t * potHeight, 1),
          });
        }
      } else if (style === "bowl") {
        // Create curved bowl shape
        leftPoints = [];
        for (let i = 0; i <= 8; i++) {
          const t = i / 8;
          const curve = Math.pow(t, 1.5); // Accelerating curve
          const currWidth = rimWidth + (baseWidth - rimWidth) * curve;
          leftPoints.push({
            x: wobble(x - currWidth / 2, 1),
            y: wobble(y + t * potHeight, 1),
          });
        }
      } else {
        // Standard straight lines for tapered and square
        leftPoints = createJaggedPoints(
          wobble(x - rimWidth / 2, 1),
          wobble(y, 1),
          wobble(x - baseWidth / 2, 2),
          wobble(y + potHeight, 1),
          8
        );
      }

      let leftPath = `M ${leftPoints[0].x} ${leftPoints[0].y}`;
      for (let i = 1; i < leftPoints.length; i++) {
        leftPath += ` L ${leftPoints[i].x} ${leftPoints[i].y}`;
      }

      segments.push({
        d: leftPath,
        strokeWidth: wobble(1.2, 0.4),
        opacity: j === 0 ? 1 : 0.6,
      });
    }

    // Segment 3: Right side (multiple overlapping lines)
    for (let j = 0; j < 2; j++) {
      let rightPoints;

      if (style === "round") {
        // Create simple circular sides for round pots
        rightPoints = [];
        for (let i = 0; i <= 8; i++) {
          const t = i / 8;
          // Use a gentle curved side that maintains circular shape
          const curve = Math.sin(t * Math.PI) * width * 0.05; // Subtle outward curve
          const currWidth = rimWidth + (baseWidth - rimWidth) * t + curve;
          rightPoints.push({
            x: wobble(x + currWidth / 2, 1),
            y: wobble(y + t * potHeight, 1),
          });
        }
      } else if (style === "round-concave") {
        // Create bulging curve for concave round pots
        rightPoints = [];
        for (let i = 0; i <= 8; i++) {
          const t = i / 8;
          const bulge = Math.sin(t * Math.PI) * width * 0.1; // Bulge effect
          const currWidth = rimWidth + (baseWidth - rimWidth) * t - bulge;
          rightPoints.push({
            x: wobble(x + currWidth / 2, 1),
            y: wobble(y + t * potHeight, 1),
          });
        }
      } else if (style === "bowl") {
        // Create curved bowl shape
        rightPoints = [];
        for (let i = 0; i <= 8; i++) {
          const t = i / 8;
          const curve = Math.pow(t, 1.5); // Accelerating curve
          const currWidth = rimWidth + (baseWidth - rimWidth) * curve;
          rightPoints.push({
            x: wobble(x + currWidth / 2, 1),
            y: wobble(y + t * potHeight, 1),
          });
        }
      } else {
        // Standard straight lines for tapered and square
        rightPoints = createJaggedPoints(
          wobble(x + rimWidth / 2, 1),
          wobble(y, 1),
          wobble(x + baseWidth / 2, 2),
          wobble(y + potHeight, 1),
          8
        );
      }

      let rightPath = `M ${rightPoints[0].x} ${rightPoints[0].y}`;
      for (let i = 1; i < rightPoints.length; i++) {
        rightPath += ` L ${rightPoints[i].x} ${rightPoints[i].y}`;
      }

      segments.push({
        d: rightPath,
        strokeWidth: wobble(1.2, 0.4),
        opacity: j === 0 ? 1 : 0.6,
      });
    }

    // Segment 4: Bottom (multiple overlapping lines)
    for (let j = 0; j < 2; j++) {
      const bottomPoints = createJaggedPoints(
        wobble(x - baseWidth / 2, 1),
        wobble(y + potHeight, 1),
        wobble(x + baseWidth / 2, 1),
        wobble(y + potHeight, 1),
        6
      );

      let bottomPath = `M ${bottomPoints[0].x} ${bottomPoints[0].y}`;
      for (let i = 1; i < bottomPoints.length; i++) {
        bottomPath += ` L ${bottomPoints[i].x} ${bottomPoints[i].y}`;
      }

      segments.push({
        d: bottomPath,
        strokeWidth: wobble(1.3, 0.3),
        opacity: j === 0 ? 1 : 0.5,
      });
    }

    // Add distinctive style-specific details
    if (style === "square") {
      // Add corner emphasis for square pots
      const cornerSize = 5;
      // Top-left corner
      segments.push({
        d: `M ${x - rimWidth / 2 - 1} ${y + cornerSize} L ${
          x - rimWidth / 2
        } ${y} L ${x - rimWidth / 2 + cornerSize} ${y - 1}`,
        strokeWidth: wobble(1.5, 0.2),
        opacity: 0.6,
      });
      // Top-right corner
      segments.push({
        d: `M ${x + rimWidth / 2 - cornerSize} ${y - 1} L ${
          x + rimWidth / 2
        } ${y} L ${x + rimWidth / 2 + 1} ${y + cornerSize}`,
        strokeWidth: wobble(1.5, 0.2),
        opacity: 0.6,
      });
    } else if (style === "bowl") {
      // Add decorative rim band for bowls
      const bandY = y + 5;
      segments.push({
        d: `M ${x - rimWidth / 2 + 5} ${bandY} L ${
          x + rimWidth / 2 - 5
        } ${bandY}`,
        strokeWidth: wobble(2.5, 0.4),
        opacity: 0.3,
      });
    }

    return segments;
  };

  // Generate construction/sketch marks
  const generateSketchMarks = () => {
    const marks = [];

    // Random construction lines that look like planning marks
    for (let i = 0; i < 6; i++) {
      const markX = wobble(x + (random.next() - 0.5) * width * 0.8, 3);
      const markY = wobble(y + random.next() * height, 3);
      const markLength = wobble(8, 4);
      const angle =
        wobble(Math.PI / 4, Math.PI / 8) +
        (random.next() > 0.5 ? Math.PI / 2 : 0);

      marks.push(
        <line
          key={`sketch-${i}`}
          x1={markX}
          y1={markY}
          x2={markX + Math.cos(angle) * markLength}
          y2={markY + Math.sin(angle) * markLength}
          style={{
            stroke: "#2d2d2d",
            strokeWidth: wobble(0.4, 0.2),
            opacity: wobble(0.15, 0.05),
          }}
        />
      );
    }

    // Texture lines that look more hand-drawn
    for (let i = 0; i < 4; i++) {
      const lineY = y + height * 0.25 + i * height * 0.18;
      const points = createJaggedPoints(
        x - width * 0.35,
        lineY,
        x + width * 0.35,
        lineY,
        wobble(4, 1)
      );

      let path = `M ${points[0].x} ${points[0].y}`;
      for (let j = 1; j < points.length; j++) {
        path += ` L ${points[j].x} ${points[j].y}`;
      }

      marks.push(
        <path
          key={`texture-${i}`}
          d={path}
          style={{
            fill: "none",
            stroke: "#2d2d2d",
            strokeWidth: wobble(0.5, 0.2),
            opacity: wobble(0.25, 0.1),
          }}
        />
      );
    }

    return marks;
  };

  // Generate organic shading marks
  const generateShading = () => {
    const shadingLines = [];

    // Cross-hatching style shading with irregular marks
    for (let i = 0; i < 12; i++) {
      const startX = wobble(x - width * 0.25 + random.next() * width * 0.4, 2);
      const startY = wobble(y + height * 0.3 + random.next() * height * 0.5, 2);
      const length = wobble(6, 3);
      const angle = wobble(Math.PI / 4, Math.PI / 6);

      shadingLines.push(
        <line
          key={`shade-${i}`}
          x1={startX}
          y1={startY}
          x2={startX + Math.cos(angle) * length}
          y2={startY + Math.sin(angle) * length}
          style={{
            stroke: "#2d2d2d",
            strokeWidth: wobble(0.3, 0.1),
            opacity: wobble(0.15, 0.05),
          }}
        />
      );
    }

    return shadingLines;
  };

  // Generate watercolor-style shading shapes
  const generateWatercolorShading = () => {
    const watercolorShapes = [];

    // Base pot color wash
    const baseWash = generateBaseWash();
    if (baseWash) {
      watercolorShapes.push(baseWash);
    }

    // Shadow/depth shading for square pots (and other styles)
    if (style === "square" || style === "tapered") {
      const rimShading = generateRimShading();
      watercolorShapes.push(...rimShading);
    }

    // Subtle color variations
    const colorVariations = generateColorVariations();
    watercolorShapes.push(...colorVariations);

    return watercolorShapes;
  };

  // Create organic base wash
  const generateBaseWash = () => {
    const rimWidth = width;
    const baseWidth = style === "tapered" ? width * 0.7 : width * 0.85;

    // Create an organic shape that roughly follows the pot outline
    const washPoints = [];

    // Top edge (slightly inside rim)
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const washX = x - rimWidth * 0.45 + t * rimWidth * 0.9;
      const washY = y + random.wobble(8, 3);
      washPoints.push({ x: washX, y: washY });
    }

    // Right side
    for (let i = 1; i <= 6; i++) {
      const t = i / 6;
      const sideWidth =
        rimWidth * 0.45 + t * (baseWidth * 0.45 - rimWidth * 0.45);
      const washX = x + sideWidth + random.wobble(0, 4);
      const washY = y + t * height * 0.85 + random.wobble(0, 3);
      washPoints.push({ x: washX, y: washY });
    }

    // Bottom edge
    for (let i = 7; i >= 0; i--) {
      const t = i / 8;
      const washX = x - baseWidth * 0.4 + t * baseWidth * 0.8;
      const washY = y + height * 0.85 + random.wobble(0, 3);
      washPoints.push({ x: washX, y: washY });
    }

    // Left side
    for (let i = 5; i >= 1; i--) {
      const t = i / 6;
      const sideWidth =
        rimWidth * 0.45 + t * (baseWidth * 0.45 - rimWidth * 0.45);
      const washX = x - sideWidth + random.wobble(0, 4);
      const washY = y + t * height * 0.85 + random.wobble(0, 3);
      washPoints.push({ x: washX, y: washY });
    }

    // Create smooth path through points
    if (washPoints.length < 4) return null;

    let washPath = `M ${washPoints[0].x} ${washPoints[0].y}`;
    for (let i = 1; i < washPoints.length; i++) {
      const curr = washPoints[i];
      const next = washPoints[(i + 1) % washPoints.length];
      const midX = (curr.x + next.x) / 2;
      const midY = (curr.y + next.y) / 2;
      washPath += ` Q ${curr.x} ${curr.y} ${midX} ${midY}`;
    }
    washPath += " Z";

    return (
      <path
        key="base-wash"
        d={washPath}
        style={{
          fill: "#d4c5b0",
          opacity: 0.15,
          mixBlendMode: "multiply",
        }}
      />
    );
  };

  // Generate rim and depth shading
  const generateRimShading = () => {
    const shapes = [];

    if (style === "square") {
      // Top rim shadow (showing the rim edge)
      const rimShadowPoints = createJaggedPoints(
        x - width * 0.4,
        y + 2,
        x + width * 0.4,
        y + 8,
        6
      );

      let rimPath = `M ${rimShadowPoints[0].x} ${rimShadowPoints[0].y}`;
      for (let i = 1; i < rimShadowPoints.length; i++) {
        rimPath += ` L ${rimShadowPoints[i].x} ${rimShadowPoints[i].y}`;
      }

      // Close the rim shadow shape
      rimPath += ` L ${x + width * 0.4} ${y + 2} L ${x - width * 0.4} ${
        y + 2
      } Z`;

      shapes.push(
        <path
          key="rim-shadow"
          d={rimPath}
          style={{
            fill: "#8b7355",
            opacity: 0.2,
            mixBlendMode: "multiply",
          }}
        />
      );

      // Right side depth shadow
      const rightShadowPoints = createJaggedPoints(
        x + width * 0.35,
        y + 5,
        x + width * 0.25,
        y + height * 0.9,
        5
      );

      let rightShadowPath = `M ${x + width * 0.45} ${y}`;
      rightShadowPath += ` L ${x + width * 0.45} ${y + height}`;
      for (let i = rightShadowPoints.length - 1; i >= 0; i--) {
        rightShadowPath += ` L ${rightShadowPoints[i].x} ${rightShadowPoints[i].y}`;
      }
      rightShadowPath += " Z";

      shapes.push(
        <path
          key="right-shadow"
          d={rightShadowPath}
          style={{
            fill: "#a0895c",
            opacity: 0.18,
            mixBlendMode: "multiply",
          }}
        />
      );
    }

    return shapes;
  };

  // Generate subtle color variations
  const generateColorVariations = () => {
    const variations = [];

    // Create 2-3 organic color blobs
    for (let i = 0; i < 3; i++) {
      const blobCenterX = x + random.wobble(0, width * 0.3);
      const blobCenterY = y + height * 0.3 + random.wobble(0, height * 0.4);
      const blobSize = random.range(15, 35);

      // Create organic blob shape
      const blobPoints = [];
      const pointCount = 8;
      for (let j = 0; j < pointCount; j++) {
        const angle = (j / pointCount) * Math.PI * 2;
        const radius = blobSize + random.wobble(0, blobSize * 0.4);
        const pointX = blobCenterX + Math.cos(angle) * radius;
        const pointY = blobCenterY + Math.sin(angle) * radius;
        blobPoints.push({ x: pointX, y: pointY });
      }

      let blobPath = `M ${blobPoints[0].x} ${blobPoints[0].y}`;
      for (let j = 1; j < blobPoints.length; j++) {
        const curr = blobPoints[j];
        const next = blobPoints[(j + 1) % blobPoints.length];
        const midX = (curr.x + next.x) / 2;
        const midY = (curr.y + next.y) / 2;
        blobPath += ` Q ${curr.x} ${curr.y} ${midX} ${midY}`;
      }
      blobPath += " Z";

      const colors = ["#d4c5b0", "#c4b59f", "#b5a68a", "#e0d1be"];
      const color = colors[i % colors.length];

      variations.push(
        <path
          key={`color-variation-${i}`}
          d={blobPath}
          style={{
            fill: color,
            opacity: random.range(0.08, 0.15),
            mixBlendMode: "multiply",
          }}
        />
      );
    }

    return variations;
  };

  return (
    <g>
      {/* Watercolor base layer (behind everything) */}
      {generateWatercolorShading()}

      {/* Multiple overlapping pot segments */}
      {generatePotSegments().map((segment, index) => (
        <path
          key={`pot-segment-${index}`}
          d={segment.d}
          style={{
            fill: "none",
            stroke: "#2d2d2d",
            strokeWidth: segment.strokeWidth,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            opacity: segment.opacity || 1,
            filter: "url(#roughPaper)",
          }}
        />
      ))}

      {/* Additional rim details */}
      <line
        x1={wobble(x - width / 2, 2)}
        y1={wobble(y + 3, 1)}
        x2={wobble(x + width / 2, 2)}
        y2={wobble(y + 3, 1)}
        style={{
          stroke: "#2d2d2d",
          strokeWidth: wobble(0.8, 0.2),
          opacity: wobble(0.3, 0.1),
        }}
      />

      {/* Organic shading */}
      {generateShading()}

      {/* Sketch marks as part of the pot */}
      {generateSketchMarks()}
    </g>
  );
};
