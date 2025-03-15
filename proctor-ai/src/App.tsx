import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

interface LogEntry {
  created_at: string;
  type: string;
  data: Record<string, any>;
  exam_id?: string;
}

function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let logsBuffer: LogEntry[] = [];

    const logEvent = (type: string, data: Record<string, any> = {}) => {
      const logEntry: LogEntry = {
        created_at: new Date().toISOString(),
        type,
        data,
        exam_id: "2", // Change this if dynamic
      };

      logsBuffer.push(logEntry);
    };

    document.addEventListener("mousemove", (event) => {
      logEvent("mouse_move", { x: event.clientX, y: event.clientY });
    });

    document.addEventListener("keydown", (event) => {
      logEvent("key_press", { key: event.key });
    });

    window.addEventListener("resize", () => {
      logEvent("window_resize", {
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });

    // Send data to Supabase every 5 seconds and update UI
    const interval = setInterval(async () => {
      if (logsBuffer.length > 0) {
        const newLogs = [...logsBuffer]; // Copy logs to avoid mutation
        logsBuffer = []; // Clear buffer

        setLogs((prevLogs) => [...newLogs, ...prevLogs]); // Update UI immediately

        const { error } = await supabase.from("proctoring_logs").insert(newLogs);
        if (error) {
          setError(error.message);
          console.error("Error inserting logs:", error);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Live Uploaded Logs</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <pre>{JSON.stringify(logs, null, 2)}</pre> {/* Display as JSON */}
    </div>
  );
}

export default App;
