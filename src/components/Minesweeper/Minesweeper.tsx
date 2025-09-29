"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { buildMineSweeperConfig, getIdFromPos, getClearAreFromMine } from "./utils";
import styles from "./Minesweeper.module.css";

export interface MinesweeperProps {
  config: ReturnType<typeof buildMineSweeperConfig>;
}

export const Minesweeper = ({ config }: MinesweeperProps) => {
  const { width, height, mineIds } = config;
  const [revealedMines, setRevealedMines] = useState<string[]>([]);
  const [gameOverMineId, setGameOverMineId] = useState<string | null>(null);

  const pendingMines = useMemo(() => mineIds.filter((id) => !revealedMines.includes(id)), [mineIds, revealedMines]);

  const hasWon = !gameOverMineId && !pendingMines.length;

  const onClick = useCallback(
    (id: string) => {
      if (hasWon || gameOverMineId || revealedMines.includes(id)) return;

      if (mineIds.includes(id)) return setGameOverMineId(id);
      const clearMines = getClearAreFromMine(id, config);
      setRevealedMines((prev) => Array.from(new Set([...prev, ...clearMines])));
    },
    [hasWon, gameOverMineId, revealedMines, mineIds, config]
  );

  return (
    <div className={styles.container}>
      <div>
        Mines left: {pendingMines.length}/{mineIds.length}
      </div>
      <div className={styles.board}>
        {Array.from({ length: width }).map((_, wIndex) => (
          <div key={wIndex} className={styles.row}>
            {Array.from({ length: height }).map((_, hIndex) => {
              const id = getIdFromPos(wIndex, hIndex);
              const hasMine = mineIds.includes(id);
              const isRevealed = revealedMines.includes(id);
              const isHit = gameOverMineId === id;
              return <Mine key={hIndex} id={id} hasMine={hasMine} isRevealed={isRevealed} isHit={isHit} onClick={onClick} />;
            })}
          </div>
        ))}
      </div>
      {!!gameOverMineId && <div>Game Over</div>}
      {hasWon && <div>You Won</div>}
    </div>
  );
};

interface MineProps {
  id: string;
  hasMine: boolean;
  isRevealed: boolean;
  isHit: boolean;
  onClick: (id: string) => void;
}

const Mine = memo(({ id, hasMine, isRevealed, isHit, onClick }: MineProps) => {
  return (
    <div className={styles.mine} onClick={() => onClick(id)} data-revealed={isRevealed} data-mine-hit={isHit}>
      {hasMine && (isRevealed || isHit) && "💣"}
    </div>
  );
});
Mine.displayName = "Mine";
