import OpenAI from "openai";

export type ModelTier = "fast" | "quality";

const MODEL_IDS: Record<ModelTier, string> = {
  fast: "google/gemini-2.5-flash",
  quality: "anthropic/claude-sonnet-4",
};

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY 환경변수가 설정되지 않았습니다.");
  if (!_client) {
    _client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
      defaultHeaders: {
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_SITE_URL ?? "https://stock.plentyer.com",
        "X-Title": "stock-diary",
      },
    });
  }
  return _client;
}

export async function callLLM(opts: {
  tier: ModelTier;
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const client = getClient();
  const res = await client.chat.completions.create({
    model: MODEL_IDS[opts.tier],
    messages: [
      { role: "system" as const, content: opts.system },
      { role: "user" as const, content: opts.user },
    ],
    max_completion_tokens: opts.maxTokens ?? 4096,
    temperature: opts.temperature ?? 0.7,
  });

  return res.choices[0]?.message?.content ?? "";
}

export function extractJSON<T = unknown>(raw: string): T {
  let text = raw.trim();
  const m = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (m) text = m[1].trim();
  return JSON.parse(text);
}
