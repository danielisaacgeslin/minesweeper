export const buildMineSweeperConfig = (config: { width: number; height: number; mines: number; clearMultiplier: number }) => {
  const { width, height, mines, clearMultiplier } = config;
  return {
    width,
    height,
    mines,
    clearMultiplier,
    mineIds: getRandomMines(width, height, mines),
  };
};

export const getRandomMines = (width: number, height: number, mines: number): string[] => {
  const safeMines = Math.min(mines, width * height);

  const { placedMines } = Array.from({
    length: safeMines,
  }).reduce(
    (total: { availableSlots: string[]; placedMines: string[] }) => {
      const slotIndex = getRandom(total.availableSlots.length - 1);
      return {
        ...total,
        availableSlots: [...total.availableSlots.slice(0, slotIndex), ...total.availableSlots.slice(slotIndex + 1)],
        placedMines: [...total.placedMines, total.availableSlots[slotIndex]],
      };
    },
    {
      availableSlots: Array.from({ length: width })
        .map((_, wI) => Array.from({ length: height }).map((_, hI) => getIdFromPos(wI, hI)))
        .flat(),
      placedMines: [],
    }
  );

  return placedMines;
};

export const getClearAreFromMine = (mineId: string, config: ReturnType<typeof buildMineSweeperConfig>) => {
  const { width, height, clearMultiplier, mineIds } = config;
  const { wIndex, hIndex } = getPosFromId(mineId);
  const linerAreaSize = clearMultiplier * 2 + 1;
  const wIndexes = Array.from({ length: linerAreaSize })
    .map((_, wI) => clearMultiplier * -1 + wIndex + wI)
    .filter((wI) => wI >= 0 && wI < width);
  const hIndexes = Array.from({ length: linerAreaSize })
    .map((_, hI) => clearMultiplier * -1 + hIndex + hI)
    .filter((hI) => hI >= 0 && hI < height);
  const clearArea = wIndexes
    .map((wI) =>
      hIndexes.map((hI) => {
        const lowestWHit = wI === wIndexes[0] && mineIds.includes(getIdFromPos(wI - 1, hI)) && getIdFromPos(wI - 1, hI);
        const highestWHit = wI === wIndexes[wIndexes.length - 1] && mineIds.includes(getIdFromPos(wI + 1, hI)) && getIdFromPos(wI + 1, hI);
        const lowestHHit = hI === hIndexes[0] && mineIds.includes(getIdFromPos(wI, hI - 1)) && getIdFromPos(wI, hI - 1);
        const highestHHit = hI === hIndexes[hIndexes.length - 1] && mineIds.includes(getIdFromPos(wI, hI + 1)) && getIdFromPos(wI, hI + 1);

        return [getIdFromPos(wI, hI), lowestWHit, highestWHit, lowestHHit, highestHHit];
      })
    )
    .flat(2)
    .filter(Boolean) as string[];

  return clearArea;
};

export const getRandom = (max: number): number => {
  return Math.floor(Math.random() * (max + 1));
};

export const getIdFromPos = (wIndex: number, hIndex: number) => {
  return `${wIndex}-${hIndex}`;
};

export const getPosFromId = (id: string) => {
  const [wIndex, hIndex] = id.split("-");
  return { wIndex: parseInt(wIndex), hIndex: parseInt(hIndex) };
};
