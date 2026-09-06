import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface IdAnalysis {
  isAuthentic: boolean;
  confidence: number; // 0-100
  name?: string;
  rollNumber?: string;
  branch?: string;
  reason: string;
}

const UNIVERSITY = 'Odisha University of Technology and Research (OUTR)';
const SYSTEM_PROMPT = `You are an expert university ID card fraud detector for ${UNIVERSITY}.

Analyze the uploaded ID card image and evaluate its authenticity by checking:
1. Logo placement (top-left, blue university emblem)
2. Color scheme (primarily blue header, white body, OUTR branding)
3. Hologram sticker (bottom-right corner, iridescent)
4. QR code (bottom-left, machine-readable)
5. Photo placement (right side, passport-sized, no obvious Photoshop artifacts)
6. Official seal/stamp (red circular stamp)
7. Font consistency (clean sans-serif, no mismatched fonts)
8. Text layout (name bold, roll number clearly visible, branch listed)
9. Card edges (no torn/pixelated borders suggesting a photocopy)
10. Overall print quality (no blurry text, no visible screen moiré)

Return STRICT JSON with this exact schema — no markdown, no commentary:
{
  "isAuthentic": boolean,
  "confidence": number (0-100),
  "name": string or null,
  "rollNumber": string or null,
  "branch": string or null,
  "reason": "concise explanation, max 2 sentences"
}

If any major red flag exists (wrong colors, missing logo, blurry text, obvious Photoshop), isAuthentic must be false.
Only return true if confidence >= 75 AND no major red flags.`;

export async function analyzeIdCard(imageUrl: string): Promise<IdAnalysis> {
  try {
    // Download image and convert to base64
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error('Failed to fetch image');
    const buffer = Buffer.from(await res.arrayBuffer());
    const base64 = buffer.toString('base64');
    const mimeType = res.headers.get('content-type') || 'image/jpeg';

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
    ]);

    const text = result.response.text().trim();
    // Strip markdown fences if any
    const cleaned = text.replace(/^```json\s*|```$/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      isAuthentic: Boolean(parsed.isAuthentic),
      confidence: Number(parsed.confidence) || 0,
      name: parsed.name || undefined,
      rollNumber: parsed.rollNumber || undefined,
      branch: parsed.branch || undefined,
      reason: parsed.reason || 'No reason provided',
    };
  } catch (err: any) {
    console.error('Gemini analysis error:', err);
    return {
      isAuthentic: false,
      confidence: 0,
      reason: `Analysis failed: ${err.message}`,
    };
  }
}