import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef<Editor | null>(null)

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      initialValue=''
      init={{
        height: 500,
        menubar: false,
        skin: 'oxide-dark',
        content_css: 'dark',
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style:
          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }',
      }}
      value={value}
      onEditorChange={(content) => onChange(content)}
    />
  )
}

export default RichTextEditor
