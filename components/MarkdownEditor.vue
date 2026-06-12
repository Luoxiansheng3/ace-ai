<template>
  <div class="md-editor">
    <!-- Toolbar -->
    <div class="md-editor__toolbar">
      <div class="md-editor__toolbar-group">
        <button
          v-for="action in toolbarActions"
          :key="action.label"
          class="md-editor__toolbar-btn"
          :title="action.title"
          type="button"
          @click="action.handler"
        >
          <span v-html="action.icon" />
        </button>
      </div>
      <div class="md-editor__toolbar-group md-editor__toolbar-group--right">
        <button
          class="md-editor__toolbar-btn md-editor__toolbar-btn--accent"
          title="Import HTML"
          type="button"
          @click="showHtmlImport = true"
        >
          &lt;/&gt; Import
        </button>
        <button
          class="md-editor__toolbar-btn md-editor__toolbar-btn--accent"
          title="WeChat Format"
          type="button"
          @click="applyWechatFormat"
        >
          WeChat
        </button>
      </div>
    </div>

    <!-- Mobile tabs -->
    <div class="md-editor__tabs">
      <button
        class="md-editor__tab"
        :class="{ 'md-editor__tab--active': mobileTab === 'edit' }"
        type="button"
        @click="mobileTab = 'edit'"
      >
        Edit
      </button>
      <button
        class="md-editor__tab"
        :class="{ 'md-editor__tab--active': mobileTab === 'preview' }"
        type="button"
        @click="mobileTab = 'preview'"
      >
        Preview
      </button>
    </div>

    <!-- Split pane -->
    <div class="md-editor__split">
      <!-- Editor pane -->
      <div
        class="md-editor__pane md-editor__pane--editor"
        :class="{ 'md-editor__pane--hidden-mobile': mobileTab !== 'edit' }"
      >
        <div class="md-editor__line-numbers" ref="lineNumbersRef">
          <div
            v-for="n in lineCount"
            :key="n"
            class="md-editor__line-number"
          >
            {{ n }}
          </div>
        </div>
        <textarea
          ref="textareaRef"
          class="md-editor__textarea"
          :value="modelValue"
          :placeholder="placeholder || 'Write your markdown here...'"
          @input="onInput"
          @keydown="onKeydown"
          @scroll="syncScroll"
          spellcheck="false"
        />
      </div>

      <!-- Preview pane -->
      <div
        class="md-editor__pane md-editor__pane--preview"
        :class="{ 'md-editor__pane--hidden-mobile': mobileTab !== 'preview' }"
      >
        <ClientOnly>
          <div
            class="md-editor__preview-content prose-dark"
            v-html="renderedHtml"
          />
          <template #fallback>
            <div class="md-editor__preview-fallback">
              <span class="md-editor__spinner" />
              Loading preview...
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- HTML Import Dialog -->
    <Teleport to="body">
      <div
        v-if="showHtmlImport"
        class="md-editor__overlay"
        @click.self="showHtmlImport = false"
      >
        <div class="md-editor__dialog">
          <div class="md-editor__dialog-header">
            <h3>Import HTML</h3>
            <button
              class="md-editor__dialog-close"
              type="button"
              @click="showHtmlImport = false"
            >
              &times;
            </button>
          </div>
          <p class="md-editor__dialog-desc">
            Paste HTML content below. It will be converted to Markdown and
            inserted at the current cursor position.
          </p>
          <textarea
            v-model="htmlInput"
            class="md-editor__dialog-textarea"
            placeholder="<h1>Title</h1>&#10;<p>Paste your HTML here...</p>"
            rows="12"
          />
          <div class="md-editor__dialog-actions">
            <button
              class="md-editor__btn md-editor__btn--cancel"
              type="button"
              @click="showHtmlImport = false"
            >
              Cancel
            </button>
            <button
              class="md-editor__btn md-editor__btn--import"
              type="button"
              @click="importHtml"
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const { renderMarkdown, htmlToMarkdown } = useMarkdown();

// Refs
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const lineNumbersRef = ref<HTMLDivElement | null>(null);

// State
const showHtmlImport = ref(false);
const htmlInput = ref('');
const mobileTab = ref<'edit' | 'preview'>('edit');

