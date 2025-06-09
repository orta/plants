import { GenerateSVG, GROWTH_STAGES } from "./main";
import type { AppState } from "./main";
import type { JSX } from "preact";
import { useState } from "preact/hooks";
import { createSeededRandom } from "./SeededRandom";
import { DrawPot } from "./DrawPot";
import { DrawLineDefs } from "./DrawLine";

export const Timeline = ({
  state,
  setState,
}: {
  state: AppState;
  setState: (newState: Partial<AppState>) => void;
}): JSX.Element => {
  const genome: [1 | 2 | 3 | 4, 1 | 2 | 3 | 4, 1 | 2 | 3, number] = [
    state.stems,
    state.leafsPerStem,
    state.petioles,
    1,
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        background: "#1a1a1a",
        borderRadius: "8px",
        overflowX: "auto",
      }}
    >
      {GROWTH_STAGES.map((stage) => {
        const input = { time: stage.id };
        const isSelected = state.selectedStage === stage.id;

        return (
          <div
            key={stage.id}
            style={{
              minWidth: "200px",
              background: isSelected ? "#2a2a2a" : "#333",
              border: isSelected ? "2px solid #4ade80" : "2px solid #666",
              borderRadius: "8px",
              padding: "16px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={() => setState({ selectedStage: stage.id })}
          >
            <div
              style={{
                color: "#fff",
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Stage {stage.id}: {stage.name}
            </div>

            <div
              style={{
                minHeight: "150px",
                background: "#f0f0f0",
                borderRadius: "4px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GenerateSVG 
                genome={genome} 
                input={input} 
                random={createSeededRandom(`timeline-${stage.id}-${state.stems}-${state.leafsPerStem}-${state.petioles}`)} 
              />
            </div>

            <div
              style={{ color: "#ccc", fontSize: "12px", marginBottom: "8px" }}
            >
              {stage.description}
            </div>

            <div style={{ color: "#888", fontSize: "11px" }}>
              {stage.characteristics.map((char, idx) => (
                <div key={idx} style={{ marginBottom: "2px" }}>
                  • {char}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const PlantDisplay = ({ state }: { state: AppState }): JSX.Element => {
  const genome: [1 | 2 | 3 | 4, 1 | 2 | 3 | 4, 1 | 2 | 3, number] = [
    state.stems,
    state.leafsPerStem,
    state.petioles,
    1,
  ];
  const input = { time: state.selectedStage };
  const currentStage = GROWTH_STAGES.find((s) => s.id === state.selectedStage)!;

  return (
    <div
      style={{
        background: "#f8f9fa",
        borderRadius: "8px",
        padding: "24px",
        border: "1px solid #e9ecef",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ margin: 0, color: "#333" }}>
          Current View: {currentStage.name}
        </h3>
        <div
          style={{
            color: "#666",
            fontSize: "14px",
            background: "#e9ecef",
            padding: "4px 12px",
            borderRadius: "16px",
          }}
        >
          Stage {state.selectedStage}/4
        </div>
      </div>

      <div
        style={{
          minHeight: "300px",
          background: "#fff",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #dee2e6",
        }}
      >
        <GenerateSVG 
          genome={genome} 
          input={input} 
          random={createSeededRandom(`main-${state.selectedStage}-${state.stems}-${state.leafsPerStem}-${state.petioles}`)} 
        />
      </div>
    </div>
  );
};

export const Controls = ({
  state,
  setState,
}: {
  state: AppState;
  setState: (newState: Partial<AppState>) => void;
}): JSX.Element => {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid #e9ecef",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          alignItems: "end",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontWeight: "500",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            Stems
          </label>
          <select
            value={state.stems}
            onChange={(e) => {
              const target = e.target as HTMLSelectElement;
              setState({ stems: parseInt(target.value) as 1 | 2 | 3 | 4 });
            }}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <option value="1">1 stem</option>
            <option value="2">2 stems</option>
            <option value="3">3 stems</option>
            <option value="4">4 stems</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontWeight: "500",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            Leaves per Stem
          </label>
          <select
            value={state.leafsPerStem}
            onChange={(e) => {
              const target = e.target as HTMLSelectElement;
              setState({
                leafsPerStem: parseInt(target.value) as 1 | 2 | 3 | 4,
              });
            }}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <option value="1">1 leaf</option>
            <option value="2">2 leaves</option>
            <option value="3">3 leaves</option>
            <option value="4">4 leaves</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontWeight: "500",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            Petioles
          </label>
          <select
            value={state.petioles}
            onChange={(e) => {
              const target = e.target as HTMLSelectElement;
              setState({ petioles: parseInt(target.value) as 1 | 2 | 3 });
            }}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <option value="1">1 petiole</option>
            <option value="2">2 petioles</option>
            <option value="3">3 petioles</option>
          </select>
        </div>

        <button
          style={{
            padding: "10px 20px",
            background: "#4ade80",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onClick={() => {
            // Force re-render with new random variation
            setState({});
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#22c55e";
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#4ade80";
          }}
        >
          Regenerate
        </button>
      </div>
    </div>
  );
};

export const DevShowcase = (): JSX.Element => {
  const potStyles: Array<'round' | 'tapered' | 'square' | 'bowl'> = ['round', 'tapered', 'square', 'bowl'];
  const stemCounts: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];
  const leafCounts: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];
  const growthStages: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px", color: "#333" }}>
        Development Showcase - All Plants & Pots
      </h1>
      
      {/* Pot Styles Showcase */}
      <section style={{ marginBottom: "60px" }}>
        <h2 style={{ color: "#333", marginBottom: "20px" }}>Pot Styles</h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "20px" 
        }}>
          {potStyles.map(style => (
            <div key={style} style={{ 
              background: "white", 
              padding: "20px", 
              borderRadius: "8px", 
              textAlign: "center",
              border: "1px solid #ddd"
            }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#333", textTransform: "capitalize" }}>
                {style}
              </h3>
              <svg viewBox="0 0 200 200" width="150px" height="150px">
                <DrawLineDefs />
                <DrawPot
                  x={100}
                  y={150}
                  width={80}
                  height={60}
                  style={style}
                  random={createSeededRandom(`pot-${style}`)}
                />
              </svg>
            </div>
          ))}
        </div>
      </section>

      {/* Plant Configurations Showcase */}
      <section style={{ marginBottom: "60px" }}>
        <h2 style={{ color: "#333", marginBottom: "20px" }}>Plant Configurations (Growth Stage 3)</h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "20px" 
        }}>
          {stemCounts.map(stems => 
            leafCounts.map(leaves => (
              <div key={`${stems}-${leaves}`} style={{ 
                background: "white", 
                padding: "20px", 
                borderRadius: "8px", 
                textAlign: "center",
                border: "1px solid #ddd"
              }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
                  {stems} stem{stems > 1 ? 's' : ''}, {leaves} leaf/leaves per stem
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
      </section>

      {/* Growth Stages Showcase */}
      <section style={{ marginBottom: "60px" }}>
        <h2 style={{ color: "#333", marginBottom: "20px" }}>Growth Stages (2 stems, 3 leaves)</h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "20px" 
        }}>
          {growthStages.map(stage => {
            const stageInfo = GROWTH_STAGES.find(s => s.id === stage)!;
            return (
              <div key={stage} style={{ 
                background: "white", 
                padding: "20px", 
                borderRadius: "8px", 
                textAlign: "center",
                border: "1px solid #ddd"
              }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
                  Stage {stage}: {stageInfo.name}
                </h3>
                <GenerateSVG
                  genome={[2, 3, 2, 1]}
                  input={{ time: stage }}
                  random={createSeededRandom(`growth-${stage}`)}
                />
                <p style={{ fontSize: "12px", color: "#666", margin: "10px 0 0 0" }}>
                  {stageInfo.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pot & Plant Combinations */}
      <section>
        <h2 style={{ color: "#333", marginBottom: "20px" }}>Pot & Plant Combinations</h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "20px" 
        }}>
          {potStyles.map(potStyle => (
            <div key={potStyle} style={{ 
              background: "white", 
              padding: "20px", 
              borderRadius: "8px", 
              textAlign: "center",
              border: "1px solid #ddd"
            }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#333", textTransform: "capitalize" }}>
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
                {/* Generate stems for this combo */}
                {[0, 1, 2].map(stemIndex => {
                  const stemX = 90 + stemIndex * 40;
                  const stemY = 225;
                  const height = 80;
                  const random = createSeededRandom(`combo-stem-${potStyle}-${stemIndex}`);
                  
                  // Simple stem path
                  const midX = stemX + (random.next() - 0.5) * 3;
                  const stemPath = `M ${stemX} ${stemY} Q ${midX} ${stemY - height / 2} ${stemX + (random.next() - 0.5) * 2} ${stemY - height}`;
                  
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
                      {/* Add a couple leaves */}
                      {[0, 1].map(leafIndex => {
                        const leafY = stemY - (height * (leafIndex + 1)) / 3;
                        const side = leafIndex % 2 === 0 ? -1 : 1;
                        const leafX = stemX + side * 15;
                        const leafSize = 12;
                        
                        const wobble = (value: number) => random.wobble(value, 2);
                        const leafPath = `M ${wobble(leafX)} ${wobble(leafY)} Q ${wobble(leafX - leafSize / 2)} ${wobble(leafY - leafSize)} ${wobble(leafX)} ${wobble(leafY - leafSize * 1.5)} Q ${wobble(leafX + leafSize / 2)} ${wobble(leafY - leafSize)} ${wobble(leafX)} ${wobble(leafY)}`;
                        
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
      </section>
    </div>
  );
};

export const App = ({
  state,
  setState,
}: {
  state: AppState;
  setState: (newState: Partial<AppState>) => void;
}): JSX.Element => {
  const [showDevMode, setShowDevMode] = useState(false);

  if (showDevMode) {
    return (
      <div>
        <div style={{ 
          position: "fixed", 
          top: "20px", 
          right: "20px", 
          zIndex: 1000 
        }}>
          <button
            onClick={() => setShowDevMode(false)}
            style={{
              padding: "10px 20px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Back to Main App
          </button>
        </div>
        <DevShowcase />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
            color: "white",
            position: "relative",
          }}
        >
          <button
            onClick={() => setShowDevMode(true)}
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              padding: "8px 16px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            Dev Showcase
          </button>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "300",
              margin: "0 0 16px 0",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Plant Growth Timeline
          </h1>
          <p
            style={{
              fontSize: "18px",
              opacity: "0.9",
              margin: 0,
              fontWeight: "300",
            }}
          >
            Interactive development stages with procedural generation
          </p>
        </div>

        <Controls state={state} setState={setState} />

        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <h3
            style={{
              color: "white",
              margin: "0 0 16px 0",
              fontSize: "18px",
              fontWeight: "500",
            }}
          >
            Growth Timeline
          </h3>
          <Timeline state={state} setState={setState} />
        </div>

        <PlantDisplay state={state} />
      </div>
    </div>
  );
};
