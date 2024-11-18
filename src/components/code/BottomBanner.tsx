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
      case 'typescript':
        return 'TypeScript';
      default:
        return '';
    }
  };

  return (
    <div
      className="absolute bottom-0 left-0 bg-blue-900 bg-opacity-50 w-full flex justify-center items-center"
      data-testid="BottomBanner"
    >
      <div className="p-4 text-center">
        <p className="text-2xl mb-2">
          <span className="font-bold">{getLanguageLabel()}</span> |{' '}
          {currentSnippet?.description}
        </p>
        <p className="text-md text-gray-400">
          Correctly type the first character to begin.
        </p>
      </div>
    </div>
  );
}
