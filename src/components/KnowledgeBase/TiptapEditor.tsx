import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import tippy from 'tippy.js';
import {
  H1Icon,
  H2Icon,
  H3Icon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon
} from '@heroicons/react/24/solid';

interface TiptapEditorProps {
  content: string;
  onChange: (json: string) => void;
}

const SlashCommands = Extension.create({
  name: 'slash-commands',
  addOptions() {
    return {
      suggestions: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestions,
      }),
    ];
  },
});

const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: 'Heading 1',
      icon: <H1Icon className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setHeading({ level: 1 })
          .run();
      },
    },
    {
      title: 'Heading 2',
      icon: <H2Icon className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setHeading({ level: 2 })
          .run();
      },
    },
    {
      title: 'Heading 3',
      icon: <H3Icon className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setHeading({ level: 3 })
          .run();
      },
    },
    {
      title: 'Bullet List',
      icon: <ListBulletIcon className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleBulletList()
          .run();
      },
    },
    {
      title: 'Numbered List',
      icon: <NumberedListIcon className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleOrderedList()
          .run();
      },
    },
  ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
};

const renderItems = () => {
  let component: any;
  let popup: any;

  return {
    onStart: (props: any) => {
      component = document.createElement('div');
      component.classList.add('slash-menu');

      props.items.forEach((item: any, index: number) => {
        const button = document.createElement('button');
        button.classList.add('slash-menu-item');
        if (index === props.selectedIndex) {
          button.classList.add('is-selected');
        }

        const text = document.createElement('span');
        text.textContent = item.title;

        button.appendChild(text);
        button.addEventListener('click', () => props.command(item));

        component.appendChild(button);
      });

      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },
    onUpdate: (props: any) => {
      const buttons = component.querySelectorAll('.slash-menu-item');
      buttons.forEach((button: Element, index: number) => {
        if (index === props.selectedIndex) {
          button.classList.add('is-selected');
        } else {
          button.classList.remove('is-selected');
        }
      });
    },
    onKeyDown: (props: any) => {
      if (props.event.key === 'Escape') {
        popup[0].hide();
        return true;
      }
      return false;
    },
    onExit: () => {
      popup[0].destroy();
      component = null;
    },
  };
};

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing... (Type / for commands)',
        emptyEditorClass: 'is-editor-empty',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      SlashCommands.configure({
        suggestions: {
          items: getSuggestionItems,
          render: renderItems
        },
      }),
    ],
    content: content ? JSON.parse(content) : '',
    editorProps: {
      attributes: {
        class: 'prose prose-base sm:prose-lg focus:outline-none max-w-none min-h-[500px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="relative">
      <style>
        {`
          .is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #adb5bd;
            pointer-events: none;
            height: 0;
          }
          .bubble-menu {
            display: flex;
            gap: 0.5rem;
            background-color: white;
            padding: 0.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border: 1px solid #e5e7eb;
          }
          .bubble-menu button {
            padding: 0.25rem;
            border-radius: 0.25rem;
            color: #4b5563;
          }
          .bubble-menu button:hover {
            background-color: #f3f4f6;
          }
          .bubble-menu button.is-active {
            color: #2563eb;
            background-color: #eff6ff;
          }
          .slash-menu {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 0.5rem;
            overflow-y: auto;
            max-height: 20rem;
          }
          
          .slash-menu-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            border-radius: 0.25rem;
            width: 100%;
            text-align: left;
          }
          
          .slash-menu-item:hover,
          .slash-menu-item.is-selected {
            background: #f3f4f6;
          }
        `}
      </style>

      {editor && (
        <BubbleMenu 
          className="bubble-menu" 
          tippyOptions={{ duration: 100 }} 
          editor={editor}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            <BoldIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            <ItalicIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          >
            <H1Icon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          >
            <H2Icon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          >
            <H3Icon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            <ListBulletIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
          >
            <NumberedListIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const url = window.prompt('Enter URL')
              if (url) {
                editor.chain().focus().setLink({ href: url }).run()
              }
            }}
            className={editor.isActive('link') ? 'is-active' : ''}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor; 