"use client";

import { useMemo, useState } from "react";

function LogicGateSimulator() {
  const [gate, setGate] = useState("AND");
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);

  const output = useMemo(() => {
    if (gate === "AND") return a && b;
    if (gate === "OR") return a || b;
    if (gate === "XOR") return a !== b;
    if (gate === "NAND") return !(a && b);
    return false;
  }, [gate, a, b]);

  return (
    <div className="tech-card p-4">
      <h3 className="text-lg font-semibold">Logic Gate Simulator</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <select value={gate} onChange={(e) => setGate(e.target.value)} className="tech-input">
          <option>AND</option>
          <option>OR</option>
          <option>XOR</option>
          <option>NAND</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={a} onChange={(e) => setA(e.target.checked)} />
          Input A
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={b} onChange={(e) => setB(e.target.checked)} />
          Input B
        </label>
      </div>
      <p className="mt-3 text-sm">
        Output: <strong>{output ? "1" : "0"}</strong>
      </p>
    </div>
  );
}

function BaseConverter() {
  const [value, setValue] = useState("42");
  const parsed = Number(value);
  const valid = Number.isFinite(parsed) && value.trim() !== "";

  return (
    <div className="tech-card p-4">
      <h3 className="text-lg font-semibold">Base Converter</h3>
      <label className="mt-3 block text-sm">
        Decimal number
        <input value={value} onChange={(e) => setValue(e.target.value)} className="tech-input mt-1" />
      </label>

      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-lg border p-2" style={{ borderColor: "var(--line)" }}>
          <p style={{ color: "var(--muted)" }}>Binary</p>
          <p className="font-medium">{valid ? (parsed >>> 0).toString(2) : "Invalid"}</p>
        </div>
        <div className="rounded-lg border p-2" style={{ borderColor: "var(--line)" }}>
          <p style={{ color: "var(--muted)" }}>Hex</p>
          <p className="font-medium">{valid ? (parsed >>> 0).toString(16).toUpperCase() : "Invalid"}</p>
        </div>
        <div className="rounded-lg border p-2" style={{ borderColor: "var(--line)" }}>
          <p style={{ color: "var(--muted)" }}>Octal</p>
          <p className="font-medium">{valid ? (parsed >>> 0).toString(8) : "Invalid"}</p>
        </div>
      </div>
    </div>
  );
}

