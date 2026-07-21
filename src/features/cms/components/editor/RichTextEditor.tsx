"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import { cn } from "@/shared/lib/cn";
import { EditorToolbar } from "@/features/cms/components/editor/EditorToolbar";
import { MediaPickerModal } from "@/features/cms/components/media/MediaPickerModal";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  invalid?: boolean;
}

const CONTENT_CLASSES =
  "min-h-72 px-4 py-3 text-sm leading-relaxed text-neutral-900 focus:outline-none dark:text-neutral-100 [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-600 [&_a]:text-accent [&_a]:underline [&_hr]:my-6 [&_hr]:border-neutral-200 [&_img]:my-3 [&_img]:rounded-lg";

export function RichTextEditor({ value, onChange, invalid }: RichTextEditorProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder: "Write your story…" }),
    ],
    content: value,
    editorProps: { attributes: { class: CONTENT_CLASSES } },
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
  });

  // Keep the editor in sync when the value is reset externally (e.g. after
  // loading an existing article for editing).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-white dark:bg-neutral-950",
        invalid ? "border-error" : "border-neutral-300 dark:border-neutral-700",
      )}
    >
      <EditorToolbar editor={editor} onPickImage={() => setPickerOpen(true)} />
      <EditorContent editor={editor} />
      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          editor.chain().focus().setImage({ src: url }).run();
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
