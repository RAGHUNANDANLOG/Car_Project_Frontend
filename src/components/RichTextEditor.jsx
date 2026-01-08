import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const RichTextEditor = ({ 
  label, 
  value = '', 
  onChange, 
  error,
  placeholder = 'Start typing...',
  required = false
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-neon-pink ml-1">*</span>}
        </label>
      )}
      <div className={`rounded-xl overflow-hidden border transition-all ${
        error ? 'border-red-500/50' : 'border-slate-700/50'
      }`}>
        <CKEditor
          editor={ClassicEditor}
          data={value}
          config={{
            placeholder,
            toolbar: [
              'heading', '|',
              'bold', 'italic', 'underline', '|',
              'bulletedList', 'numberedList', '|',
              'blockQuote', 'link', '|',
              'undo', 'redo'
            ]
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            onChange(data);
          }}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default RichTextEditor;



