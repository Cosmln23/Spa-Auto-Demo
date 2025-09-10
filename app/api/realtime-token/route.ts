import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function GET() {
  try {
    if (!OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY environment variable');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      'https://api.openai.com/v1/realtime/sessions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview-2024-10-01',
          voice: 'alloy',
          instructions: `Ești un agent de rezervări pentru "Spa Auto Demo", un salon de detailing auto din București. 

SERVICII DISPONIBILE:
- Spălare Exterioară (30 min, 25 RON)
- Spălare Completă (60 min, 45 RON) 
- Detailing Premium (120 min, 150 RON)
- Curățare Interioară (45 min, 35 RON)
- Ceruire Auto (90 min, 80 RON)

PROGRAM: Luni-Vineri 8-18, Sâmbătă 9-17, Duminică închis

TASK-URILE TALE:
1. Salută prietenos și întreabă cum poți ajuta
2. Prezintă serviciile disponibile dacă clientul întreabă
3. Pentru rezervări, colectează: nume, telefon, email (opțional), numărul de înmatriculare (opțional)
4. Întreabă ce serviciu dorește și pentru ce dată
5. Confirmă detaliile rezervării
6. Explică că rezervarea va fi procesată și vor fi contactați pentru confirmare

STIL:
- Vorbește natural în română
- Fii prietenos și profesional  
- Păstrează conversația focusată pe rezervări
- Dacă nu știi ceva, spune că vei verifica cu echipa`,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to create realtime session' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      client_secret: data.client_secret.value,
      expires_at: data.expires_at,
    });
  } catch (error) {
    console.error('Error creating realtime session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
