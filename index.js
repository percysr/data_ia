import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

const STATS = {
  total_ventas: 175407.80,
  ventas_efectivas: 457,
  abandonos: 43,
  tasa_abandono: 8.6,
  devoluciones: 36,
  tasa_devolucion: 7.9,
  by_tienda: { "Trujillo": 47910.81, "Lima Norte": 40726.27, "Lima Centro": 31986.34, "Arequipa": 28117.71, "Lima Sur": 26666.67 },
  by_categoria: { "Electrónica": 85101.46, "Hogar": 29714.20, "Deportes": 22957.91, "Juguetes": 10636.04, "Ropa y Calzado": 10439.94, "Belleza": 6998.20, "Alimentos": 5901.07, "Libros": 3658.98 },
  by_canal: { "Tienda física": 133899.93, "Web": 28189.49, "App móvil": 13318.38 },
  nps_by_canal: { "App móvil": 74.4, "Tienda física": 71.5, "Web": 59.9 },
  abandono_by_canal: { "App móvil": 31.0, "Web": 25.5, "Tienda física": 0.0 },
  by_mes: { 1: 10489, 2: 17032, 3: 14320, 4: 13331, 5: 13694, 6: 9918, 7: 8351, 8: 23923, 9: 11234, 10: 10520, 11: 20456, 12: 22139 }
};

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const SUGGESTIONS = [
  '¿Cuál es el mayor problema en canales digitales?',
  '¿Cómo monetizamos los datos del abandono de carrito?',
  '¿Qué categoría tiene el peor NPS y por qué?',
  '¿Qué KPIs debo incluir en el tablero de control?',
  '¿Cuánto perdemos por devoluciones y cómo reducirlo?',
  '¿Cuál es la oportunidad más grande de ahorro inmediato?',
];

function BarChart({ data, color = '#1D9E75', horizontal = false, showValues = false }) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v));

  if (horizontal) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries.map(([label, value]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 90, fontSize: 10, color: '#aaa', textAlign: 'right', flexShrink: 0 }}>{label}</div>
            <div style={{ flex: 1, background: '#1a2a3a', borderRadius: 3, height: 18, overflow: 'hidden' }}>
              <div style={{ width: `${(value / max) * 100}%`, background: color, height: '100%', borderRadius: 3, display: 'flex', alignItems: 'center', paddingLeft: 6 }}>
                {showValues && <span style={{ fontSize: 9, color: '#0B1628', fontWeight: 600 }}>S/{(value / 1000).toFixed(0)}K</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
      {entries.map(([label, value]) => (
        <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', background: '#1a2a3a', borderRadius: 3, height: 100, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: `${(value / max) * 100}%`, background: color, borderRadius: 3 }} />
          </div>
          <span style={{ fontSize: 9, color: '#aaa', textAlign: 'center' }}>{label.split(' ')[0]}</span>
        </div>
      ))}
    </div>
  );
}

