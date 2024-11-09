import { forwardRef, Fragment } from 'react';

import useKeyboardStore from '../../store/keyboardStore';
import useCodeSnippetStore from '../../store/codeSnippetStore';
import './CodeSection.css';
import ChangeSnippetButton from './ChangeSnippetButton';

const CodeSection = forwardRef<HTMLDivElement>((_, ref) => {
  const { currentCharIndex, incorrectKey } = useKeyboardStore();
  const { currentSnippet } = useCodeSnippetStore();

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
          <span className="relative inline-block">
            <span className="px-[0.25px]"></span>
            {renderCursor(isCurrentChar)}
          </span>
          <div />
        </Fragment>
      );

    if (char === '\t')
      return (
        <span key={index} className={`${textColor} ${backgroundColor}`}>
          {Array(4)
            .fill('\u00A0')
            .map((_, i) => (
              <span key={i}>&nbsp;</span>
            ))}
        </span>
      );

    return (
      <span key={index} className={`relative inline-block ${backgroundColor}`}>
        <span className={`${textColor} px-[.5px]`}>{char === ' ' ? '\u00A0' : char}</span>
        {renderCursor(isCurrentChar)}
      </span>
    );
  };

  return (
    <div className="relative" ref={ref}>
      <div className="absolute right-0 top-0 z-10 m-4">
        <ChangeSnippetButton changeSnippetDirection="prev" />
        <ChangeSnippetButton changeSnippetDirection="next" />
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full text-white tracking-tighter font-mono p-4 relative">
          {currentSnippet === null
            ? 'Loading Snippet...'
            : currentSnippet.code.split('').map((char, index) => renderChar(char, index))}
        </div>
      </div>
    </div>
  );
});

export default CodeSection;
