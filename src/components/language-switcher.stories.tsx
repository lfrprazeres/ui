import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  type LanguageOption,
  LanguageSwitcher,
} from "@/components/language-switcher";

const meta = {
  component: LanguageSwitcher,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Components/LanguageSwitcher",
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS: LanguageOption[] = [
  { icon: "\u{1F1FA}\u{1F1F8}", label: "English", value: "en" },
  { icon: "\u{1F1E7}\u{1F1F7}", label: "Portugues", value: "pt" },
  { icon: "\u{1F1EA}\u{1F1F8}", label: "Espanol", value: "es" },
  { icon: "\u{1F1E9}\u{1F1EA}", label: "Deutsch", value: "de" },
  { icon: "\u{1F1EB}\u{1F1F7}", label: "Francais", value: "fr" },
];

function Controlled() {
  const [locale, setLocale] = useState("en");

  return (
    <div className="flex flex-col items-center gap-3">
      <LanguageSwitcher
        onValueChange={setLocale}
        options={OPTIONS}
        value={locale}
      />
      <p className="text-muted-foreground text-xs">
        Selected: <span className="font-mono">{locale}</span>
      </p>
    </div>
  );
}

export const Default: Story = {
  args: { onValueChange: () => undefined, options: OPTIONS, value: "en" },
  render: () => <Controlled />,
};