// Computed
const renderedHtml = computed(() => {
  if (!props.modelValue) return '<p class="md-editor__empty">Nothing to preview yet...</p>';
  return renderMarkdown(props.modelValue);
});

const lineCount = computed(() => {
  if (!props.modelValue) return 1;
  return props.modelValue.split('\n').length;
});

// Toolbar actions
const toolbarActions = [
  {
    label: 'bold',
    title: 'Bold (Ctrl+B)',
    icon: '<b>B</b>',
    handler: () => wrapSelection('**', '**', 'bold text'),
  },
  {
    label: 'italic',
    title: 'Italic (Ctrl+I)',
    icon: '<i>I</i>',
    handler: () => wrapSelection('*', '*', 'italic text'),
  },
  {
    label: 'h1',
    title: 'Heading 1',
    icon: 'H1',
    handler: () => insertAtLineStart('# ', 'Heading 1'),
  },
  {
    label: 'h2',
    title: 'Heading 2',
    icon: 'H2',
    handler: () => insertAtLineStart('## ', 'Heading 2'),
  },
  {
    label: 'h3',
    title: 'Heading 3',
    icon: 'H3',
    handler: () => insertAtLineStart('### ', 'Heading 3'),
  },
  {
    label: 'link',
    title: 'Link',
    icon: '&#128279;',
    handler: () => wrapSelection('[', '](https://)', 'link text'),
  },
  {
    label: 'image',
    title: 'Image',
    icon: '&#128247;',
    handler: () => insertText('![alt text](https://image-url.com/image.png)'),
  },
  {
    label: 'code',
    title: 'Code Block',
    icon: '{ }',
    handler: () => wrapSelection('\n```\n', '\n```\n', 'code here'),
  },
  {
    label: 'inline-code',
    title: 'Inline Code',
    icon: '`',
    handler: () => wrapSelection('`', '`', 'code'),
  },
  {
    label: 'list',
    title: 'Unordered List',
    icon: '&#8226;',
    handler: () => insertAtLineStart('- ', 'List item'),
  },
  {
    label: 'quote',
    title: 'Blockquote',
    icon: '&#10077;',
    handler: () => insertAtLineStart('> ', 'Quote text'),
  },
  {
    label: 'hr',
    title: 'Horizontal Rule',
    icon: '&#8213;',
    handler: () => insertText('\n---\n'),
  },
];

// Input handling
function onInput(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
}

function onKeydown(e: KeyboardEvent) {
  // Ctrl+B for bold
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    wrapSelection('**', '**', 'bold text');
  }
  // Ctrl+I for italic
  if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
    e.preventDefault();
    wrapSelection('*', '*', 'italic text');
  }
  // Tab to insert spaces
  if (e.key === 'Tab') {
    e.preventDefault();
    insertText('  ');
  }
}

// Editor helpers
function getSelection(): { start: number; end: number; selected: string } {
  const textarea = textareaRef.value;
  if (!textarea) return { start: 0, end: 0, selected: '' };
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = props.modelValue.slice(start, end);
  return { start, end, selected };
}

function replaceRange(start: number, end: number, replacement: string) {
  const before = props.modelValue.slice(0, start);
  const after = props.modelValue.slice(end);
  const newValue = before + replacement + after;
  emit('update:modelValue', newValue);

  nextTick(() => {
    const textarea = textareaRef.value;
    if (textarea) {
      const cursorPos = start + replacement.length;
      textarea.selectionStart = cursorPos;
      textarea.selectionEnd = cursorPos;
      textarea.focus();
    }
  });
}

function wrapSelection(before: string, after: string, placeholder: string) {
  const { start, end, selected } = getSelection();
  const text = selected || placeholder;
  const replacement = before + text + after;
  replaceRange(start, end, replacement);

  if (!selected) {
    nextTick(() => {
      const textarea = textareaRef.value;
      if (textarea) {
        textarea.selectionStart = start + before.length;
        textarea.selectionEnd = start + before.length + text.length;
      }
    });
  }
}

