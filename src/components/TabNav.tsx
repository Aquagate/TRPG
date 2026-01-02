import React from "react";

export type TabKey = "tavern" | "quest-drop" | "quest-runner" | "world-ledger" | "hostess";

interface TabNavProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "tavern", label: "Tavern" },
  { key: "quest-drop", label: "Quest Drop" },
  { key: "quest-runner", label: "Quest Runner" },
  { key: "world-ledger", label: "World Ledger" },
  { key: "hostess", label: "Hostess Console" },
];

export const TabNav: React.FC<TabNavProps> = ({ activeTab, onChange }) => {
  return (
    <nav className="tab-nav">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={activeTab === tab.key ? "active" : ""}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};
