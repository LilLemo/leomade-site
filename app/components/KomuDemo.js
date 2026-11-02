"use client";

import { useEffect, useState } from "react";

/* Komu, resumido: a lista é da casa, o mercado mostra o total ao vivo e o resumo divide pelo dono de cada item. */
const people = [
  { id: "voce", name: "Você", color: "#c96f43" },
  { id: "ana", name: "Ana", color: "#6f8f4e" },
  { id: "bia", name: "Bia", color: "#7c62a6" },
];
const categories = {
  Despensa: "#e9b872", Hortifruti: "#9cc27a", Limpeza: "#86c4c9", Laticínios: "#9db6e0", Padaria: "#e6cd6f",
};
const startItems = [
  { id: 1, name: "Arroz 5 kg", qty: 1, price: 27.9, cat: "Despensa", owner: "voce" },
  { id: 2, name: "Café 500 g", qty: 1, price: 18.5, cat: "Despensa", owner: "ana" },
  { id: 3, name: "Banana (dúzia)", qty: 1, price: 8.4, cat: "Hortifruti", owner: "bia" },
  { id: 4, name: "Detergente", qty: 3, price: 2.79, cat: "Limpeza", owner: "voce" },
  { id: 5, name: "Iogurte", qty: 4, price: 3.25, cat: "Laticínios", owner: "bia" },
  { id: 6, name: "Pão de forma", qty: 1, price: 9.9, cat: "Padaria", owner: "ana" },
];
const extraItems = [
  { name: "Leite", qty: 2, price: 5.49, cat: "Laticínios", owner: "ana" },
  { name: "Tomate (kg)", qty: 1, price: 6.8, cat: "Hortifruti", owner: "voce" },
  { name: "Queijo 200 g", qty: 1, price: 14.5, cat: "Laticínios", owner: "bia" },
];
const steps = [
  { id: "lista", title: "A casa monta a lista junto", text: "Cada pessoa coloca o que precisa. Toque no nome ao lado do item para trocar de quem ele é." },
  { id: "mercado", title: "No mercado, o total sobe a cada item", text: "Toque no item quando ele for para o carrinho. Você sabe quanto deu antes de chegar ao caixa." },
  { id: "resumo", title: "No fim, cada um sabe a sua parte", text: "O resumo soma os itens de cada pessoa. Sem planilha, sem conta de cabeça." },
];

const brl = value => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const person = id => people.find(p => p.id === id);
const lineTotal = item => item.price * item.qty;

function Avatar({ id, size = 18 }) {
  const p = person(id);
  return <span className="kmAvatar" style={{ "--c": p.color, "--s": `${size}px` }} aria-hidden="true">{p.name[0]}</span>;
}

