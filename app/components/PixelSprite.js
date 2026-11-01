// Pixel-art office crew for the closing case. Drawn pixel by pixel, arms raised to hold a coin.
const SPRITES = {
 "boy": [
  "..................",
  "..................",
  "...kk........kk...",
  "..kssk......kssk..",
  "..ksssk....ksssk..",
  "..ksskkkkkkkkssk..",
  "..kcchhhhhhhhcck..",
  "..kjjhhhhhhhhjjk..",
  "..kjjhhhhhhhhjjk..",
  "..kjjhssshhhhjjk..",
  "..kjjhsssssShjjk..",
  "..kjjhsesseSkjjk..",
  "..kjjksssssSkjjk..",
  "..kjjkssmmsSkjjk..",
  "..kjjksssssSkjjk..",
  "..kjjkksssskkjjk..",
  "..kjjkkkSSkkkjjk..",
  "..kjjjjwttwjjjjk..",
  "..kjjjjjttjjjjjk..",
  "...kkJjjttjjJkk...",
  "....kJJjttjJJk....",
  "....kJjjttjjJk....",
  "....kJjjttjjJk....",
  "....kJjjttjjJk....",
  "....kJjjjjjjJk....",
  "....kJjjjjjjJk....",
  ".....kppppppk.....",
  ".....kppppppk.....",
  ".....kppkkppk.....",
  ".....kppkkppk.....",
  ".....kppkkppk.....",
  ".....kppkkppk.....",
  "....kbbbkkbbbk....",
  ".....kkk..kkk....."
 ],
 "girl": [
  "..................",
  "..................",
  "...kk........kk...",
  "..kssk......kssk..",
  "..ksssk....ksssk..",
  "..ksskkkkkkkkssk..",
  "..kcchhhhhhhhcck..",
  "..kjjhhhhhhhhjjk..",
  "..kjjhhhhhhhhjjk..",
  "..kjjhhhssshhjjk..",
  "..kjjhsssssShjjk..",
  "..kjjhsesseShjjk..",
  "..kjjhsssssShjjk..",
  "..kjjhssmmsShjjk..",
  "..kjjhsssssShjjk..",
  "..kjjhksssskhjjk..",
  "..kjjhhkSSkhhjjk..",
  "..kjjhhwwwwhhjjk..",
  "..kjjhjjttjjhjjk..",
  "...kkJjjttjjJkk...",
  "....kJJjjjjJJk....",
  "....kJjjjjjjJk....",
  "....kJjjjjjjJk....",
  "....kJjjjjjjJk....",
  "....kJjjjjjjJk....",
  "....kJjjjjjjJk....",
  "....kppppppppk....",
  "....kppppppppk....",
  "....kppppppppk....",
  ".....ksskkssk.....",
  ".....ksskkssk.....",
  ".....ksskkssk.....",
  "....kbbbkkbbbk....",
  ".....kkk..kkk....."
 ],
 "old": [
  "..................",
  "..................",
  "...kk........kk...",
  "..kssk......kssk..",
  "..ksssk....ksssk..",
  "..kssk......kssk..",
  "..kcckkkkkkkkcck..",
  "..kjjksssssskjjk..",
  "..kjjhhsssshhjjk..",
  "..kjjhsssssShjjk..",
  "..kjjhgggggghjjk..",
  "..kjjhsesseShjjk..",
  "..kjjhsssssSkjjk..",
  "..kjjkshhhhSkjjk..",
  "..kjjkssmmsSkjjk..",
  "..kjjkksssskkjjk..",
  "..kjjkkkSSkkkjjk..",
  "..kjjjjwttwjjjjk..",
  "..kjjjjjttjjjjjk..",
  "...kkJjjttjjJkk...",
  "....kJJjttjJJk....",
  "....kJjjttjjJk....",
  "....kJjjttjjJk....",
  "....kJjjttjjJk....",
  "....kJjjjjjjJk....",
  "....kJjjjjjjJk....",
  ".....kppppppk.....",
  ".....kppppppk.....",
  ".....kppkkppk.....",
  ".....kppkkppk.....",
  ".....kppkkppk.....",
  ".....kppkkppk.....",
  "....kbbbkkbbbk....",
  ".....kkk..kkk....."
 ]
};
const looks = {
  boy: { s: "#f2c39b", S: "#d9a27a", h: "#6b3e1f", j: "#2c3e66", J: "#1f2c4a", p: "#2a2f3a" },
  girl: { s: "#c98e62", S: "#b0794f", h: "#2b1a10", j: "#6b2d3a", J: "#52212c", p: "#3a2228" },
  old: { s: "#e8b48c", S: "#cf9a73", h: "#dcdcd6", j: "#56514a", J: "#403c36", p: "#3a3833" },
};
const base = { k: "#0c1a14", e: "#1b1b1b", m: "#b0644a", w: "#f4f2ea", c: "#f4f2ea", b: "#141414", g: "#9aa09a" };
export default function PixelSprite({ who, tie }) {
  const pal = { ...base, ...looks[who], t: tie };
  const rects = [];
  SPRITES[who].forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let run = 1;
      while (x + run < row.length && row[x + run] === c) run++;
      if (c !== ".") rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run + .02} height="1.02" fill={pal[c]} />);
      x += run;
    }
  });
  return <svg className="pixelSprite" viewBox="0 0 18 34" shapeRendering="crispEdges" aria-hidden="true">{rects}</svg>;
}
