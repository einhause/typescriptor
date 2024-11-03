import { useEffect } from 'react';

import useKeyboardStore from './store/keyboardStore';
import useCodeSnippetStore from './store/codeSnippetStore';
import DraggableKeyboard from './components/keyboard/DraggableKeyboard';
import CodeSection from './components/code/CodeSection';
import { Sidebar } from './components/sidebar/Sidebar';

export default function App() {
  const { handleKeyDown, handleKeyUp } = useKeyboardStore();
  const { fetchSnippets } = useCodeSnippetStore();

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    fetchSnippets();
  }, []);

  return (
    <div className="grid h-screen grid-cols-[1fr_auto]">
      <main className="flex flex-col">
        <div className="flex-grow w-full">
          <CodeSection />
        </div>
        <DraggableKeyboard />
      </main>
      <Sidebar />
    </div>
  );
}
