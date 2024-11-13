import { useEffect, useRef, Fragment } from 'react';

import useKeyboardStore from '../../store/keyboardStore';
import useCodeSnippetStore from '../../store/codeSnippetStore';

import ChangeSnippetButton from './ChangeSnippetButton';
import BottomBanner from './BottomBanner';
import SnippetCompleteModal from './SnippetCompleteModal';

import './CodeSection.css';

export default function CodeSection() {
  const { currentCharIndex, incorrectKey, showModal } = useKeyboardStore();
  const { currentSnippet } = useCodeSnippetStore();

  const codeSectionRef = useRef<HTMLDivElement | null>(null);
  const currentCharRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (currentCharRef.current) {
      currentCharRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentCharIndex]);

  // Scroll to the top when the snippet is completed
  useEffect(() => {
    if (showModal && codeSectionRef.current) {
      codeSectionRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showModal]);

  const renderCursor = (isCurrentChar: boolean) =>
    isCurrentChar && (
      <span
        className={`absolute top-0 left-full w-0.5 h-6 animate-blink ${
          incorrectKey ? 'bg-red-500' : 'bg-slate-300'
        }`}
      />
    );

  const renderChar = (char: string, index: number) => {
    const isCurrentChar = index === currentCharIndex;
    const isCorrect = index < currentCharIndex;
    const textColor =
      isCurrentChar && incorrectKey
        ? 'text-red-500'
        : isCorrect
        ? 'text-green-500'
        : 'text-white';
    const backgroundColor = isCurrentChar
      ? incorrectKey
        ? 'bg-red-100'
        : 'bg-gray-700'
      : 'bg-transparent';

    if (char === '\n')
      return (
        <Fragment key={index}>
          <span
            className="relative inline-block"
            ref={isCurrentChar ? currentCharRef : null}
          >
            <span className="px-[0.25px]"></span>
            {renderCursor(isCurrentChar)}
          </span>
          <div />
        </Fragment>
      );

    if (char === '\t')
      return (
        <span
          key={index}
          className={`${textColor} ${backgroundColor}`}
          ref={isCurrentChar ? currentCharRef : null}
        >
          {Array(4)
            .fill('\u00A0')
            .map((_, i) => (
              <span key={i}>&nbsp;</span>
            ))}
        </span>
      );

    return (
      <span
        key={index}
        className={`relative inline-block ${backgroundColor}`}
        ref={isCurrentChar ? currentCharRef : null}
      >
        <span className={`${textColor} px-[.5px]`}>{char === ' ' ? '\u00A0' : char}</span>
        {renderCursor(isCurrentChar)}
      </span>
    );
  };

  return (
    <>
      <SnippetCompleteModal isOpen={showModal} />
      <div className="absolute right-0 top-0 z-10 m-4">
        <ChangeSnippetButton changeSnippetDirection="prev" />
        <ChangeSnippetButton changeSnippetDirection="next" />
      </div>
      <div className="relative overflow-y-auto p-4 max-h-full" ref={codeSectionRef}>
        <div className="w-full text-white tracking-tighter font-mono p-2">
          {currentSnippet === null
            ? 'Loading Snippet...'
            : currentSnippet.code.split('').map((char, index) => renderChar(char, index))}
        </div>
      </div>
      {currentCharIndex === 0 && <BottomBanner />}
    </>
  );
}
