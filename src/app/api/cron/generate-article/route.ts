import { NextRequest, NextResponse } from "next/server";
import { runPipeline } from "@/lib/pipeline/pipeline";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runPipeline();
    return NextResponse.json({
      success: true,
      articleId: result.articleId,
      title: result.title,
      slug: result.slug,
      topic: result.topic,
      steps: result.steps,
      totalMs: result.steps.reduce((s, st) => s + st.durationMs, 0),
    });
  } catch (error) {
    console.error("[cron/generate-article] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "알 수 없는 오류" },
      { status: 500 },
    );
  }
}
