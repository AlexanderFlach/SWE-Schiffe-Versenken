import { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('Verbinde mit Server...');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(`Verbunden: ${data.game} (${data.status})`))
      .catch(() => setStatus('Backend nicht erreichbar'));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-cyan-400">Battleship Battle Royale</h1>
      <p className="px-4 py-2 rounded bg-slate-800 border border-slate-700">{status}</p>
    </div>
  );
}