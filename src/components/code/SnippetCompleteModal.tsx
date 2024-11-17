import { useEffect, useCallback } from 'react';

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
    averageWordsPerMinute,
    wordsPerMinuteHistory,
    resetKeyboardProgress,
  } = useKeyboardStore();

  const { setNextSnippet } = useCodeSnippetStore();

  const onNextSnippetClicked = () => {
    setNextSnippet();
    resetKeyboardProgress();
  };

  const onModalClose = useCallback(() => {
    resetKeyboardProgress();
  }, [resetKeyboardProgress]);

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
  }, [isOpen, onModalClose]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-10"
      data-testid="SnippetCompleteModal"
    >
      <div className="bg-gray-600 text-white p-6 rounded-lg w-[80%] max-w-lg relative border">
        <button
          onClick={onModalClose}
          className="absolute top-2 right-2 m-2 text-white hover:text-opacity-50"
        >
          ✕
        </button>
        <p className="text-3xl font-bold mb-4">Snippet Complete!</p>
        <p className="text-xl">
          Characters Typed: <span className="text-blue-400">{charactersTyped}</span>
        </p>
        <p className="text-xl">
          Correct Characters: <span className="text-green-500">{correctCharacters}</span>
        </p>
        <p className="text-xl">
          Incorrect Characters:{' '}
          <span className="text-red-500">{incorrectCharacters}</span>
        </p>

        <p className="text-2xl mt-6">
          Words per minute (WPM): <span className="font-bold">{wordsPerMinute}</span>
        </p>
        <p className="text-2xl">
          Average WPM: <span className="font-bold">{averageWordsPerMinute}</span>
        </p>
        <p className="text-2xl">
          Last {wordsPerMinuteHistory.length >= 5 ? '5' : wordsPerMinuteHistory.length}{' '}
          WPM:{' '}
          <span className="font-bold">
            {wordsPerMinuteHistory.reverse().slice(0, 5).join(' ')}
          </span>
        </p>

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
