import { useEffect, useRef, useState } from 'react';

import useKeyboardStore from './store/keyboardStore';
import useCodeSnippetStore from './store/codeSnippetStore';
import DraggableKeyboard from './components/keyboard/DraggableKeyboard';
import CodeSection from './components/code/CodeSection';
import { Sidebar } from './components/sidebar/Sidebar';

export default function App() {
  const { handleKeyDown, handleKeyUp } = useKeyboardStore();
  const { fetchSnippets } = useCodeSnippetStore();

  const codeSectionRef = useRef<HTMLDivElement | null>(null);
  const [codeSectionWidth, setCodeSectionWidth] = useState<number>(0);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width) {
          setCodeSectionWidth(entry.contentRect.width);
        }
      }
    });

    if (codeSectionRef.current) {
      resizeObserver.observe(codeSectionRef.current);
    }

    fetchSnippets();

    // Cleanup on component unmount
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="grid h-screen grid-cols-[1fr_auto]">
      <main className="flex flex-col">
        <div
          className="h-[66.6666667%] max-h-[66.6666667%] overflow-auto border-white border rounded-lg bg-gray-800 max-w-screen relative"
          tabIndex={0}
        >
          <CodeSection ref={codeSectionRef} />
        </div>
        <DraggableKeyboard codeSectionWidth={codeSectionWidth} />
      </main>
      <Sidebar />
    </div>
  );
}
