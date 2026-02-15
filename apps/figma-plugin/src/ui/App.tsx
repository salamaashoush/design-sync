import { figmaTheme } from "@design-sync/design-tokens";
import { ThemeProvider, Spinner } from "@design-sync/uikit";
import { Match, Switch, createResource } from "solid-js";
import { client } from "./rpc/client";
import { useRouter } from "./router";
import { Dashboard } from "./screens/Dashboard";
import { Onboarding } from "./screens/Onboarding";
import { Settings } from "./screens/Settings";
import { StatusBar } from "./components/StatusBar";

export function App() {
  const { screen } = useRouter();

  // Initialize on mount
  const [initialized] = createResource(() => client.call("init"));

  return (
    <ThemeProvider theme={figmaTheme}>
      <div
        style={{ display: "flex", "flex-direction": "column", height: "100%", overflow: "hidden" }}
      >
        <Switch
          fallback={
            <div
              style={{
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
                flex: 1,
              }}
            >
              <Spinner size="lg" />
            </div>
          }
        >
          <Match when={initialized() !== undefined}>
            <div style={{ flex: 1, overflow: "auto" }}>
              <Switch>
                <Match when={screen() === "onboarding"}>
                  <Onboarding />
                </Match>
                <Match when={screen() === "dashboard"}>
                  <Dashboard />
                </Match>
                <Match when={screen() === "settings"}>
                  <Settings />
                </Match>
              </Switch>
            </div>
            <StatusBar />
          </Match>
        </Switch>
      </div>
    </ThemeProvider>
  );
}
