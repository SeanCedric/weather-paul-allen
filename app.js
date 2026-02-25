function App() {
  const [status, setStatus] = React.useState("");
  const [temp, setTemp] = React.useState(null);
  const [error, setError] = React.useState("");

  const checkWeather = async () => {
    setStatus("Locatie ophalen...");
    setError("");
    setTemp(null);

    if (!navigator.geolocation) {
      setError("Me browser ondersteunt geen GPS type beat.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setStatus("Temperatuur checken...");

        try {
          const response = await fetch('http://localhost:8000/weather', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude })
          });
          const data = await response.json();

          setTemp(data.temperature);
          setStatus(data.is_warm ? "✅ Warm genoeg voor Paul Allen's mix!" : "❄️ Te koud.");
        } catch (e) {
          setError("Backend niet bereikbaar?");
          setStatus("");
        }
      },
      (err) => {
        setError("Locatie geweigerd.");
        setStatus("");
      }
    );
  };

  return (
  <div>
    <h1>🌡️ Paul Allen's Mix Checker</h1>
    <p>Klik om de buitentemperatuur te checken!</p>
    
    <button onClick={checkWeather}>
      {status || "Check buitentemperatuur"}
    </button>
    
    {temp !== null && (
      <div className={`result ${temp > 15 ? 'warm' : 'cold'}`}>
        <h2>{temp.toFixed(1)}°C</h2>
        <p>{temp > 15 ? "Mix time! 🎧" : "Wacht op warmer weer."}</p>
        
        {/* YouTube knop */}
        {temp > 15 && (
          <a 
            href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID_HERE" 
            target="_blank"
            rel="noopener noreferrer"
            className="youtube-btn"
          >
            ▶️ Play Paul Allen's Mix on YouTube
          </a>
        )}
      </div>
    )}
    
    {error && <p style={{color: "red"}}>{error}</p>}
  </div>
  );
}

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);