function insertAtLineStart(prefix: string, placeholder: string) {
  const { start, end, selected } = getSelection();
  const text = selected || placeholder;

  // Check if we're at the beginning of a line
  const beforeCursor = props.modelValue.slice(0, start);
  const lastNewline = beforeCursor.lastIndexOf('\n');
  const isAtLineStart = lastNewline === start - 1 || start === 0;

  let replacement: string;
  let newStart: number;

  if (isAtLineStart) {
    replacement = prefix + text;
    newStart = start;
  } else {
    replacement = '\n' + prefix + text;
    newStart = start + 1;
  }

  replaceRange(start, end, replacement);

  if (!selected) {
    nextTick(() => {
      const textarea = textareaRef.value;
      if (textarea) {
        textarea.selectionStart = newStart + prefix.length;
        textarea.selectionEnd = newStart + prefix.length + text.length;
      }
    });
  }
}

function insertText(text: string) {
  const { start, end } = getSelection();
  replaceRange(start, end, text);
}

// HTML Import
async function importHtml() {
  if (!htmlInput.value.trim()) return;

  const markdown = htmlToMarkdown(htmlInput.value);
  const { start, end } = getSelection();
  replaceRange(start, end, markdown);

  htmlInput.value = '';
  showHtmlImport.value = false;
}

// WeChat Format
function applyWechatFormat() {
  const { start, end, selected } = getSelection();
  if (!selected) {
    // If nothing selected, wrap a sample block
    const formatted =
      '<section style="font-size:16px;color:#333333;line-height:1.8;letter-spacing:0.5px;font-family:-apple-system,BlinkMacSystemFont,\'Helvetica Neue\',\'PingFang SC\',\'Microsoft YaHei\',sans-serif;">\n' +
      '  <p style="margin:1em 0;text-align:justify;">Your content here</p>\n' +
      '</section>';
    replaceRange(start, end, formatted);
    return;
  }

  // Wrap selected markdown in WeChat-compatible inline styles
  const formatted =
    '<section style="font-size:16px;color:#333333;line-height:1.8;letter-spacing:0.5px;font-family:-apple-system,BlinkMacSystemFont,\'Helvetica Neue\',\'PingFang SC\',\'Microsoft YaHei\',sans-serif;">\n' +
    selected +
    '\n</section>';
  replaceRange(start, end, formatted);
}

// Scroll sync
function syncScroll() {
  const textarea = textareaRef.value;
  const lineNumbers = lineNumbersRef.value;
  if (textarea && lineNumbers) {
    lineNumbers.scrollTop = textarea.scrollTop;
  }
}
</script>

<style scoped>
.md-editor {
  --md-bg-page: #0a0a0f;
  --md-bg-sidebar: #12121a;
  --md-bg-card: #161622;
  --md-bg-editor: #0a0a14;
  --md-bg-preview: #0f0f1a;
  --md-border: #2a2a3a;
  --md-green: #00ff88;
  --md-green-dim: rgba(0, 255, 136, 0.15);
  --md-text: #ffffff;
  --md-text-muted: #9ca3af;
  --md-text-dim: #6b7280;
  --md-font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', ui-monospace,
    SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  border: 1px solid var(--md-border);
  border-radius: 0.75rem;
  overflow: hidden;
  font-family: var(--md-font-mono);
  background: var(--md-bg-editor);
}

/* ===== Toolbar ===== */
.md-editor__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: var(--md-bg-card);
  border-bottom: 1px solid var(--md-border);
  flex-wrap: wrap;
}

.md-editor__toolbar-group {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  flex-wrap: wrap;
}

.md-editor__toolbar-group--right {
  margin-left: auto;
}

