import { ChevronLeft, ChevronRight } from 'lucide-react';

import useKeyboardStore from '../../store/keyboardStore';
import useCodeSnippetStore from '../../store/codeSnippetStore';

type ChangeSnippetButtonProps = {
  changeSnippetDirection: 'prev' | 'next';
};

export default function ChangeSnippetButton({
  changeSnippetDirection,
}: ChangeSnippetButtonProps) {
  const { setNextSnippet, setPrevSnippet } = useCodeSnippetStore();
  const { showModal } = useKeyboardStore();

  const handleChangeSnippetClicked = () => {
    if (showModal) return;

    if (changeSnippetDirection === 'prev') {
      setPrevSnippet();
    } else {
      setNextSnippet();
    }
  };

  return (
    <button
      type="button"
      data-testid={`${changeSnippetDirection}`}
      onClick={handleChangeSnippetClicked}
      className={`p-1.5 mx-1 rounded-lg bg-blue-900 hover:bg-blue-800 border border-indigo-300 ${
        showModal && 'cursor-not-allowed'
      }`}
    >
      {changeSnippetDirection === 'prev' ? <ChevronLeft /> : <ChevronRight />}
    </button>
  );
}
