export const DrawLineDefs = () => {
  return (
    <defs>
      {/* Simple pencil texture filter that works in Safari */}
      <filter id="pencilTexture">
        <feTurbulence
          type="turbulence"
          baseFrequency="0.02"
          numOctaves="5"
          result="turbulence"
        />
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="2" />
      </filter>

      {/* Simple roughen filter */}
      <filter id="roughPaper">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.04"
          numOctaves="5"
          result="noise"
          seed="2"
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
      </filter>

      {/* Pencil sketch effect */}
      <filter id="pencilSketch">
        <feTurbulence
          baseFrequency="0.02"
          numOctaves="3"
          result="turbulence"
          seed="5"
        />
        <feColorMatrix
          in="turbulence"
          type="saturate"
          values="0"
          result="desaturatedTurbulence"
        />
        <feComponentTransfer result="pencilTexture">
          <feFuncA
            type="discrete"
            tableValues="0 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 1"
          />
        </feComponentTransfer>
        <feComposite
          in="pencilTexture"
          in2="SourceGraphic"
          operator="multiply"
        />
      </filter>
    </defs>
  );
};

export const DrawLine = (props: { x: number; y: number }) => {
  // Create a wavy hand-drawn line
  const x1 = props.x;
  const y1 = props.y;
  const x2 = props.x + 100;
  const y2 = props.y + 50;

  // Create a slightly wavy path instead of straight line
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const offset = 5;

  const d = `M ${x1} ${y1} Q ${midX} ${midY - offset} ${x2} ${y2}`;

  return (
    <path
      d={d}
      style={{
        fill: "none",
        stroke: "#2d2d2d",
        strokeWidth: "2",
        strokeLinecap: "round",
        opacity: "0.8",
      }}
    />
  );
};
