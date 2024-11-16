import useCodeSnippetStore from '@/store/codeSnippetStore';

export default function BottomBanner() {
  const { currentSnippet } = useCodeSnippetStore();

  const getLanguageLabel = () => {
    switch (currentSnippet?.language) {
      case 'cpp':
        return 'C++';
      case 'csharp':
        return 'C#';
      case 'java':
        return 'Java';
      case 'javascript':
        return 'JavaScript';
      case 'python':
        return 'Python';
      default:
        return '';
    }
  };

  return (
    <div className="absolute bottom-0 left-0 bg-slate-50 bg-opacity-10 w-full flex justify-center items-center">
      <div className="p-4 text-center">
        <p className="text-2xl mb-2">
          {getLanguageLabel()} | {currentSnippet?.description}
        </p>
        <p className="text-xl text-gray-400">
          Correctly type the first character to begin.
        </p>
      </div>
    </div>
  );
}
