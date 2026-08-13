import { splitArticleParagraphs } from "@/features/article/utils/article.utils";

interface ArticleBodyProps {
  content: string;
}

/** Content authored in the CMS is HTML; legacy content may be plain text. */
function isHtmlContent(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

export function ArticleBody({ content }: ArticleBodyProps) {
  if (isHtmlContent(content)) {
    return (
      <div
        className="article-prose"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  const paragraphs = splitArticleParagraphs(content);

  if (!paragraphs.length) {
    return (
      <p className="whitespace-pre-wrap text-base leading-8 text-neutral-700">
        {content}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${index}-${paragraph.slice(0, 24)}`}
          className={
            index === 0
              ? "font-serif text-lg leading-8 text-ink first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-accent"
              : "text-base leading-8 text-neutral-700"
          }
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