.md-editor__toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.4rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  background: transparent;
  color: var(--md-text-muted);
  font-family: var(--md-font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.md-editor__toolbar-btn:hover {
  color: var(--md-green);
  background: var(--md-green-dim);
  border-color: rgba(0, 255, 136, 0.25);
}

.md-editor__toolbar-btn:active {
  transform: scale(0.95);
}

.md-editor__toolbar-btn--accent {
  color: var(--md-green);
  border-color: rgba(0, 255, 136, 0.2);
  padding: 0 0.6rem;
}

.md-editor__toolbar-btn--accent:hover {
  background: var(--md-green-dim);
  border-color: var(--md-green);
}

/* ===== Mobile Tabs ===== */
.md-editor__tabs {
  display: none;
  border-bottom: 1px solid var(--md-border);
  background: var(--md-bg-sidebar);
}

.md-editor__tab {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  background: transparent;
  color: var(--md-text-dim);
  font-family: var(--md-font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  border-bottom: 2px solid transparent;
}

.md-editor__tab--active {
  color: var(--md-green);
  border-bottom-color: var(--md-green);
}

@media (max-width: 768px) {
  .md-editor__tabs {
    display: flex;
  }
}

/* ===== Split Pane ===== */
.md-editor__split {
  display: flex;
  min-height: 420px;
  max-height: 70vh;
}

.md-editor__pane {
  flex: 1;
  min-width: 0;
  position: relative;
}

.md-editor__pane--editor {
  display: flex;
  border-right: 1px solid var(--md-border);
}

.md-editor__pane--preview {
  overflow-y: auto;
  background: var(--md-bg-preview);
}

@media (max-width: 768px) {
  .md-editor__split {
    flex-direction: column;
  }

  .md-editor__pane--editor {
    border-right: none;
  }

  .md-editor__pane--hidden-mobile {
    display: none !important;
  }
}

/* ===== Line Numbers ===== */
.md-editor__line-numbers {
  width: 3rem;
  padding: 1rem 0.5rem 1rem 0;
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid var(--md-border);
  overflow: hidden;
  user-select: none;
  flex-shrink: 0;
}

.md-editor__line-number {
  height: 1.625rem;
  line-height: 1.625rem;
  text-align: right;
  font-size: 0.7rem;
  color: var(--md-text-dim);
  font-family: var(--md-font-mono);
}

/* ===== Textarea ===== */
.md-editor__textarea {
  flex: 1;
  width: 100%;
  padding: 1rem;
  border: none;
  outline: none;
  resize: none;
  background: var(--md-bg-editor);
  color: var(--md-text);
  font-family: var(--md-font-mono);
  font-size: 0.875rem;
  line-height: 1.625rem;
  caret-color: var(--md-green);
  tab-size: 2;
  min-height: 420px;
}

.md-editor__textarea::placeholder {
  color: var(--md-text-dim);
}

.md-editor__textarea::-webkit-scrollbar {
  width: 6px;
}

.md-editor__textarea::-webkit-scrollbar-track {
  background: transparent;
}

.md-editor__textarea::-webkit-scrollbar-thumb {
  background: var(--md-border);
  border-radius: 3px;
}

/* ===== Preview ===== */
.md-editor__preview-content {
  padding: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--md-text);
  line-height: 1.7;
}

.md-editor__preview-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  height: 100%;
  min-height: 420px;
  color: var(--md-text-dim);
  font-family: var(--md-font-mono);
  font-size: 0.85rem;
}

.md-editor__spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--md-border);
  border-top-color: var(--md-green);
  border-radius: 50%;
  animation: md-spin 0.6s linear infinite;
}

@keyframes md-spin {
  to {
    transform: rotate(360deg);
  }
}

.md-editor__empty {
  color: var(--md-text-dim);
  font-style: italic;
}

/* ===== Prose Dark Styles ===== */
.prose-dark :deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  margin: 1.5rem 0 1rem;
  color: var(--md-text);
  border-bottom: 1px solid var(--md-border);
  padding-bottom: 0.5rem;
  font-family: var(--md-font-mono);
}

.prose-dark :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.25rem 0 0.75rem;
  color: var(--md-text);
  font-family: var(--md-font-mono);
}

.prose-dark :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  color: var(--md-text);
  font-family: var(--md-font-mono);
}

.prose-dark :deep(p) {
  margin: 0.75rem 0;
  color: var(--md-text-muted);
}

