import React from "react";

interface MarkdownViewerProps {
  /**
   * 이미 HTML로 렌더링 가능한 문자열 (Blogger 스타일)
   * 예: `<p>본문...</p>\n<h2>소제목</h2>...`
   */
  content: string;
}

// 이제는 마크다운 파싱 대신, 전달받은 HTML을 그대로 렌더링합니다.
// (n8n/GPT에서 <p>, <h2>, <ol>, <li> 등 완성된 HTML을 넘겨주는 용도)
export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}



