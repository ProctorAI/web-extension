(async function () {
  // Ensure Supabase is available
  if (typeof supabase === "undefined") {
    console.error("Supabase client is not loaded.");
    return;
  }

  let logs = [];
  const MOUSE_THROTTLE = 500;
  const RESIZE_THROTTLE = 500;
  const DEFAULT_EXAM_ID = "2";
  let lastMouseMoveTime = 0;
  let lastResizeTime = 0;

  // Fetch user ID (Modify this if using Supabase Auth)
  let userId = null;
  try {
    const { data } = await supabase.auth.getUser();
    userId = data?.user?.id || null;
  } catch (err) {
    console.error("Error fetching user:", err);
  }

  function logEvent(type, data = {}) {
    const eventData = {
      type,
      data,
      timestamp: Date.now(),
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      window_width: window.innerWidth,
      window_height: window.innerHeight,
    };
    logs.push(eventData);
  }

  document.addEventListener("mousemove", (event) => {
    const now = Date.now();
    if (now - lastMouseMoveTime >= MOUSE_THROTTLE) {
      logEvent("mouse_move", { x: event.clientX, y: event.clientY });
      lastMouseMoveTime = now;
    }
  });

  document.addEventListener("keydown", (event) => {
    logEvent("key_press", { key: event.key });
  });

  window.addEventListener("resize", () => {
    const now = Date.now();
    if (now - lastResizeTime >= RESIZE_THROTTLE) {
      logEvent("window_resize", { width: window.innerWidth, height: window.innerHeight });
      lastResizeTime = now;
    }
  });

  setInterval(async () => {
    if (logs.length > 0) {
      const logsWithSchema = logs.map((log) => ({
        created_at: new Date().toISOString(),
        type: log.type,
        data: log.data,
        exam_id: DEFAULT_EXAM_ID,
        user_id: userId,
        device_type: "desktop",
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        window_width: log.window_width,
        window_height: log.window_height,
        risk_score: null,
        risk_level: null,
        mouse_score: null,
        keyboard_score: null,
        window_score: null,
      }));

      const { error } = await supabase.from("proctoring_logs").insert(logsWithSchema);
      if (error) console.error("Error inserting logs:", error);
      logs = [];
    }
  }, 5000);
})();
