import React, { useState, useEffect } from "react";

const initialPlayers = [
  "Mirko", "Didier", "Pablo", "Carboni", "Doc", "Cesare",
  "Magro", "Quoccie", "Tambu", "Lucchetti", "Gulla", "Gheometra"
].map(name => ({ name, points: 0 }));

const eventList = [
  { name: "Approccio riuscito", value: 1 },
  { name: "Fa da spalla", value: 1 },
  { name: "Beach volley vinto", value: 0.5 },
  { name: "Pomicia", value: 3 },
  { name: "Conclude", value: 5 },
  { name: "Brutta figura", value: -2 },
  { name: "Rimbalzato", value: -1 },
  { name: "Eroe serata", value: 2 },
  { name: "Aiuta amico ubriaco", value: 1 },
  { name: "Sveglia dopo le 13", value: -0.5 },
  { name: "Drink 5+", value: 1 },
  { name: "Rientra prima di mezzanotte", value: -1 },
];

export default function App() {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("fantarimini_players");
    return saved ? JSON.parse(saved) : initialPlayers;
  });

  // Stato temporaneo per input punteggi modificabili
  const [editingPoints, setEditingPoints] = useState({});

  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [tab, setTab] = useState("classifica");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    localStorage.setItem("fantarimini_players", JSON.stringify(players));
  }, [players]);

  const handleAddPoints = () => {
    if (!selectedPlayer || !selectedEvent) return;
    const event = eventList.find(e => e.name === selectedEvent);
    const newPlayers = players.map(p =>
      p.name === selectedPlayer ? { ...p, points: p.points + event.value } : p
    );
    setHistory(prev => [...prev, players]);
    setPlayers(newPlayers);
    setSelectedPlayer("");
    setSelectedEvent("");
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setPlayers(previous);
    setHistory(prev => prev.slice(0, -1));
  };

  const handleReset = () => {
    if (!window.confirm("Sei sicuro di voler azzerare la classifica?")) return;
    setHistory(prev => [...prev, players]);
    setPlayers(initialPlayers);
    setEditingPoints({});
  };

  // Funzione per aggiornare il punteggio quando l'input perde focus
  const handleBlur = (name) => {
    const valStr = editingPoints[name];
    const val = parseFloat(valStr);
    if (!isNaN(val)) {
      setHistory(prev => [...prev, players]);
      setPlayers(players.map(p => (p.name === name ? { ...p, points: val } : p)));
    }
    setEditingPoints(prev => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  return (
    <div style={{ padding: 16, maxWidth: 400, margin: "auto", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>🏖️ FantaRimini</h1>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <button onClick={() => setTab("classifica")} style={{ marginRight: 8 }}>Classifica</button>
        <button onClick={() => setTab("registra")}>Registra Evento</button>
      </div>

      {tab === "classifica" && (
        <>
          <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
            {sortedPlayers.map((p, i) => (
              <div key={p.name} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span>{i + 1}. {p.name}</span>
                <input
                  type="number"
                  step="0.1"
                  value={editingPoints[p.name] !== undefined ? editingPoints[p.name] : p.points.toString()}
                  onChange={e => {
                    const val = e.target.value;
                    setEditingPoints(prev => ({ ...prev, [p.name]: val }));
                  }}
                  onBlur={() => handleBlur(p.name)}
                  style={{ width: 60, textAlign: "right" }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleReset}
            style={{ marginTop: 16, background: "#dc3545", color: "white", padding: 10, border: "none", borderRadius: 6 }}
          >
            🔄 Azzera Classifica
          </button>
        </>
      )}

      {tab === "registra" && (
        <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <label>Giocatore:</label>
            <select value={selectedPlayer} onChange={e => setSelectedPlayer(e.target.value)} style={{ width: "100%", padding: 8 }}>
              <option value="">-- Seleziona --</option>
              {players.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Evento:</label>
            <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} style={{ width: "100%", padding: 8 }}>
              <option value="">-- Seleziona --</option>
              {eventList.map(e => (
                <option key={e.name} value={e.name}>{e.name} ({e.value > 0 ? "+" : ""}{e.value})</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddPoints}
            style={{ width: "100%", padding: 10, background: "#007bff", color: "white", border: "none", borderRadius: 6 }}
          >
            ✅ Aggiungi Punti
          </button>

          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            style={{ marginTop: 12, width: "100%", padding: 10, background: "#6c757d", color: "white", border: "none", borderRadius: 6 }}
          >
            ↩️ Annulla Ultima Azione
          </button>
        </div>
      )}
    </div>
  );