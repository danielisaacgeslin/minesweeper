"use client";

import { buildMineSweeperConfig, Minesweeper } from "@/components/Minesweeper";

export default function Home() {
  const config = buildMineSweeperConfig({ width: 30, height: 30, mines: 50, clearMultiplier: 2 });

  return <Minesweeper config={config} />;
}