function AlgorithmVisualizer() {
  const [input, setInput] = useState("8,4,1,9,2");
  const [step, setStep] = useState(0);

  const steps = useMemo(() => {
    const arr = input
      .split(",")
      .map((n) => Number(n.trim()))
      .filter((n) => Number.isFinite(n));
    const snapshots: number[][] = [arr.slice()];
    const working = arr.slice();

    for (let i = 0; i < working.length; i += 1) {
      for (let j = 0; j < working.length - i - 1; j += 1) {
        if (working[j] > working[j + 1]) {
          [working[j], working[j + 1]] = [working[j + 1], working[j]];
          snapshots.push(working.slice());
        }
      }
    }

    return snapshots;
  }, [input]);

  return (
    <div className="tech-card p-4">
      <h3 className="text-lg font-semibold">Algorithm Visualizer (Bubble Sort)</h3>
      <label className="mt-3 block text-sm">
        Comma-separated numbers
        <input value={input} onChange={(e) => setInput(e.target.value)} className="tech-input mt-1" />
      </label>
      <div className="mt-3 flex gap-2">
        <button className="tech-button secondary text-sm" onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Prev
        </button>
        <button className="tech-button secondary text-sm" onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
          Next
        </button>
      </div>
      <p className="mt-3 text-sm">
        Step {Math.min(step + 1, steps.length)} / {steps.length}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(steps[step] ?? []).map((item, idx) => (
          <span key={idx} className="rounded-md px-3 py-1 text-sm" style={{ background: "var(--accent-soft)" }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function CodeEditor() {
  const [html, setHtml] = useState("<h1>Hello TechHub</h1>");
  const [css, setCss] = useState("h1 { color: #1d4ed8; font-family: sans-serif; }");
  const [js, setJs] = useState("console.log('TechHub Playground');");

  const srcDoc = `<html><style>${css}</style><body>${html}<script>${js}<'/script></body></html>`.replace(
    "<'/script>",
    "</script>",
  );

  return (
    <div className="tech-card p-4">
      <h3 className="text-lg font-semibold">HTML/CSS/JS Editor</h3>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <textarea value={html} onChange={(e) => setHtml(e.target.value)} className="tech-input h-40" />
        <textarea value={css} onChange={(e) => setCss(e.target.value)} className="tech-input h-40" />
        <textarea value={js} onChange={(e) => setJs(e.target.value)} className="tech-input h-40" />
      </div>
      <iframe title="Preview" srcDoc={srcDoc} className="mt-3 h-48 w-full rounded-lg border" style={{ borderColor: "var(--line)" }} />
    </div>
  );
}

function PasswordLab() {
  const [length, setLength] = useState(14);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = () => {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    const symbols = "!@#$%^&*()_+-=[]{}";
    const pool = includeSymbols ? alphabet + symbols : alphabet;
    let out = "";
    for (let i = 0; i < length; i += 1) {
      out += pool[Math.floor(Math.random() * pool.length)];
    }
    setPassword(out);
  };

  const score = useMemo(() => {
    if (!password) return 0;
    let value = 0;
    if (password.length >= 10) value += 1;
    if (/[A-Z]/.test(password)) value += 1;
    if (/[a-z]/.test(password)) value += 1;
    if (/[0-9]/.test(password)) value += 1;
    if (/[^A-Za-z0-9]/.test(password)) value += 1;
    return value;
  }, [password]);

  const labels = ["Very weak", "Weak", "Medium", "Strong", "Very strong"];

  return (
    <div className="tech-card p-4">
      <h3 className="text-lg font-semibold">Password Strength Lab</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-[140px_1fr] sm:items-end">
        <label className="text-sm">
          Length
          <input
            type="number"
            min={8}
            max={40}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="tech-input mt-1"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} />
          Include symbols
        </label>
      </div>
      <button onClick={generate} className="tech-button mt-3 text-sm">
        Generate Password
      </button>
      <input readOnly value={password} className="tech-input mt-3 font-mono text-sm" placeholder="Generated password appears here" />
      <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
        Strength: {password ? labels[Math.max(0, score - 1)] : "Not generated"}
      </p>
    </div>
  );
}

function ColorPaletteLab() {
  const [hex, setHex] = useState("#2563eb");

  const shades = useMemo(() => {
    const clean = hex.replace("#", "");
    if (!/^[0-9a-fA-F]{6}$/.test(clean)) return [] as string[];

    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);

    return [0.9, 0.7, 0.5, 0.3, 0.1].map((mix) => {
      const nr = Math.round(r + (255 - r) * mix);
      const ng = Math.round(g + (255 - g) * mix);
      const nb = Math.round(b + (255 - b) * mix);
      return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
    });
  }, [hex]);

  return (
    <div className="tech-card p-4">
      <h3 className="text-lg font-semibold">Color Palette Generator</h3>
      <label className="mt-3 block text-sm">
        Base HEX color
        <input value={hex} onChange={(e) => setHex(e.target.value)} className="tech-input mt-1 font-mono" />
      </label>
      <div className="mt-3 grid grid-cols-6 gap-2">
        <div className="rounded-lg border p-2 text-center text-xs" style={{ borderColor: "var(--line)", background: hex }}>
          Base
        </div>
        {shades.map((shade) => (
          <div key={shade} className="rounded-lg border p-2 text-center text-xs" style={{ borderColor: "var(--line)", background: shade }}>
            {shade}
          </div>
        ))}
      </div>
    </div>
  );
}

function RegexTester() {
  const [pattern, setPattern] = useState("tech");
  const [flags, setFlags] = useState("gi");
  const [sample, setSample] = useState("TechHub is where tech meets ideas.");

  let matches: string[] = [];
  let error = "";
  try {
    const regex = new RegExp(pattern, flags);
    matches = Array.from(sample.matchAll(regex)).map((item) => item[0]);
  } catch (err) {
    error = err instanceof Error ? err.message : "Invalid regex";
  }

  return (
    <div className="tech-card p-4">
      <h3 className="text-lg font-semibold">Regex Tester</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_120px]">
        <input value={pattern} onChange={(e) => setPattern(e.target.value)} className="tech-input" placeholder="Pattern" />
        <input value={flags} onChange={(e) => setFlags(e.target.value)} className="tech-input" placeholder="Flags" />
      </div>
      <textarea value={sample} onChange={(e) => setSample(e.target.value)} className="tech-input mt-3 h-28" />
      {error ? (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      ) : (
        <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
          Matches: {matches.length ? matches.join(", ") : "None"}
        </p>
      )}
    </div>
  );
}

function IdAndHashLab() {
  const [text, setText] = useState("TechHub EMSI Fès");
  const [uuids, setUuids] = useState<string[]>([]);

  const makeUuid = () => {
    const next = Array.from({ length: 4 }).map(() => crypto.randomUUID());
    setUuids(next);
  };

  const hash = useMemo(() => {
    let h = 0;
    for (let i = 0; i < text.length; i += 1) {
      h = (h << 5) - h + text.charCodeAt(i);
      h |= 0;
    }
    return `0x${(h >>> 0).toString(16).toUpperCase()}`;
  }, [text]);

  return (
    <div className="tech-card p-4">
      <h3 className="text-lg font-semibold">UUID + Hash Lab</h3>
      <button onClick={makeUuid} className="tech-button mt-3 text-sm">
        Generate UUID Set
      </button>
      <ul className="mt-3 space-y-1 text-xs font-mono" style={{ color: "var(--muted)" }}>
        {uuids.length ? uuids.map((id) => <li key={id}>{id}</li>) : <li>No UUID generated yet.</li>}
      </ul>

      <label className="mt-4 block text-sm">
        Text hash preview
        <input value={text} onChange={(e) => setText(e.target.value)} className="tech-input mt-1" />
      </label>
      <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
        Hash: <span className="font-mono">{hash}</span>
      </p>
    </div>
  );
}

function DeveloperTools() {
  const [jsonInput, setJsonInput] = useState('{"club":"TechHub"}');
  const [text, setText] = useState("where tech meets ideas");
  const [unixInput, setUnixInput] = useState(String(Math.floor(Date.now() / 1000)));

  let pretty = "";
  try {
    pretty = JSON.stringify(JSON.parse(jsonInput), null, 2);
  } catch {
    pretty = "Invalid JSON";
  }

  const timestamp = Number(unixInput);
  const dateText = Number.isFinite(timestamp) ? new Date(timestamp * 1000).toLocaleString() : "Invalid timestamp";

  return (
    <div className="tech-card p-4">
      <h3 className="text-lg font-semibold">Developer Tools</h3>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium">JSON Formatter</p>
          <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} className="tech-input mt-1 h-32" />
          <pre className="mt-2 overflow-auto rounded-lg p-3 text-xs" style={{ background: "var(--surface-2)" }}>
            {pretty}
          </pre>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">Base64 Encoder</p>
            <input value={text} onChange={(e) => setText(e.target.value)} className="tech-input mt-1" />
            <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
              {typeof window === "undefined" ? "" : btoa(text)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Unix Timestamp Converter</p>
            <input value={unixInput} onChange={(e) => setUnixInput(e.target.value)} className="tech-input mt-1" />
            <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
              {dateText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlaygroundTools() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <BaseConverter />
        <LogicGateSimulator />
      </div>
      <AlgorithmVisualizer />
      <CodeEditor />
      <div className="grid gap-4 lg:grid-cols-2">
        <PasswordLab />
        <ColorPaletteLab />
      </div>
      <RegexTester />
      <div className="grid gap-4 lg:grid-cols-2">
        <IdAndHashLab />
        <DeveloperTools />
      </div>
    </div>
  );
}
