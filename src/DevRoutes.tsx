import { GenerateSVG, GROWTH_STAGES } from "./main";
import type { JSX } from "preact";
import { createSeededRandom } from "./SeededRandom";
import { DrawPot } from "./DrawPot";
import { DrawLineDefs } from "./DrawLine";
import { Link, useLocation } from "wouter";

// Navigation component for dev pages
const DevNavigation = (): JSX.Element => {
  const [location] = useLocation();

  const navItems = [
    { path: "/dev", label: "Overview" },
    { path: "/dev/pots", label: "Pot Styles" },
    { path: "/dev/plants", label: "Plant Configs" },
    { path: "/dev/stages", label: "Growth Stages" },
    { path: "/dev/combinations", label: "Combinations" },
  ];

  return (
    <nav
      style={{
        background: "white",
        padding: "15px 20px",
        marginBottom: "20px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        display: "flex",
        gap: "15px",
        flexWrap: "wrap",
      }}
    >
      {navItems.map((item) => (
        <Link key={item.path} href={item.path}>
          <span
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              textDecoration: "none",
              color: location === item.path ? "white" : "#333",
              background: location === item.path ? "#4ade80" : "#f0f0f0",
              border:
                location === item.path ? "1px solid #22c55e" : "1px solid #ddd",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
          >
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

// Individual page components
const DevOverview = (): JSX.Element => {
  return (
    <div
      style={{
        padding: "20px",
        background: "white",
        borderRadius: "8px",
        border: "1px solid #ddd",
      }}
    >
      <h2 style={{ color: "#333", marginBottom: "15px" }}>
        Development Environment Overview
      </h2>
      <p style={{ color: "#666", lineHeight: 1.5, marginBottom: "20px" }}>
        This development environment provides detailed views of all plant and
        pot variations. Use the navigation above to explore specific aspects of
        the system.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
        }}
      >
        <div
          style={{
            padding: "15px",
            background: "#f8f9fa",
            borderRadius: "6px",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "16px" }}>
            Pot Styles
          </h3>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            5 distinct pot shapes across all growth stages
          </p>
        </div>
        <div
          style={{
            padding: "15px",
            background: "#f8f9fa",
            borderRadius: "6px",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "16px" }}>
            Plant Configs
          </h3>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            16 different plant configurations
          </p>
        </div>
        <div
          style={{
            padding: "15px",
            background: "#f8f9fa",
            borderRadius: "6px",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "16px" }}>
            Growth Stages
          </h3>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            4 development phases with descriptions
          </p>
        </div>
        <div
          style={{
            padding: "15px",
            background: "#f8f9fa",
            borderRadius: "6px",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "16px" }}>
            Combinations
          </h3>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            Complete pot & plant integration showcase
          </p>
        </div>
      </div>
    </div>
  );
};

const DevPotStyles = (): JSX.Element => {
  const potStyles: Array<
    "round" | "round-concave" | "tapered" | "square" | "bowl"
  > = ["round", "round-concave", "tapered", "square", "bowl"];
  const growthStages: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];

  return (
    <div>
      <h2 style={{ color: "#333", marginBottom: "20px" }}>
        Pot Styles Across All Growth Stages
      </h2>
      {potStyles.map((potStyle) => (
        <div key={potStyle} style={{ marginBottom: "40px" }}>
          <h3
            style={{
              color: "#555",
              marginBottom: "15px",
              textTransform: "capitalize",
              fontSize: "18px",
            }}
          >
            {potStyle} Pot
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "15px",
            }}
          >
            {growthStages.map((stage) => {
              const stageInfo = GROWTH_STAGES.find((s) => s.id === stage)!;
              return (
                <div
                  key={`${potStyle}-stage-${stage}`}
                  style={{
                    background: "white",
                    padding: "15px",
                    borderRadius: "8px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 10px 0",
                      color: "#333",
                      fontSize: "14px",
                    }}
                  >
                    Stage {stage}: {stageInfo.name}
                  </h4>
                  <svg viewBox="0 0 280 280" width="200px" height="200px">
                    <DrawLineDefs />
                    <DrawPot
                      x={140}
                      y={210}
                      width={100}
                      height={50}
                      style={potStyle}
                      random={createSeededRandom(
                        `showcase-pot-${potStyle}-${stage}`
                      )}
                    />
                  </svg>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#666",
                      margin: "8px 0 0 0",
                      lineHeight: 1.3,
                    }}
                  >
                    {stageInfo.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const DevPlantConfigs = (): JSX.Element => {
  const stemCounts: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];
  const leafCounts: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];

  return (
    <div>
      <h2 style={{ color: "#333", marginBottom: "20px" }}>
        Plant Configurations (Growth Stage 3)
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {stemCounts.map((stems) =>
          leafCounts.map((leaves) => (
            <div
              key={`${stems}-${leaves}`}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #ddd",
              }}
            >
              <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
                {stems} stem{stems > 1 ? "s" : ""}, {leaves} leaf/leaves per
                stem
              </h3>
              <GenerateSVG
                genome={[stems, leaves, 2, 1]}
                input={{ time: 3 }}
                random={createSeededRandom(`plant-${stems}-${leaves}-3`)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const DevGrowthStages = (): JSX.Element => {
  const growthStages: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];

  return (
    <div>
      <h2 style={{ color: "#333", marginBottom: "20px" }}>
        Growth Stages (2 stems, 3 leaves)
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {growthStages.map((stage) => {
          const stageInfo = GROWTH_STAGES.find((s) => s.id === stage)!;
          return (
            <div
              key={stage}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #ddd",
              }}
            >
              <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
                Stage {stage}: {stageInfo.name}
              </h3>
              <GenerateSVG
                genome={[2, 3, 2, 1]}
                input={{ time: stage }}
                random={createSeededRandom(`growth-${stage}`)}
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  margin: "10px 0 0 0",
                }}
              >
                {stageInfo.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DevCombinations = (): JSX.Element => {
  const potStyles: Array<
    "round" | "round-concave" | "tapered" | "square" | "bowl"
  > = ["round", "round-concave", "tapered", "square", "bowl"];

  return (
    <div>
      <h2 style={{ color: "#333", marginBottom: "20px" }}>
        Pot & Plant Combinations
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {potStyles.map((potStyle) => (
          <div
            key={potStyle}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              border: "1px solid #ddd",
            }}
          >
            <h3
              style={{
                margin: "0 0 15px 0",
                color: "#333",
                textTransform: "capitalize",
              }}
            >
              {potStyle} Pot with 3-stem Plant
            </h3>
            <svg viewBox="0 0 300 300" width="250px" height="250px">
              <DrawLineDefs />
              <DrawPot
                x={150}
                y={220}
                width={120}
                height={60}
                style={potStyle}
                random={createSeededRandom(`combo-pot-${potStyle}`)}
              />
              {[0, 1, 2].map((stemIndex) => {
                const stemX = 90 + stemIndex * 40;
                const stemY = 225;
                const height = 80;
                const random = createSeededRandom(
                  `combo-stem-${potStyle}-${stemIndex}`
                );
                const midX = stemX + (random.next() - 0.5) * 3;
                const stemPath = `M ${stemX} ${stemY} Q ${midX} ${
                  stemY - height / 2
                } ${stemX + (random.next() - 0.5) * 2} ${stemY - height}`;
                return (
                  <g key={stemIndex}>
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
                    {[0, 1].map((leafIndex) => {
                      const leafY = stemY - (height * (leafIndex + 1)) / 3;
                      const side = leafIndex % 2 === 0 ? -1 : 1;
                      const leafX = stemX + side * 15;
                      const leafSize = 12;
                      const wobble = (value: number) => random.wobble(value, 2);
                      const leafPath = `M ${wobble(leafX)} ${wobble(
                        leafY
                      )} Q ${wobble(leafX - leafSize / 2)} ${wobble(
                        leafY - leafSize
                      )} ${wobble(leafX)} ${wobble(
                        leafY - leafSize * 1.5
                      )} Q ${wobble(leafX + leafSize / 2)} ${wobble(
                        leafY - leafSize
                      )} ${wobble(leafX)} ${wobble(leafY)}`;
                      return (
                        <path
                          key={leafIndex}
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
                    })}
                  </g>
                );
              })}
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

// Layout wrapper for dev pages
export const DevLayout = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px", color: "#333" }}>
        Development Showcase - All Plants & Pots
      </h1>

      <DevNavigation />

      {children}
    </div>
  );
};

// Export individual page components
export {
  DevOverview,
  DevPotStyles,
  DevPlantConfigs,
  DevGrowthStages,
  DevCombinations,
};
