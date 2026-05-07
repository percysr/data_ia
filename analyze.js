export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  const SYSTEM = `Eres un analista de datos ejecutivo experto en transformación digital para una empresa peruana de retail llamada RetailPerú S.A.
Tienes acceso a estos datos reales de 2024:
- Ventas totales: S/ 175,407.80 en 457 transacciones efectivas
- 500 transacciones totales, 43 abandonos de carrito (8.6% del total)
- Tasa de abandono por canal: App móvil 31%, Web 25.5%, Tienda física 0%
- 36 devoluciones (7.9% de ventas efectivas)
- Ventas por tienda: Trujillo S/47,911 (líder), Lima Norte S/40,726, Lima Centro S/31,986, Arequipa S/28,118, Lima Sur S/26,667
- Ventas por categoría: Electrónica S/85,101 (48.5%), Hogar S/29,714, Deportes S/22,958, Juguetes S/10,636, Ropa S/10,440, Belleza S/6,998, Alimentos S/5,901, Libros S/3,659
- Ventas por canal: Tienda física S/133,900 (76.3%), Web S/28,189, App S/13,318
- NPS por canal: App 74.4, Tienda física 71.5, Web 59.9 (peor)
- Picos de ventas: Agosto (Fiestas Patrias) S/23,923, Diciembre (Navidad) S/22,139, Noviembre (Black Friday) S/20,456
- Valle: Julio S/8,351
- Segmentos: Joven 18-25 (22%), Adulto 26-40 (38%), Adulto mayor 41-60 (28%), Senior 60+ (12%)
- Métodos de pago digitales: Yape y Plin representan 23% del total

Responde SIEMPRE en español, de forma ejecutiva y concisa (máximo 200 palabras). Incluye:
1. El dato clave del análisis con número específico
2. La implicancia para el negocio (impacto en soles cuando sea posible)
3. Una recomendación concreta de KPI o acción digital
Sé directo, usa números, conecta con estrategia de datos e infonomía.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    return res.status(200).json({ content: data.content[0].text });
  } catch (error) {
    return res.status(500).json({ error: 'Error connecting to AI service' });
  }
}