function MetricCard({ label, value, sub, danger }) {
  return (
    <div style={{ background: '#0D2137', borderRadius: 8, padding: '12px 14px' }}>
      <div style={{ fontSize: 11, color: '#88AABB', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: danger ? '#E84040' : '#00BFA5', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: '#667', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  async function ask(question) {
    if (!question.trim() || loading) return;
    const userMsg = { role: 'user', content: question };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      if (data.content) {
        setMessages([...newHistory, { role: 'assistant', content: data.content }]);
      } else {
        setMessages([...newHistory, { role: 'assistant', content: '⚠️ Error: ' + (data.error || 'No se pudo obtener respuesta.') }]);
      }
    } catch {
      setMessages([...newHistory, { role: 'assistant', content: '⚠️ Error de conexión. Verifica que el servicio esté disponible.' }]);
    }
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>RetailPerú — Analizador de Datos con IA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ fontFamily: 'Inter, sans-serif', background: '#0B1628', minHeight: '100vh', color: '#fff', padding: 20 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #1A3A5C' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>RetailPerú S.A. — Analizador de Datos con IA</div>
            <div style={{ fontSize: 12, color: '#88AABB', marginTop: 2 }}>
              Exploración de Datos · Sesión 4 · 500 transacciones · Enero–Diciembre 2024
            </div>
          </div>
          <div style={{ background: '#0D3320', border: '1px solid #1D9E75', color: '#1D9E75', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
            🤖 IA Activa
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          <MetricCard label="Ventas totales 2024" value="S/ 175K" sub="457 transacciones efectivas" />
          <MetricCard label="Abandono digital" value="28-31%" sub="Web 25.5% · App 31%" danger />
          <MetricCard label="NPS promedio" value="68.6" sub="App 74.4 · Física 71.5 · Web 59.9" />
          <MetricCard label="Tasa devolución" value="7.9%" sub="36 devoluciones en el año" danger />
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          {/* Canal */}
          <div style={{ background: '#0D2137', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#88AABB', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ventas por canal</div>
            <BarChart data={STATS.by_canal} color="#185FA5" />
          </div>

          {/* Mensual */}
          <div style={{ background: '#0D2137', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#88AABB', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ventas mensuales</div>
            <BarChart data={STATS.by_mes} color="#1D9E75" />
            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
              {Object.keys(STATS.by_mes).map(m => (
                <div key={m} style={{ flex: 1, fontSize: 7, color: '#556', textAlign: 'center' }}>{MESES[m - 1].slice(0, 3)}</div>
              ))}
            </div>
          </div>

          {/* Categoría */}
          <div style={{ background: '#0D2137', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#88AABB', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ventas por categoría</div>
            <BarChart data={STATS.by_categoria} color="#D85A30" horizontal showValues />
          </div>

          {/* NPS */}
          <div style={{ background: '#0D2137', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#88AABB', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>NPS por canal</div>
            {Object.entries(STATS.nps_by_canal).map(([canal, nps]) => (
              <div key={canal} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: '#aaa' }}>{canal}</span>
                  <span style={{ fontWeight: 600, color: nps >= 70 ? '#1D9E75' : nps >= 65 ? '#F57F17' : '#E84040' }}>{nps}</span>
                </div>
                <div style={{ background: '#1a2a3a', borderRadius: 3, height: 8 }}>
                  <div style={{ width: `${(nps / 100) * 100}%`, height: '100%', borderRadius: 3, background: nps >= 70 ? '#1D9E75' : nps >= 65 ? '#F57F17' : '#E84040' }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize: 10, color: '#556', marginTop: 6 }}>
              ⚠ Web 12 pts bajo que App
            </div>
          </div>
        </div>

        {/* Chat IA */}
        <div style={{ background: '#0D2137', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>💬</span> Pregunta a la IA sobre los datos de RetailPerú
          </div>

          {/* Suggestions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => ask(s)}
                disabled={loading}
                style={{
                  background: '#1A3A5C', border: '1px solid #1D4A6A', color: '#88AABB',
                  borderRadius: 20, padding: '5px 12px', fontSize: 11, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.target.style.background = '#0D3320'; e.target.style.color = '#1D9E75'; e.target.style.borderColor = '#1D9E75'; }}
                onMouseLeave={e => { e.target.style.background = '#1A3A5C'; e.target.style.color = '#88AABB'; e.target.style.borderColor = '#1D4A6A'; }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && ask(input)}
              placeholder="Escribe tu pregunta sobre los datos de RetailPerú..."
              disabled={loading}
              style={{
                flex: 1, background: '#0B1628', border: '1px solid #1A3A5C', color: '#fff',
                borderRadius: 8, padding: '9px 14px', fontSize: 13, outline: 'none',
              }}
            />
            <button
              onClick={() => ask(input)}
              disabled={loading || !input.trim()}
              style={{
                background: loading ? '#0A2A1A' : '#1D9E75', color: loading ? '#1D9E75' : '#0B1628',
                border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13,
                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
              }}
            >
              {loading ? 'Analizando...' : 'Analizar ↗'}
            </button>
          </div>

          {/* Messages */}
          {messages.length > 0 && (
            <div
              ref={msgsRef}
              style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {messages.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.role === 'user' ? '#0D3320' : '#1A2A3A',
                  border: `1px solid ${msg.role === 'user' ? '#1D9E75' : '#1A3A5C'}`,
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: msg.role === 'user' ? '#1D9E75' : '#AACCEE',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', color: '#556', fontSize: 12, fontStyle: 'italic', padding: '6px 10px' }}>
                  Analizando datos...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#334' }}>
          Transformación Digital · Postgrado Ejecutivo UPC · Sesión 4 · Percy Sunohara R.
        </div>
      </div>
    </>
  );
}
