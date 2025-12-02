import { NextRequest, NextResponse } from "next/server";
import { createPost } from "../../../lib/posts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "JSON body가 필요합니다." },
        { status: 400 }
      );
    }

    const { title, content, summary, slug, source } = body as {
      title?: string;
      content?: string;
      summary?: string | null;
      slug?: string;
      source?: string | null;
    };

    if (!title || !content) {
      return NextResponse.json(
        { ok: false, error: "`title`과 `content`는 필수입니다." },
        { status: 400 }
      );
    }

    const post = await createPost({
      title,
      content,
      summary: summary ?? null,
      slug,
      source: source ?? "n8n"
    });

    return NextResponse.json(
      {
        ok: true,
        post: {
          id: post.id,
          slug: post.slug,
          url: `/posts/${post.slug}`
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}


