import { SeededRandom } from './SeededRandom';

interface PotProps {
  x: number;
  y: number;
  width: number;
  height: number;
  style?: 'round' | 'tapered' | 'square' | 'bowl';
  random: SeededRandom;
}

export const DrawPot = ({ x, y, width, height, style = 'tapered', random }: PotProps) => {
  // Helper to add random variations for hand-drawn effect
  const wobble = (value: number, amount: number = 2) => {
    return random.wobble(value, amount);
  };

  // Helper to create jagged points along a line
  const createJaggedPoints = (startX: number, startY: number, endX: number, endY: number, segments: number = 5) => {
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
    const rimWidth = width;
    const baseWidth = style === 'tapered' ? width * 0.7 : width * 0.85;
    
    const segments = [];
    
    // Segment 1: Top rim area
    const rimPoints = createJaggedPoints(
      x - rimWidth / 2, y,
      x + rimWidth / 2, y,
      6
    );
    
    let rimPath = `M ${rimPoints[0].x} ${rimPoints[0].y}`;
    for (let i = 1; i < rimPoints.length; i++) {
      rimPath += ` L ${rimPoints[i].x} ${rimPoints[i].y}`;
    }
    
    segments.push({
      d: rimPath,
      strokeWidth: wobble(1.5, 0.3)
    });

    // Segment 2: Left side (multiple overlapping lines)
    for (let j = 0; j < 2; j++) {
      const leftPoints = createJaggedPoints(
        wobble(x - rimWidth / 2, 1), wobble(y, 1),
        wobble(x - baseWidth / 2, 2), wobble(y + height, 1),
        8
      );
      
      let leftPath = `M ${leftPoints[0].x} ${leftPoints[0].y}`;
      for (let i = 1; i < leftPoints.length; i++) {
        leftPath += ` L ${leftPoints[i].x} ${leftPoints[i].y}`;
      }
      
      segments.push({
        d: leftPath,
        strokeWidth: wobble(1.2, 0.4),
        opacity: j === 0 ? 1 : 0.6
      });
    }

    // Segment 3: Right side (multiple overlapping lines)
    for (let j = 0; j < 2; j++) {
      const rightPoints = createJaggedPoints(
        wobble(x + rimWidth / 2, 1), wobble(y, 1),
        wobble(x + baseWidth / 2, 2), wobble(y + height, 1),
        8
      );
      
      let rightPath = `M ${rightPoints[0].x} ${rightPoints[0].y}`;
      for (let i = 1; i < rightPoints.length; i++) {
        rightPath += ` L ${rightPoints[i].x} ${rightPoints[i].y}`;
      }
      
      segments.push({
        d: rightPath,
        strokeWidth: wobble(1.2, 0.4),
        opacity: j === 0 ? 1 : 0.6
      });
    }

    // Segment 4: Bottom (multiple overlapping lines)
    for (let j = 0; j < 2; j++) {
      const bottomPoints = createJaggedPoints(
        wobble(x - baseWidth / 2, 1), wobble(y + height, 1),
        wobble(x + baseWidth / 2, 1), wobble(y + height, 1),
        6
      );
      
      let bottomPath = `M ${bottomPoints[0].x} ${bottomPoints[0].y}`;
      for (let i = 1; i < bottomPoints.length; i++) {
        bottomPath += ` L ${bottomPoints[i].x} ${bottomPoints[i].y}`;
      }
      
      segments.push({
        d: bottomPath,
        strokeWidth: wobble(1.3, 0.3),
        opacity: j === 0 ? 1 : 0.5
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
      const angle = wobble(Math.PI / 4, Math.PI / 8) + (random.next() > 0.5 ? Math.PI / 2 : 0);
      
      marks.push(
        <line
          key={`sketch-${i}`}
          x1={markX}
          y1={markY}
          x2={markX + Math.cos(angle) * markLength}
          y2={markY + Math.sin(angle) * markLength}
          style={{
            stroke: '#2d2d2d',
            strokeWidth: wobble(0.4, 0.2),
            opacity: wobble(0.15, 0.05),
          }}
        />
      );
    }

    // Texture lines that look more hand-drawn
    for (let i = 0; i < 4; i++) {
      const lineY = y + (height * 0.25) + (i * height * 0.18);
      const points = createJaggedPoints(
        x - width * 0.35, lineY,
        x + width * 0.35, lineY,
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
            fill: 'none',
            stroke: '#2d2d2d',
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
      const startX = wobble(x - width * 0.25 + (random.next() * width * 0.4), 2);
      const startY = wobble(y + height * 0.3 + (random.next() * height * 0.5), 2);
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
            stroke: '#2d2d2d',
            strokeWidth: wobble(0.3, 0.1),
            opacity: wobble(0.15, 0.05),
          }}
        />
      );
    }
    
    return shadingLines;
  };

  return (
    <g>
      {/* Multiple overlapping pot segments */}
      {generatePotSegments().map((segment, index) => (
        <path
          key={`pot-segment-${index}`}
          d={segment.d}
          style={{
            fill: 'none',
            stroke: '#2d2d2d',
            strokeWidth: segment.strokeWidth,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            opacity: segment.opacity || 1,
            filter: 'url(#roughPaper)',
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
          stroke: '#2d2d2d',
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