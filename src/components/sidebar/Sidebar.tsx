import {
  ChevronLeft,
  CodeXml,
  SlidersHorizontal,
  ArrowUpDown,
  LucideIcon,
  CircleEllipsis,
} from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';

import useCodeSnippetStore, {
  SortType,
  LanguageFilter,
  AutoOptions,
} from '@/store/codeSnippetStore';

import Checkbox from './input/Checkbox';
import CodeLengthSlider from './input/CodeLengthSlider';
import Radio from './input/Radio';

export function Sidebar() {
  const codeSnippetStore = useCodeSnippetStore();

  const [expanded, setExpanded] = useState<boolean>(false);
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>(
    codeSnippetStore.languageFilter
  );
  const [minCodeSnippetLength, setMinCodeSnippetLength] = useState<number>(
    codeSnippetStore.minCodeSnippetLength
  );
  const [maxCodeSnippetLength, setMaxCodeSnippetLength] = useState<number>(
    codeSnippetStore.maxCodeSnippetLength
  );
  const [sortType, setFormType] = useState<SortType>(codeSnippetStore.sortType);
  const [autoOptions, setAutoOptions] = useState<AutoOptions>(
    codeSnippetStore.autoOptions
  );

  const handleLanguageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setLanguageFilter((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAutoOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAutoOptions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSidebarExpandButtonClicked = () => {
    setExpanded((prev) => !prev);
  };

  const handleApplyFiltersSubmit = (e: FormEvent<HTMLButtonElement>) => {
    const {
      sortRandomly,
      sortByIncreasingLength,
      sortByDecreasingLength,
      setLanguageFilter,
      setAutoOptions,
      setCodeSnippetLengthFilter,
    } = codeSnippetStore;
    e.preventDefault();
    const sortTypeChanged = sortType !== codeSnippetStore.sortType;
    const languageFilterChanged = languageFilter !== codeSnippetStore.languageFilter;
    const autoOptionsChanged = autoOptions !== codeSnippetStore.autoOptions;
    const lengthChanged =
      minCodeSnippetLength !== codeSnippetStore.minCodeSnippetLength ||
      maxCodeSnippetLength !== codeSnippetStore.maxCodeSnippetLength;

    if (sortTypeChanged) {
      if (sortType === 'ascending') {
        sortByIncreasingLength();
      } else if (sortType === 'descending') {
        sortByDecreasingLength();
      } else {
        sortRandomly();
      }
    }
    if (languageFilterChanged) {
      setLanguageFilter(languageFilter);
    }
    if (autoOptionsChanged) {
      setAutoOptions(autoOptions);
    }
    if (lengthChanged) {
      setCodeSnippetLengthFilter(minCodeSnippetLength, maxCodeSnippetLength);
    }
  };

  return (
    <aside className="float-end z-50">
      <div className="h-full flex flex-col bg-gray-600 border-l border-indigo-300 shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center mb-4">
          <button
            className="p-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 border border-indigo-300 mr-2"
            onClick={handleSidebarExpandButtonClicked}
          >
            <ChevronLeft />
          </button>
          <div className={`${expanded ? 'block' : 'hidden'}`}>
            <h2 className="text-2xl">Customization Menu</h2>
          </div>
        </div>
        <ul className={`flex-1 px-3 ${expanded ? 'block' : 'hidden'}`}>
          <SidebarItem Icon={CodeXml} text="Languages">
            <div className="flex flex-col">
              <Checkbox
                name="python"
                label="Python"
                checked={languageFilter.python}
                onChangeCallback={handleLanguageChange}
              />
              <Checkbox
                name="cpp"
                label="C++"
                checked={languageFilter.cpp}
                onChangeCallback={handleLanguageChange}
              />
              <Checkbox
                name="csharp"
                label="C#"
                checked={languageFilter.csharp}
                onChangeCallback={handleLanguageChange}
              />
              <Checkbox
                name="java"
                label="Java"
                checked={languageFilter.java}
                onChangeCallback={handleLanguageChange}
              />
              <Checkbox
                name="javascript"
                label="JavaScript"
                checked={languageFilter.javascript}
                onChangeCallback={handleLanguageChange}
              />
            </div>
          </SidebarItem>
          <SidebarItem Icon={SlidersHorizontal} text="Lines of Code">
            <CodeLengthSlider
              minCodeValue={minCodeSnippetLength}
              maxCodeValue={maxCodeSnippetLength}
              minValueChanged={setMinCodeSnippetLength}
              maxValueChanged={setMaxCodeSnippetLength}
            />
          </SidebarItem>
          <SidebarItem Icon={ArrowUpDown} text="Sorting">
            <div className="flex flex-col">
              <Radio
                value="random"
                label="Random Order"
                checked={sortType === 'random'}
                onChangeCallback={(e) => setFormType(e.target.value as SortType)}
              />
              <Radio
                value="ascending"
                label="Ascending Lines of Code"
                checked={sortType === 'ascending'}
                onChangeCallback={(e) => setFormType(e.target.value as SortType)}
              />
              <Radio
                value="descending"
                label="Descending Lines of Code"
                checked={sortType === 'descending'}
                onChangeCallback={(e) => setFormType(e.target.value as SortType)}
              />
            </div>
          </SidebarItem>
          <SidebarItem Icon={CircleEllipsis} text="Options">
            <div className="flex flex-col">
              <Checkbox
                name="autoTab"
                label="Auto-tab"
                checked={autoOptions.autoTab}
                onChangeCallback={handleAutoOptionChange}
              />
              <Checkbox
                name="autoNewline"
                label="Auto-newline"
                checked={autoOptions.autoNewline}
                onChangeCallback={handleAutoOptionChange}
              />
            </div>
          </SidebarItem>
        </ul>
        <div className={`p-4 ${expanded ? 'block' : 'hidden'}`}>
          <button
            className="w-full p-1 bg-blue-900 hover:bg-blue-800 border border-indigo-300 rounded-lg text-lg"
            type="submit"
            onClick={(e) => handleApplyFiltersSubmit(e)}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </aside>
  );
}

type SidebarItemProps = {
  Icon: LucideIcon;
  text: string;
  children: React.ReactNode;
};

function SidebarItem({ Icon, text, children }: SidebarItemProps) {
  return (
    <li>
      <div className="flex items-center gap-2 mb-4">
        <Icon />
        <span className="text-lg">{text}</span>
      </div>
      <div className="mb-4 mx-4">{children}</div>
    </li>
  );
}