.prose-dark :deep(a) {
  color: var(--md-green);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.prose-dark :deep(a:hover) {
  opacity: 0.8;
}

.prose-dark :deep(strong) {
  color: var(--md-text);
  font-weight: 700;
}

.prose-dark :deep(em) {
  color: var(--md-text-muted);
  font-style: italic;
}

.prose-dark :deep(code) {
  background: rgba(0, 255, 136, 0.08);
  color: var(--md-green);
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  font-family: var(--md-font-mono);
  font-size: 0.85em;
}

.prose-dark :deep(pre) {
  background: #0d0d15;
  border: 1px solid var(--md-border);
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  margin: 1rem 0;
  overflow-x: auto;
}

.prose-dark :deep(pre code) {
  background: none;
  padding: 0;
  border-radius: 0;
  color: var(--md-text-muted);
  font-size: 0.825rem;
  line-height: 1.6;
}

.prose-dark :deep(blockquote) {
  border-left: 3px solid var(--md-green);
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background: rgba(0, 255, 136, 0.04);
  border-radius: 0 0.375rem 0.375rem 0;
}

.prose-dark :deep(blockquote p) {
  color: var(--md-text-muted);
  margin: 0.25rem 0;
}

/* === List styles using CSS counters + ::before (bulletproof alignment) === */

.prose-dark :deep(ul),
.prose-dark :deep(ol) {
  margin: 0.75rem 0;
  color: var(--md-text-muted);
  list-style: none;
  padding-left: 0;
}

.prose-dark :deep(li) {
  margin: 0.35rem 0;
  line-height: 1.7;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.prose-dark :deep(ul li::before) {
  content: "•";
  flex-shrink: 0;
  width: 1.5rem;
  text-align: center;
  color: var(--md-text-dim);
  font-weight: bold;
  line-height: 1.7;
}

.prose-dark :deep(ol) {
  counter-reset: md-ol;
}

.prose-dark :deep(ol li) {
  counter-increment: md-ol;
}

.prose-dark :deep(ol li::before) {
  content: counter(md-ol) ".";
  flex-shrink: 0;
  width: 1.5rem;
  text-align: right;
  color: var(--md-text-dim);
  font-variant-numeric: tabular-nums;
  line-height: 1.7;
}

.prose-dark :deep(hr) {
  border: none;
  border-top: 1px solid var(--md-border);
  margin: 1.5rem 0;
}

.prose-dark :deep(img) {
  max-width: 100%;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.prose-dark :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.prose-dark :deep(th),
.prose-dark :deep(td) {
  border: 1px solid var(--md-border);
  padding: 0.5rem 0.75rem;
  text-align: left;
  color: var(--md-text-muted);
}

.prose-dark :deep(th) {
  background: var(--md-bg-card);
  color: var(--md-text);
  font-weight: 600;
}

/* ===== Dialog / Overlay ===== */
.md-editor__overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.md-editor__dialog {
  width: 90%;
  max-width: 600px;
  background: var(--md-bg-card);
  border: 1px solid var(--md-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  font-family: var(--md-font-mono);
}

.md-editor__dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.md-editor__dialog-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--md-green);
}

.md-editor__dialog-close {
  background: none;
  border: none;
  color: var(--md-text-dim);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 0.25rem;
  transition: color 0.15s;
}

.md-editor__dialog-close:hover {
  color: var(--md-text);
}

.md-editor__dialog-desc {
  color: var(--md-text-dim);
  font-size: 0.8rem;
  margin: 0 0 1rem;
  line-height: 1.5;
}

.md-editor__dialog-textarea {
  width: 100%;
  padding: 0.75rem;
  background: var(--md-bg-editor);
  color: var(--md-text);
  border: 1px solid var(--md-border);
  border-radius: 0.5rem;
  font-family: var(--md-font-mono);
  font-size: 0.825rem;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  caret-color: var(--md-green);
  box-sizing: border-box;
}

.md-editor__dialog-textarea:focus {
  border-color: rgba(0, 255, 136, 0.4);
}

.md-editor__dialog-textarea::placeholder {
  color: var(--md-text-dim);
}

.md-editor__dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.md-editor__btn {
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-family: var(--md-font-mono);
  font-size: 0.825rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
}

.md-editor__btn--cancel {
  background: transparent;
  color: var(--md-text-muted);
  border-color: var(--md-border);
}

.md-editor__btn--cancel:hover {
  color: var(--md-text);
  border-color: var(--md-text-dim);
}

.md-editor__btn--import {
  background: var(--md-green);
  color: #0a0a0f;
  border-color: var(--md-green);
}

.md-editor__btn--import:hover {
  opacity: 0.85;
  box-shadow: 0 0 16px rgba(0, 255, 136, 0.3);
}
</style>
