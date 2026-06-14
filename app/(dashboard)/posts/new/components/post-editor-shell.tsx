"use client";

import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { AssistantPanel } from "./assistant-panel";
import { DraftEditorPanel } from "./draft-editor-panel";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const update = () => setIsDesktop(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

export function PostEditorShell() {
  const isDesktop = useIsDesktop();

  return (
    <ResizablePanelGroup
      key={isDesktop ? "desktop" : "mobile"}
      orientation={isDesktop ? "horizontal" : "vertical"}
      className="min-h-[calc(100svh-4rem)]"
    >
      <ResizablePanel
        defaultSize={isDesktop ? "52%" : "56%"}
        minSize={isDesktop ? "38%" : "32%"}
      >
        <DraftEditorPanel />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={isDesktop ? "48%" : "44%"}
        minSize={isDesktop ? "32%" : "24%"}
      >
        <AssistantPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
