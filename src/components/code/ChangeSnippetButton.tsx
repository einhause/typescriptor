import { ChevronLeft, ChevronRight } from 'lucide-react';

import useCodeSnippetStore from '../../store/codeSnippetStore';

type ChangeSnippetButtonProps = {
  changeSnippetDirection: 'prev' | 'next';
};

export default function ChangeSnippetButton({
  changeSnippetDirection,
}: ChangeSnippetButtonProps) {
  const { setNextSnippet, setPrevSnippet } = useCodeSnippetStore();

  const handleChangeSnippetClicked = () => {
    if (changeSnippetDirection === 'prev') {
      setPrevSnippet();
    } else {
      setNextSnippet();
    }
  };

  return (
    <button
      type="button"
      onClick={handleChangeSnippetClicked}
      className="p-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 border border-indigo-300"
    >
      {changeSnippetDirection === 'prev' ? <ChevronLeft /> : <ChevronRight />}
    </button>
  );
}
