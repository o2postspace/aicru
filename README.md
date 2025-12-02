# AI 큐레이터 칼럼 사이트

Next.js 14 + Vercel로 동작하는, n8n에서 AI가 생성한 칼럼을 HTTP POST로 받아서 노출하는 간단한 아카이브입니다.

## 로컬 개발

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## API 엔드포인트

- **URL (로컬)**: `POST http://localhost:3000/api/posts`
- **URL (Vercel 배포 후 예시)**: `POST https://<your-vercel-domain>/api/posts`

### Request (JSON)

```json
{
  "title": "칼럼 제목",
  "content": "# 마크다운 또는 일반 텍스트 본문",
  "summary": "선택: 리스트에 보여줄 짧은 요약",
  "slug": "선택: URL에 사용할 슬러그 (미지정 시 title 기반으로 자동 생성)",
  "source": "선택: n8n, gpt-4.1 등 출처 태그"
}
```

- **필수**: `title`, `content`
- **응답 예시** (`201 Created`)

```json
{
  "ok": true,
  "post": {
    "id": "generated-id",
    "slug": "생성된-슬러그",
    "url": "/posts/생성된-슬러그"
  }
}
```

이 `url`을 n8n에서 후속 단계에 활용하여 바로 링크로 전달할 수 있습니다.

## n8n 연동 간단 예시

1. **HTTP Request 노드**
   - Method: `POST`
   - URL: `https://<your-vercel-domain>/api/posts`
   - Content Type: `JSON`
   - Body:
     - `title`: GPT 결과 중 제목 필드
     - `content`: GPT가 생성한 전체 칼럼(마크다운 가능)
     - `summary`: (선택) 서머리
     - `source`: `"n8n"` 또는 사용 중인 모델 이름

2. 성공 시 응답의 `data.post.url` 값을 다음 노드(예: Slack/Discord/Webhook 등)에 넘겨서
   - “새 칼럼이 발행되었습니다: https://<domain><url>” 형식으로 안내할 수 있습니다.

## 주의 (스토리지)

현재 예제는 `lib/posts.ts`에서 **프로세스 메모리**에만 글을 저장합니다.

- 로컬 개발/테스트에는 충분하지만, Vercel 서버리스 환경에서는 인스턴스 재시작/스케일 시 데이터가 유지되지 않을 수 있습니다.
- 실제 운영 시에는 Vercel KV, Postgres, PlanetScale 등 DB나 외부 스토리지를 붙여서 `createPost` 구현을 교체하는 것을 권장합니다.


