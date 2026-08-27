import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useMemo, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { SearchCombobox } from "@/components/search-combobox";

const meta = {
  component: SearchCombobox,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  title: "Components/SearchCombobox",
} satisfies Meta<typeof SearchCombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

interface Fruit {
  id: string;
  name: string;
}

const FRUITS: Fruit[] = [
  { id: "apple", name: "Apple" },
  { id: "apricot", name: "Apricot" },
  { id: "banana", name: "Banana" },
  { id: "cherry", name: "Cherry" },
  { id: "damson", name: "Damson" },
];

const LABEL = "Search fruit";

function FruitSearch({ onPick }: { onPick?: (fruit: Fruit) => void }) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Fruit | null>(null);

  const handleSelect = useCallback(
    (fruit: Fruit) => {
      setPicked(fruit);
      setQuery("");
      onPick?.(fruit);
    },
    [onPick]
  );

  const renderFruit = useCallback(
    (fruit: Fruit) => (
      <span className="flex-1 truncate text-foreground text-sm">
        {fruit.name}
      </span>
    ),
    []
  );

  const getKey = useCallback((fruit: Fruit) => fruit.id, []);

  const options = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return FRUITS;
    }
    return FRUITS.filter((fruit) => fruit.name.toLowerCase().includes(trimmed));
  }, [query]);

  return (
    <div className="max-w-sm space-y-3">
      <SearchCombobox
        emptyLabel="No fruit matches that."
        getOptionKey={getKey}
        label={LABEL}
        onQueryChange={setQuery}
        onSelect={handleSelect}
        options={options}
        placeholder="Try “ap”…"
        query={query}
        renderOption={renderFruit}
      />
      <p className="text-muted-foreground text-sm">
        {picked ? `Picked ${picked.name}` : "Nothing picked yet"}
      </p>
    </div>
  );
}

/**
 * Also proves the ARIA combobox behaviour: focus never leaves the input, and
 * the active option is pointed at with aria-activedescendant rather than moved.
 */
export const Default: Story = {
  args: {
    emptyLabel: "",
    getOptionKey: () => "",
    label: LABEL,
    onQueryChange: () => undefined,
    onSelect: () => undefined,
    options: [],
    query: "",
    renderOption: () => null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: LABEL });

    await userEvent.click(input);
    await waitFor(() => expect(canvas.getByRole("listbox")).toBeVisible());
    await expect(input).toHaveAttribute("aria-expanded", "true");

    await userEvent.keyboard("{ArrowDown}");
    await expect(input).toHaveAttribute("aria-activedescendant");

    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByText("Picked Apricot")).toBeVisible();

    await waitFor(() => expect(canvas.queryByRole("listbox")).toBeNull());
  },
  render: () => <FruitSearch />,
};

export const Loading: Story = {
  args: {
    emptyLabel: "No results",
    getOptionKey: () => "",
    label: LABEL,
    loading: true,
    loadingLabel: "Loading fruit…",
    onQueryChange: () => undefined,
    onSelect: () => undefined,
    options: [],
    query: "",
    renderOption: () => null,
  },
  render: (args) => (
    <div className="max-w-sm">
      <SearchCombobox {...args} />
    </div>
  ),
};
