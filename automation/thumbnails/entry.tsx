import React, { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, registerRoot, Still } from "remotion";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/space-grotesk/700.css";
import { ReelThumbnail } from "../../src/components/thumbnails/ReelThumbnail";
import { ThumbnailItem } from "../../src/data/thumbnails";
import { FONT_HEAD, FONT_BODY } from "../../src/utils/fonts";

type Props = {
  item: ThumbnailItem;
  sectionLabel: string;
  footerLabel: string;
  diagram: { title: string; nodes: [string, string][]; note: string };
};

const CourseCover: React.FC<Props> = ({ item, sectionLabel, footerLabel, diagram }) => {
  const accent = item.accentColor;
  const [handle] = useState(() => delayRender("Validate course cover typography"));
  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))).then(() => {
      if (!active) return;
      const safe = document.querySelector('[data-thumbnail-safe="true"]');
      if (!safe) throw new Error("Cover safe zone missing");
      const bounds = safe.getBoundingClientRect();
      for (const element of Array.from(safe.querySelectorAll<HTMLElement>("*"))) {
        if (element.children.length || !element.textContent?.trim()) continue;
        const rect = element.getBoundingClientRect();
        if (rect.left < bounds.left - 1 || rect.right > bounds.right + 1 || rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1 ||
            (element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 1)) {
          throw new Error(`Cover text overflows for ${item.id}: ${element.textContent}`);
        }
      }
      continueRender(handle);
    }).catch((error) => cancelRender(error));
    return () => { active = false; };
  }, [handle, item.id]);
  return <ReelThumbnail item={item} sectionLabel={sectionLabel} footerLabel={footerLabel} diagram={
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start" }}>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 25, fontWeight: 700, lineHeight: 1.3, maxWidth: 760 }}>{diagram.title}</div>
        <div style={{ flexShrink: 0, color: accent, background: `${accent}18`, border: `1px solid ${accent}55`, borderRadius: 10, padding: "9px 14px", fontSize: 16, fontWeight: 700 }}>THE MECHANISM</div>
      </div>
      <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
        {diagram.nodes.map(([label, value], index) => (
          <div key={label} style={{ position: "relative", flex: 1, minWidth: 0, height: 260, padding: "25px 20px", border: `1.5px solid ${index === 1 ? accent : "#ffffff22"}`, background: index === 1 ? `${accent}0E` : "#ffffff06", borderRadius: 21, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ width: 45, height: 45, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 13, background: `${accent}20`, color: accent, font: `700 22px ${FONT_HEAD}` }}>{String(index + 1).padStart(2, "0")}</div>
            <div>
              <div style={{ color: accent, font: `700 23px/1.2 ${FONT_HEAD}`, marginBottom: 13 }}>{label}</div>
              <div style={{ color: "#CBD5E1", font: `400 22px/1.45 ${FONT_BODY}` }}>{value}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderRadius: 15, border: "1px solid #ffffff16", background: "#07080D", minHeight: 75, padding: "18px 24px", textAlign: "center", font: `600 21px/1.4 ${FONT_BODY}`, color: "#E2E8F0" }}>{diagram.note}</div>
    </div>
  } />;
};

const defaults: Props = {
  item: { id: "lesson-01", reelId: "lesson-01", category: "MODULE 01 · VIDEO 1 OF 5", badge: "CRASH COURSE", title: "REQUIREMENTS FIRST", subtitle: "What must this system actually guarantee?", accentColor: "#10B981", tags: ["User flows", "Capacity", "Guarantees"], diagramType: "load_balancer" },
  sectionLabel: "DESIGN THINKING AND SIZING",
  footerLabel: "SYSTEM DESIGN CRASH COURSE · LESSON 01 / 60",
  diagram: { title: "Define the system before choosing tools", nodes: [["USER FLOWS", "What must users do?"], ["CAPACITY", "How much load?"], ["GUARANTEES", "What survives failure?"]], note: "Requirements → estimates → architecture" },
};
registerRoot(() => <Still id="course-cover" component={CourseCover} width={1080} height={1920} defaultProps={defaults} />);
