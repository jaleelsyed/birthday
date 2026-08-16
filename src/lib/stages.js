// Ordered ceremony flow. The index drives ambient light + music intensity.
export const STAGES = ['intro', 'room', 'balloons', 'cake', 'wish', 'sky'];

export const STAGE_INDEX = STAGES.reduce((acc, id, i) => {
  acc[id] = i;
  return acc;
}, {});

// How bright / warm the room feels at each stage (0 = candlelit dark, 1 = radiant).
export const STAGE_LIGHT = {
  intro: 0.22,
  room: 0.62,
  balloons: 0.78,
  cake: 0.5,
  wish: 0.32,
  sky: 0.14,
};

// Musical intensity per stage (0 = tender, 1 = climax).
export const STAGE_INTENSITY = {
  intro: 0.28,
  room: 0.45,
  balloons: 0.68,
  cake: 0.55,
  wish: 0.42,
  sky: 1.0,
};
