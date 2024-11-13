import { useEffect } from 'react';

import useKeyboardStore from '@/store/keyboardStore';
import useCodeSnippetStore from '@/store/codeSnippetStore';

interface ModalProps {
  isOpen: boolean;
}

export default function SnippetCompleteModal({ isOpen }: ModalProps) {
  const {
    charactersTyped,
    wordsPerMinute,
    correctCharacters,
    incorrectCharacters,
    resetKeyboardProgress,
  } = useKeyboardStore();

  const { setNextSnippet } = useCodeSnippetStore();

  const onNextSnippetClicked = () => {
    setNextSnippet();
    resetKeyboardProgress();
  };

  const onModalClose = () => {
    resetKeyboardProgress();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onModalClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="bg-gray-600 text-white p-6 rounded-lg w-[80%] max-w-lg relative border">
        <button
          onClick={onModalClose}
          className="absolute top-2 right-2 m-2 text-white hover:text-opacity-50"
        >
          ✕
        </button>
        <p className="text-3xl font-bold mb-4">Snippet Complete!</p>
        <p className="text-2xl font-bold mb-4">
          Words per minute (WPM): <span className="underline">{wordsPerMinute}</span>
        </p>
        <p className="text-lg mb-1">Characters Typed: {charactersTyped}</p>
        <p>Correct Characters: {correctCharacters}</p>
        <p>Incorrect Characters: {incorrectCharacters}</p>
        <button
          onClick={onNextSnippetClicked}
          className="mt-4 bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded float-right"
        >
          Next Snippet
        </button>
      </div>
    </div>
  );
}
