import { Tabs } from "@design-sync/uikit";
import { Export } from "./Export";
import { Import } from "./Import";
import { Themes } from "./Themes";
import { Tokens } from "./Tokens";

export function Dashboard() {
  return (
    <Tabs
      tabs={[
        { value: "export", label: "Export", content: <Export /> },
        { value: "import", label: "Import", content: <Import /> },
        { value: "tokens", label: "Tokens", content: <Tokens /> },
        { value: "themes", label: "Themes", content: <Themes /> },
      ]}
    />
  );
}