export default function KomuDemo() {
  const [screen, setScreen] = useState("lista");
  const [items, setItems] = useState(startItems);
  const [cart, setCart] = useState([]);
  const [extra, setExtra] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    if (screen !== "mercado" || !startedAt) return;
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [screen, startedAt]);

  const inCart = items.filter(item => cart.includes(item.id));
  const total = inCart.reduce((sum, item) => sum + lineTotal(item), 0);
  const byPerson = people.map(p => ({ ...p, value: inCart.filter(i => i.owner === p.id).reduce((s, i) => s + lineTotal(i), 0) })).filter(p => p.value > 0);
  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  const go = next => {
    if (next === "resumo" && !cart.length) return;
    if (next === "mercado" && !startedAt) { setStartedAt(Date.now()); setElapsed(0); }
    setScreen(next);
  };
  const cycleOwner = id => setItems(list => list.map(item => item.id === id ? { ...item, owner: people[(people.findIndex(p => p.id === item.owner) + 1) % people.length].id } : item));
  const addItem = () => {
    if (extra >= extraItems.length) return;
    setItems(list => [...list, { ...extraItems[extra], id: 100 + extra }]);
    setExtra(extra + 1);
  };
  const toggleCart = id => {
    setCart(list => list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
    setBump(b => b + 1);
  };
  const restart = () => { setItems(startItems); setCart([]); setExtra(0); setStartedAt(null); setElapsed(0); setScreen("lista"); };
  const stepIndex = steps.findIndex(s => s.id === screen);
  const planned = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const house = people.map(p => {
    const mine = items.filter(i => i.owner === p.id);
    const mineIn = mine.filter(i => cart.includes(i.id));
    const listed = mine.reduce((s, i) => s + lineTotal(i), 0), spent = mineIn.reduce((s, i) => s + lineTotal(i), 0);
    const share = screen === "lista" ? listed / (planned || 1) : spent / (total || 1);
    const main = screen === "lista" ? `${mine.length} ${mine.length === 1 ? "item" : "itens"}` : screen === "mercado" ? brl(spent) : `paga ${brl(spent)}`;
    const sub = screen === "lista" ? `cerca de ${brl(listed)}` : screen === "mercado" ? `${mineIn.length} de ${mine.length} no carrinho` : `${Math.round(share * 100)}% da compra`;
    return { ...p, main, sub, share };
  });

  return <div className="projectVisual komuVisual kmVisual" data-noswipe>
    <div className="kmStage">
    <div className="kmGuide">
      <span className="kmEyebrow">COMO O KOMU FUNCIONA</span>
      <p className="kmPitch">Um app de iPhone para quem mora junto fazer a lista de compras em conjunto e dividir a conta sem briga.</p>
      <ol className="kmSteps">{steps.map((s, i) => <li key={s.id}>
        <button className={screen === s.id ? "active" : i < stepIndex ? "done" : ""} onClick={() => go(s.id)} disabled={s.id === "resumo" && !cart.length} aria-pressed={screen === s.id}>
          <b>{i < stepIndex ? "✓" : i + 1}</b><span><strong>{s.title}</strong><small>{s.text}</small></span>
        </button>
      </li>)}</ol>
    </div>

    <div className="kmPhone" aria-live="polite">
      <div className="kmNotch" aria-hidden="true" />
      <div className="kmStatus" aria-hidden="true"><span>9:41</span><span>● ● ▰</span></div>

      {screen === "lista" && <div className="kmScreen" key="lista">
        <div className="kmHead"><span className="kmLogo">komu<i>✳</i></span><span className="kmHouse">{people.map(p => <Avatar key={p.id} id={p.id} size={16} />)}</span></div>
        <small className="kmKicker">CASA DA RUA 7 · LISTA DA SEMANA</small>
        <ul className="kmList">{items.map(item => <li key={item.id}>
          <i className="kmCat" style={{ background: categories[item.cat] }} aria-hidden="true" />
          <span className="kmName">{item.name}<small>{item.qty} un · {item.cat}</small></span>
          <button className="kmOwner" onClick={() => cycleOwner(item.id)} aria-label={`${item.name} é de ${person(item.owner).name}. Trocar dono`}><Avatar id={item.owner} />{person(item.owner).name}</button>
        </li>)}</ul>
        <button className="kmGhost" onClick={addItem} disabled={extra >= extraItems.length}>{extra >= extraItems.length ? "Lista completa" : "+ Adicionar item"}</button>
        <button className="kmPrimary" onClick={() => go("mercado")}>Ir ao mercado →</button>
      </div>}

      {screen === "mercado" && <div className="kmScreen" key="mercado">
        <div className="kmMarketTop">
          <div><small className="kmKicker">MOMENTO MERCADO</small><strong className="kmTotal" key={bump}>{brl(total)}</strong><span className="kmClock">◷ {clock}</span></div>
          <button className="kmFinish" onClick={() => go("resumo")} disabled={!cart.length}>Finalizar</button>
        </div>
        <div className="kmProgress"><span>{cart.length} de {items.length} no carrinho</span><i style={{ "--w": `${(cart.length / items.length) * 100}%` }} aria-hidden="true" /></div>
        <ul className="kmList kmMarket">{items.map(item => {
          const on = cart.includes(item.id);
          return <li key={item.id}><button className={on ? "on" : ""} onClick={() => toggleCart(item.id)} aria-pressed={on}>
            <span className="kmCheck" aria-hidden="true">{on ? "✓" : ""}</span>
            <span className="kmName"><span className="kmLabel">{item.name}</span><small>{item.qty} un · <Avatar id={item.owner} size={12} /> {person(item.owner).name}</small></span>
            <span className="kmPrice">{on ? brl(lineTotal(item)) : "toque"}</span>
          </button></li>;
        })}</ul>
      </div>}

      {screen === "resumo" && <div className="kmScreen" key="resumo">
        <small className="kmKicker">RESUMO DA COMPRA</small>
        <div className="kmBill"><span>TOTAL</span><strong>{brl(total)}</strong><div><span>◷ {clock}</span><span>{cart.length} itens</span></div></div>
        <small className="kmKicker">DIVISÃO</small>
        <ul className="kmSplit">{byPerson.map(p => <li key={p.id}>
          <span><Avatar id={p.id} />{p.name}</span><strong>{brl(p.value)}</strong>
          <i style={{ "--w": `${(p.value / total) * 100}%`, "--c": p.color }} aria-hidden="true" />
        </li>)}</ul>
        {items.length > cart.length && <p className="kmNote">{items.length - cart.length} {items.length - cart.length === 1 ? "item ficou" : "itens ficaram"} para a próxima compra.</p>}
        <button className="kmPrimary" onClick={restart}>Nova compra ↻</button>
      </div>}
    </div>
    <aside className="kmHouseBoard" aria-label="Resumo da casa em tempo real">
      <div className="kmCart" key={`${screen}-${bump}-${items.length}`} aria-hidden="true">
        <svg viewBox="0 0 48 40"><path d="M3 5h6l5 21h22l5-15H12" /><circle cx="17" cy="33" r="3" /><circle cx="33" cy="33" r="3" /></svg>
        <b>{screen === "lista" ? items.length : cart.length}</b>
      </div>
      <span className="kmEyebrow">A CASA AGORA</span>
      <ul>{house.map(p => <li key={p.id}>
        <Avatar id={p.id} size={30} />
        <span><strong>{p.name}</strong><small>{p.sub}</small></span>
        <em>{p.main}</em>
        <i style={{ "--w": `${Math.min(100, p.share * 100)}%`, "--c": p.color }} aria-hidden="true" />
      </li>)}</ul>
      <div className="kmHouseTotal"><span>{screen === "lista" ? "Previsto para a compra" : screen === "mercado" ? "No carrinho até agora" : "Total pago"}</span><strong>{brl(screen === "lista" ? planned : total)}</strong></div>
    </aside>
    </div>
    <span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
}
