import { useEffect, useRef, useState } from 'react';

import useCodeSnippetStore from './store/codeSnippetStore';

import DraggableKeyboard from './components/keyboard/DraggableKeyboard';
import CodeSection from './components/code/CodeSection';
import { Sidebar } from './components/sidebar/Sidebar';

export default function App() {
  const { fetchSnippets } = useCodeSnippetStore();

  const [codeSectionWidth, setCodeSectionWidth] = useState<number>(0);
  const codeSectionContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width) {
          setCodeSectionWidth(entry.contentRect.width);
        }
      }
    });

    if (codeSectionContainerRef.current) {
      resizeObserver.observe(codeSectionContainerRef.current);
    }

    fetchSnippets();

    // Cleanup on component unmount
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="grid h-screen grid-cols-[1fr_auto]">
      <main className="flex flex-col mx-2 mt-2">
        <div
          className="h-[65vh] max-h-[65vh] overflow-y-auto border-white border rounded-lg bg-gray-800 max-w-screen relative"
          tabIndex={0}
          ref={codeSectionContainerRef}
        >
          <CodeSection />
        </div>
        <DraggableKeyboard codeSectionWidth={codeSectionWidth} />
      </main>
      <Sidebar />
    </div>
  );
}
