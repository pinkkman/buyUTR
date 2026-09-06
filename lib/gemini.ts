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
const SYSTEM_PROMPT = `You are an AI assistant that evaluates whether an uploaded university ID card appears visually consistent and plausible. You are NOT a definitive document-authentication authority and should not claim to verify authenticity with certainty.

Analyze the uploaded ID card image for visible consistency and possible signs of manipulation.

Check the following:

1. Institution identity
   - Look for the university name "${UNIVERSITY}" or recognizable institutional branding/logo.
   - Do not require the logo to be in a specific position because card designs may change across years.

2. Overall card design
   - Evaluate whether the layout looks like a coherent university ID card.
   - Do not assume a fixed color scheme. Different admission years, departments, or card versions may use different colors.

3. Student photograph
   - Check whether a passport-style student photo is present and reasonably integrated into the card.
   - Look for obvious visual signs of editing, unnatural boundaries, inconsistent lighting, or pasted/Photoshopped appearance.

4. Student information
   - Extract the student's name if clearly visible.
   - Extract the registration/roll number if clearly visible.
   - Extract the branch/department if clearly visible.
   - Do not mark the card suspicious merely because some fields differ between card versions.

5. Text and typography
   - Check whether text appears reasonably consistent and professionally formatted.
   - Look for obvious spelling errors, overlapping elements, inconsistent alignment, or suspicious font changes.
   - Do not require every card to use the exact same font.

6. Security and official elements
   - Check for any visible official features such as seals, signatures, stamps, barcodes, QR codes, holograms, registration details, or other institutional markings.
   - These features may vary by card generation, so their absence alone is NOT automatically proof that the card is fake.

7. Image manipulation
   - Look for obvious signs of tampering, including pasted text, altered numbers, inconsistent compression, unnatural edges, duplicated elements, or visibly edited areas.

8. Image quality
   - Consider whether poor quality is caused by the uploaded photo itself (blur, glare, camera noise, compression, screen capture, etc.).
   - Do NOT automatically classify a genuine-looking card as fake solely because the uploaded image is blurry or photographed from a screen.

Return STRICT JSON with this exact schema — no markdown, no commentary:

{
  "isAuthentic": boolean,
  "confidence": number,
  "name": string or null,
  "rollNumber": string or null,
  "branch": string or null,
  "reason": "concise explanation, maximum 2 sentences"
}

Important decision rules:
- Set isAuthentic to false only when there are clear visual inconsistencies, obvious manipulation, conflicting institutional information, or strong signs that the card does not appear to belong to "${UNIVERSITY}".
- Do NOT reject a card solely because its color scheme, layout, logo position, security features, or typography differs from another card version.
- If the card looks generally consistent but the image quality prevents a reliable decision, use a lower confidence score rather than inventing evidence.
- Only set isAuthentic to true when the visible information and overall design appear reasonably consistent and there are no obvious major signs of tampering.
- This is a visual plausibility assessment, not definitive proof of authenticity.
`;
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