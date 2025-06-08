import { GenerateSVG, GROWTH_STAGES } from "./main";
import type { AppState } from "./main";

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
              {generateSVG({ genome, input })}
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
        <GenerateSVG genome={genome} input={input} />
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

export const App = ({
  state,
  setState,
}: {
  state: AppState;
  setState: (newState: Partial<AppState>) => void;
}): JSX.Element => {
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
          }}
        >
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
