// @ts-nocheck — verbatim Figma Make export (unused locals preserved); CustomizeModal handlers patched for TS.
import { useEnrollmentFlowNavigate } from "../enrollmentFlowNav";
import { ep } from "../paths";
import { useEnrollment } from "./enrollment-context";
import {
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Pencil,
  Check,
  ShieldCheck,
  X,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Layers,
  Minus,
  Copy,
  Gauge,
  Phone,
  Sparkles,
  TrendingUp,
  Settings,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState, useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from "react";

/* ─── Data Types ─── */

interface FundDetail {
  name: string;
  ticker: string;
  expense: string;
}

interface AllocationEntry {
  name: string;
  value: number;
  color: string;
  funds: FundDetail[];
}

interface SourceFundAllocation {
  name: string;
  ticker: string;
  expense: string;
  assetClass: string;
  color: string;
  allocation: number;
}

type SourceKey = "roth" | "preTax" | "afterTax";

interface PerSourceAllocations {
  sameForAll: boolean;
  unified: SourceFundAllocation[];
  sources: Record<SourceKey, SourceFundAllocation[]>;
}

const sourceLabels: Record<SourceKey, string> = {
  roth: "Roth",
  preTax: "Pre-Tax",
  afterTax: "After-Tax",
};

const sourceFullLabels: Record<SourceKey, string> = {
  roth: "Roth Contributions",
  preTax: "Pre-Tax Contributions",
  afterTax: "After-Tax Contributions",
};

const sourceTaxLabels: Record<SourceKey, string> = {
  roth: "Tax Free",
  preTax: "Tax Deferred",
  afterTax: "Taxable",
};

const sourceColors: Record<SourceKey, string> = {
  roth: "var(--color-primary)",
  preTax: "var(--color-primary)",
  afterTax: "var(--color-primary)",
};

const sourceBorderColors: Record<SourceKey, string> = {
  roth: "border-[var(--border-default)]",
  preTax: "border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))]",
  afterTax: "border-[var(--border-default)]",
};

const sourceBgColors: Record<SourceKey, string> = {
  roth: "bg-[var(--surface-section)]",
  preTax: "bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]",
  afterTax: "bg-[var(--surface-section)]",
};

/* ─── Static Data ─── */

const allocations: Record<string, AllocationEntry[]> = {
  conservative: [
    {
      name: "Bonds",
      value: 45,
      color: "var(--color-primary)",
      funds: [
        { name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" },
        { name: "PIMCO Income Fund", ticker: "PONAX", expense: "0.59%" },
      ],
    },
    {
      name: "US Stocks",
      value: 25,
      color: "var(--color-primary)",
      funds: [{ name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" }],
    },
    {
      name: "International Stocks",
      value: 15,
      color: "var(--color-primary)",
      funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }],
    },
    {
      name: "Real Estate",
      value: 15,
      color: "var(--color-primary)",
      funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }],
    },
  ],
  balanced: [
    {
      name: "US Stocks",
      value: 40,
      color: "var(--color-primary)",
      funds: [
        { name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" },
        { name: "Vanguard Mid-Cap Index", ticker: "VIMAX", expense: "0.05%" },
      ],
    },
    {
      name: "Bonds",
      value: 25,
      color: "var(--color-primary)",
      funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }],
    },
    {
      name: "International Stocks",
      value: 20,
      color: "var(--color-primary)",
      funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }],
    },
    {
      name: "Real Estate",
      value: 15,
      color: "var(--color-primary)",
      funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }],
    },
  ],
  growth: [
    {
      name: "US Stocks",
      value: 50,
      color: "var(--color-primary)",
      funds: [
        { name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" },
        { name: "Vanguard Growth Index", ticker: "VIGAX", expense: "0.05%" },
      ],
    },
    {
      name: "International Stocks",
      value: 20,
      color: "var(--color-primary)",
      funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }],
    },
    {
      name: "Bonds",
      value: 20,
      color: "var(--color-primary)",
      funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }],
    },
    {
      name: "Real Estate",
      value: 10,
      color: "var(--color-primary)",
      funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }],
    },
  ],
  aggressive: [
    {
      name: "US Stocks",
      value: 50,
      color: "var(--color-primary)",
      funds: [
        { name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" },
        { name: "Vanguard Small-Cap Growth", ticker: "VSGAX", expense: "0.07%" },
      ],
    },
    {
      name: "International Stocks",
      value: 20,
      color: "var(--color-primary)",
      funds: [
        { name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" },
        { name: "Vanguard Emerging Markets", ticker: "VEMAX", expense: "0.14%" },
      ],
    },
    {
      name: "Bonds",
      value: 20,
      color: "var(--color-primary)",
      funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }],
    },
    {
      name: "Real Estate",
      value: 10,
      color: "var(--color-primary)",
      funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }],
    },
  ],
};

const riskLabels: Record<string, string> = {
  conservative: "Conservative Investor",
  balanced: "Balanced Investor",
  growth: "Growth Investor",
  aggressive: "Aggressive Investor",
};

const riskDescriptions: Record<string, string> = {
  conservative:
    "A focus on capital preservation with steady, predictable returns suited for risk-averse retirement planning.",
  balanced: "A mix of growth and stability designed for long-term retirement investing.",
  growth: "Emphasizes long-term capital appreciation while accepting higher short-term volatility.",
  aggressive:
    "Maximizes growth potential through equity-heavy allocations, suited for longer time horizons.",
};

const expectedGrowth: Record<string, string> = {
  conservative: "~4.5%",
  balanced: "~6.8%",
  growth: "~8.2%",
  aggressive: "~9.5%",
};

const riskLevels = [
  { key: "conservative" as const, label: "Conservative", desc: "Lower risk, steadier returns" },
  { key: "balanced" as const, label: "Balanced", desc: "Moderate risk and growth" },
  { key: "growth" as const, label: "Growth", desc: "Higher growth potential" },
  { key: "aggressive" as const, label: "Aggressive", desc: "Maximum growth potential" },
];

// Plan-approved fund catalog
const fundCatalog: SourceFundAllocation[] = [
  { name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%", assetClass: "Equity", color: "var(--color-primary)", allocation: 0 },
  { name: "Vanguard Mid-Cap Index", ticker: "VIMAX", expense: "0.05%", assetClass: "Equity", color: "var(--color-primary)", allocation: 0 },
  { name: "Vanguard Growth Index", ticker: "VIGAX", expense: "0.05%", assetClass: "Equity", color: "var(--color-primary)", allocation: 0 },
  { name: "Vanguard Small-Cap Growth", ticker: "VSGAX", expense: "0.07%", assetClass: "Equity", color: "var(--color-primary)", allocation: 0 },
  { name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%", assetClass: "Fixed Income", color: "var(--color-primary)", allocation: 0 },
  { name: "PIMCO Income Fund", ticker: "PONAX", expense: "0.59%", assetClass: "Fixed Income", color: "var(--color-primary)", allocation: 0 },
  { name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%", assetClass: "International", color: "var(--color-primary)", allocation: 0 },
  { name: "Vanguard Emerging Markets", ticker: "VEMAX", expense: "0.14%", assetClass: "International", color: "var(--color-primary)", allocation: 0 },
  { name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%", assetClass: "Real Estate", color: "var(--color-primary)", allocation: 0 },
];

/* ─── Helpers ─── */

function buildFundsFromRecommended(alloc: AllocationEntry[]): SourceFundAllocation[] {
  return fundCatalog
    .map((fund) => {
      const matchedCategory = alloc.find((cat) => cat.funds.some((f) => f.ticker === fund.ticker));
      if (!matchedCategory) return null;
      const sharePerFund = matchedCategory.value / matchedCategory.funds.length;
      return { ...fund, allocation: Math.round(sharePerFund) };
    })
    .filter((f): f is SourceFundAllocation => f !== null);
}

function fundsToAssetClasses(funds: SourceFundAllocation[]): AllocationEntry[] {
  const grouped: Record<string, { value: number; color: string; funds: FundDetail[] }> = {};
  funds
    .filter((f) => f.allocation > 0)
    .forEach((f) => {
      if (!grouped[f.assetClass]) grouped[f.assetClass] = { value: 0, color: f.color, funds: [] };
      grouped[f.assetClass].value += f.allocation;
      grouped[f.assetClass].funds.push({ name: f.name, ticker: f.ticker, expense: f.expense });
    });
  return Object.entries(grouped).map(([name, d]) => ({ name, value: d.value, color: d.color, funds: d.funds }));
}

function getSourceTotal(funds: SourceFundAllocation[]): number {
  return funds.reduce((s, f) => s + f.allocation, 0);
}

/* ─── Risk Level Calculator ─── */

function computeRiskLevel(funds: SourceFundAllocation[]): { label: string; color: string } {
  const total = funds.reduce((s, f) => s + f.allocation, 0);
  if (total === 0) return { label: "Not Set", color: "text-[var(--text-secondary)]" };
  const equityPct = funds
    .filter((f) => f.assetClass === "Equity" || f.assetClass === "International")
    .reduce((s, f) => s + f.allocation, 0);
  if (equityPct >= 70) return { label: "Aggressive", color: "text-[var(--text-primary)]" };
  if (equityPct >= 50) return { label: "Growth", color: "text-[var(--text-secondary)]" };
  if (equityPct >= 30) return { label: "Balanced", color: "text-[var(--color-primary)]" };
  return { label: "Conservative", color: "text-[var(--color-primary)]" };
}

/* ─── Validation Pill ─── */

function AllocationIndicator({ total, label }: { total: number; label?: string }) {
  const isValid = total === 100;
  const diff = total - 100;
  return (
    <div
      className={`flex items-center justify-between rounded-xl px-3.5 py-2 ${
        isValid ? "bg-[var(--surface-section)]" : "bg-[var(--surface-section)]"
      }`}
    >
      <div className="flex items-center gap-2">
        {isValid ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
        ) : (
          <AlertTriangle className="w-3.5 h-3.5 text-warning" />
        )}
        <span
          className={`text-xs font-medium ${isValid ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}
        >
          {label ? `${label}: ` : ""}
          {isValid ? "Balanced" : diff > 0 ? `${diff}% over` : `${Math.abs(diff)}% remaining`}
        </span>
      </div>
      <span
        className={`tabular-nums text-sm font-bold ${isValid ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}
      >
        {total}%
      </span>
    </div>
  );
}

/* ─── Fund Picker Dropdown ─── */

function FundPicker({
  existingTickers,
  onAdd,
}: {
  existingTickers: string[];
  onAdd: (fund: SourceFundAllocation) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const available = fundCatalog.filter((f) => !existingTickers.includes(f.ticker));

  if (available.length === 0) return null;

  const grouped = available.reduce<Record<string, SourceFundAllocation[]>>((acc, f) => {
    if (!acc[f.assetClass]) acc[f.assetClass] = [];
    acc[f.assetClass].push(f);
    return acc;
  }, {});

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors py-1.5 px-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] text-xs font-medium"
      >
        <Plus className="w-3.5 h-3.5" /> Add Fund
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-10 bg-[var(--surface-card)] border border-[var(--border-default)] rounded-xl  w-72 max-h-64 overflow-y-auto">
          {Object.entries(grouped).map(([cls, funds]) => (
            <div key={cls}>
              <p
                className="px-3 pt-2.5 pb-1 text-[var(--text-secondary)] sticky top-0 bg-[var(--surface-card)] text-xs font-semibold uppercase tracking-wide"
              >
                {cls}
              </p>
              {funds.map((fund) => (
                <button
                  key={fund.ticker}
                  onClick={() => {
                    onAdd({ ...fund, allocation: 0 });
                    setOpen(false);
                  }}
                  className="w-full px-3 py-2 hover:bg-[var(--surface-card)] border border-[var(--border-default)] text-left flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="text-[var(--text-primary)] text-xs">
                      {fund.name}
                    </p>
                    <p className="text-[var(--text-secondary)] text-xs">
                      {fund.ticker} · ER: {fund.expense}
                    </p>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Source Fund List ─── */

function SourceFundList({
  funds,
  onUpdate,
  onRemove,
  onAdd,
}: {
  funds: SourceFundAllocation[];
  onUpdate: (ticker: string, value: number) => void;
  onRemove: (ticker: string) => void;
  onAdd: (fund: SourceFundAllocation) => void;
}) {
  const grouped = funds.reduce<Record<string, SourceFundAllocation[]>>((acc, f) => {
    if (!acc[f.assetClass]) acc[f.assetClass] = [];
    acc[f.assetClass].push(f);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([assetClass, classFunds]) => (
        <div key={assetClass}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: classFunds[0].color }} />
            <p
              className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wide"
            >
              {assetClass}
            </p>
          </div>
          <div className="space-y-2">
            {classFunds.map((fund) => (
              <div key={fund.ticker} className="bg-[var(--surface-card)] border border-[var(--border-default)]  rounded-xl px-3.5 py-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <p className="text-[var(--text-primary)] truncate text-sm font-medium">
                      {fund.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[var(--text-secondary)] text-xs">
                        {fund.ticker}
                      </span>
                      <span className="text-[var(--text-secondary)]">·</span>
                      <span className="text-[var(--text-secondary)] text-xs">
                        ER: {fund.expense}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={() => onUpdate(fund.ticker, Math.max(0, fund.allocation - 1))}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)] border border-[var(--border-default)] transition-colors border border-[var(--border-default)]"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <div className="flex items-center gap-0.5 bg-[var(--surface-card)] border border-[var(--border-default)] rounded-lg px-2 py-0.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={fund.allocation}
                        onChange={(e) => {
                          const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                          onUpdate(fund.ticker, val);
                        }}
                        className="w-9 min-h-[1.5rem] text-right bg-transparent border-none text-[var(--text-primary)] tabular-nums focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-1 focus:ring-offset-[var(--surface-page)] rounded-sm text-sm font-semibold"
                      />
                      <span className="text-[var(--text-secondary)] text-xs">%</span>
                    </div>
                    <button
                      onClick={() => onUpdate(fund.ticker, Math.min(100, fund.allocation + 1))}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)] border border-[var(--border-default)] transition-colors border border-[var(--border-default)]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRemove(fund.ticker)}
                      className="ml-0.5 flex h-6 w-6 items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[color-mix(in_srgb,var(--text-primary)_08%,transparent)] hover:text-[var(--text-primary)]"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={fund.allocation}
                  onChange={(e) => onUpdate(fund.ticker, parseInt(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-section)] accent-[var(--color-primary)]"
                  style={{
                    background: `linear-gradient(to right, ${fund.color} 0%, ${fund.color} ${fund.allocation}%, var(--surface-section) ${fund.allocation}%, var(--surface-section) 100%)`,
                    accentColor: "var(--color-primary)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <FundPicker existingTickers={funds.map((f) => f.ticker)} onAdd={onAdd} />
    </div>
  );
}

/* ─── Copy Portfolio Menu ─── */

function CopyPortfolioMenu({
  currentSource,
  activeSources,
  contributionSources,
  onCopy,
}: {
  currentSource: SourceKey;
  activeSources: SourceKey[];
  contributionSources: { preTax: number; roth: number; afterTax: number };
  onCopy: (fromSource: SourceKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const otherSources = activeSources.filter((s) => s !== currentSource);
  if (otherSources.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-1 px-2 rounded-lg hover:bg-[var(--surface-card)] border border-[var(--border-default)] text-xs font-medium"
      >
        <Copy className="w-3 h-3" /> Copy from
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-10 bg-[var(--surface-card)] border border-[var(--border-default)] rounded-xl  w-52 py-1">
          {otherSources.map((src) => (
            <button
              key={src}
              onClick={() => {
                onCopy(src);
                setOpen(false);
              }}
              className="w-full px-3 py-2 hover:bg-[var(--surface-card)] border border-[var(--border-default)] text-left flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sourceColors[src] }} />
                <span className="text-[var(--text-primary)] text-xs">
                  {sourceLabels[src]} ({contributionSources[src]}%)
                </span>
              </div>
              <ArrowRight className="w-3 h-3 text-[var(--text-secondary)]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Customize Modal ─── */

// Reusable Portfolio Editor Content Component
function PortfolioEditorContent({
  allocs,
  setAllocs,
  activeSources,
  contributionSources,
  activeTab,
  setActiveTab,
}: {
  allocs: PerSourceAllocations;
  setAllocs: React.Dispatch<React.SetStateAction<PerSourceAllocations>>;
  activeSources: SourceKey[];
  contributionSources: { preTax: number; roth: number; afterTax: number };
  activeTab: SourceKey;
  setActiveTab: (tab: SourceKey) => void;
}) {
  const updateUnifiedFund = useCallback((ticker: string, value: number) => {
    setAllocs((prev) => ({
      ...prev,
      unified: prev.unified.map((f) => (f.ticker === ticker ? { ...f, allocation: value } : f)),
    }));
  }, [setAllocs]);

  const removeUnifiedFund = useCallback((ticker: string) => {
    setAllocs((prev) => ({
      ...prev,
      unified: prev.unified.filter((f) => f.ticker !== ticker),
    }));
  }, [setAllocs]);

  const addUnifiedFund = useCallback((fund: SourceFundAllocation) => {
    setAllocs((prev) => ({ ...prev, unified: [...prev.unified, fund] }));
  }, [setAllocs]);

  const updateSourceFund = useCallback((source: SourceKey, ticker: string, value: number) => {
    setAllocs((prev) => ({
      ...prev,
      sources: {
        ...prev.sources,
        [source]: prev.sources[source].map((f) => (f.ticker === ticker ? { ...f, allocation: value } : f)),
      },
    }));
  }, [setAllocs]);

  const removeSourceFund = useCallback((source: SourceKey, ticker: string) => {
    setAllocs((prev) => ({
      ...prev,
      sources: {
        ...prev.sources,
        [source]: prev.sources[source].filter((f) => f.ticker !== ticker),
      },
    }));
  }, [setAllocs]);

  const addSourceFund = useCallback((source: SourceKey, fund: SourceFundAllocation) => {
    setAllocs((prev) => ({
      ...prev,
      sources: {
        ...prev.sources,
        [source]: [...prev.sources[source], fund],
      },
    }));
  }, [setAllocs]);

  const toggleSameForAll = () => {
    setAllocs((prev) => {
      if (prev.sameForAll) {
        const newSources = { ...prev.sources };
        activeSources.forEach((src) => {
          if (newSources[src].length === 0) {
            newSources[src] = prev.unified.map((f) => ({ ...f }));
          }
        });
        return { ...prev, sameForAll: false, sources: newSources };
      } else {
        return { ...prev, sameForAll: true };
      }
    });
  };

  const unifiedTotal = getSourceTotal(allocs.unified);
  const sourceTotals = activeSources.map((src) => ({
    key: src,
    total: getSourceTotal(allocs.sources[src]),
  }));

  const currentFundsForChart = allocs.sameForAll ? allocs.unified : allocs.sources[activeTab];

  const chartData = Object.entries(
    (currentFundsForChart || [])
      .filter((f) => f.allocation > 0)
      .reduce<Record<string, { value: number; color: string }>>((acc, f) => {
        if (!acc[f.assetClass]) acc[f.assetClass] = { value: 0, color: f.color };
        acc[f.assetClass].value += f.allocation;
        return acc;
      }, {})
  ).map(([name, d]) => ({ name, ...d }));

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Same-for-all toggle */}
      {activeSources.length > 1 && (
        <div>
          <button
            onClick={toggleSameForAll}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
              allocs.sameForAll
                ? "border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]"
                : "border-[var(--border-default)] bg-[var(--surface-card)] border border-[var(--border-default)]"
            }`}
          >
            {allocs.sameForAll ? (
              <ToggleRight className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
            )}
            <div className="text-left flex-1">
              <p
                className={`text-sm font-medium ${allocs.sameForAll ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}
              >
                Same portfolio for all sources
              </p>
              <p className="text-[var(--text-secondary)] text-xs">
                {allocs.sameForAll
                  ? "One allocation applies to all contribution sources."
                  : "Customize each source independently."}
              </p>
            </div>
            {!allocs.sameForAll && (
              <div className="flex items-center gap-1 shrink-0">
                <Layers className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <span className="text-[var(--text-secondary)] text-xs">
                  {activeSources.length} sources
                </span>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Asset Class Summary + Risk Level */}
      {chartData.length > 0 && (
        <div className="flex items-center gap-4 bg-[var(--surface-card)] border border-[var(--border-default)]  rounded-xl px-4 py-3">
          <div className="w-14 h-14 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={16}
                  outerRadius={26}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {chartData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-[var(--text-secondary)] text-xs">
                    {d.name}:{" "}
                    <span className="text-[var(--text-primary)] font-semibold">{d.value}%</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Gauge className="w-3 h-3 text-[var(--text-secondary)]" />
              <span className="text-[var(--text-secondary)] text-xs">
                Risk:{" "}
                <span className={`${computeRiskLevel(currentFundsForChart || []).color} font-semibold`}>
                  {computeRiskLevel(currentFundsForChart || []).label}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {allocs.sameForAll ? (
        <div>
          {allocs.unified.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[var(--text-secondary)] text-sm">
                No funds selected. Add funds to build your portfolio.
              </p>
              <div className="mt-3 flex justify-center">
                <FundPicker existingTickers={[]} onAdd={addUnifiedFund} />
              </div>
            </div>
          ) : (
            <SourceFundList
              funds={allocs.unified}
              onUpdate={updateUnifiedFund}
              onRemove={removeUnifiedFund}
              onAdd={addUnifiedFund}
            />
          )}
          <div className="mt-4 space-y-2">
            <AllocationIndicator total={unifiedTotal} label="Total Allocation" />
          </div>
        </div>
      ) : (
        <div>
          {/* Source tabs */}
          <div className="flex gap-1 bg-[var(--surface-card)] border border-[var(--border-default)]  rounded-xl p-1 mb-4">
            {activeSources.map((src) => {
              const srcTotal = getSourceTotal(allocs.sources[src]);
              const srcValid = srcTotal === 100;
              return (
                <button
                  key={src}
                  onClick={() => setActiveTab(src)}
                  className={`flex-1 rounded-lg py-2 px-3 transition-all flex items-center justify-center gap-2 ${
                    activeTab === src ? "bg-[var(--surface-card)] " : "hover:bg-[var(--surface-card)] border border-[var(--border-default)]"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: sourceColors[src] }}
                  />
                  <span
                    className={`text-xs ${activeTab === src ? "text-[var(--text-primary)] font-semibold" : "text-[var(--text-secondary)] font-normal"}`}
                  >
                    {sourceLabels[src]}
                  </span>
                  {srcTotal > 0 && (
                    <span className={`shrink-0 ${srcValid ? "text-[var(--color-primary)]" : "text-warning"}`}>
                      {srcValid ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <span className="text-xs font-semibold text-[var(--text-primary)]">{srcTotal}%</span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: sourceColors[activeTab] }}
                />
                <p className="text-[var(--text-primary)] text-sm font-semibold">
                  {sourceLabels[activeTab]} Portfolio
                </p>
              </div>
              {activeSources.length > 1 && (
                <CopyPortfolioMenu
                  currentSource={activeTab}
                  activeSources={activeSources}
                  contributionSources={contributionSources}
                  onCopy={(fromSource) => {
                    setAllocs((prev) => ({
                      ...prev,
                      sources: {
                        ...prev.sources,
                        [activeTab]: prev.sources[fromSource].map((f) => ({ ...f })),
                      },
                    }));
                  }}
                />
              )}
            </div>

            {allocs.sources[activeTab].length === 0 ? (
              <div className="text-center py-6 bg-[var(--surface-card)] border border-[var(--border-default)]  rounded-xl">
                <p className="text-[var(--text-secondary)] mb-2 text-sm">
                  No funds selected for {sourceLabels[activeTab]}.
                </p>
                <div className="flex justify-center">
                  <FundPicker
                    existingTickers={[]}
                    onAdd={(fund) => addSourceFund(activeTab, fund)}
                  />
                </div>
              </div>
            ) : (
              <SourceFundList
                funds={allocs.sources[activeTab]}
                onUpdate={(ticker, val) => updateSourceFund(activeTab, ticker, val)}
                onRemove={(ticker) => removeSourceFund(activeTab, ticker)}
                onAdd={(fund) => addSourceFund(activeTab, fund)}
              />
            )}

            <div className="mt-3 space-y-2">
              <AllocationIndicator
                total={getSourceTotal(allocs.sources[activeTab])}
                label={`${sourceLabels[activeTab]} Allocation`}
              />
            </div>
          </div>

          {/* All-source validation summary */}
          <div className="border-t border-[var(--border-default)] pt-3 mt-4 space-y-1.5">
            <p
              className="text-[var(--text-secondary)] mb-1 text-xs font-semibold uppercase tracking-wide"
            >
              All Sources
            </p>
            {sourceTotals.map((s) => (
              <div
                key={s.key}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg ${
                  s.total === 100 ? "bg-[var(--surface-section)]" : "bg-[var(--surface-section)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {s.total === 100 ? (
                    <CheckCircle2 className="w-3 h-3 text-[var(--color-primary)]" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-warning" />
                  )}
                  <span
                    className={`text-xs font-medium ${s.total === 100 ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}
                  >
                    {sourceLabels[s.key]}
                  </span>
                </div>
                <span
                  className={`tabular-nums text-xs font-semibold ${s.total === 100 ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}
                >
                  {s.total}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomizeModal({
  isOpen,
  onClose,
  initialAllocations,
  activeSources,
  contributionSources,
  onSave,
  initialTab,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialAllocations: PerSourceAllocations;
  activeSources: SourceKey[];
  contributionSources: { preTax: number; roth: number; afterTax: number };
  onSave: (allocs: PerSourceAllocations) => void;
  initialTab?: SourceKey;
}) {
  const [allocs, setAllocs] = useState<PerSourceAllocations>(initialAllocations);
  const [activeTab, setActiveTab] = useState<SourceKey>(initialTab || activeSources[0] || "preTax");
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAllocs(initialAllocations);
      setActiveTab(initialTab || activeSources[0] || "preTax");
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialAllocations, activeSources, initialTab]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleReset = () => setAllocs(initialAllocations);

  const updateUnifiedFund = useCallback((ticker: string, value: number) => {
    setAllocs((prev) => ({
      ...prev,
      unified: prev.unified.map((f) => (f.ticker === ticker ? { ...f, allocation: value } : f)),
    }));
  }, []);

  const removeUnifiedFund = useCallback((ticker: string) => {
    setAllocs((prev) => ({
      ...prev,
      unified: prev.unified.filter((f) => f.ticker !== ticker),
    }));
  }, []);

  const addUnifiedFund = useCallback((fund: SourceFundAllocation) => {
    setAllocs((prev) => ({ ...prev, unified: [...prev.unified, fund] }));
  }, []);

  const updateSourceFund = useCallback((source: SourceKey, ticker: string, value: number) => {
    setAllocs((prev) => ({
      ...prev,
      sources: {
        ...prev.sources,
        [source]: prev.sources[source].map((f) => (f.ticker === ticker ? { ...f, allocation: value } : f)),
      },
    }));
  }, []);

  const removeSourceFund = useCallback((source: SourceKey, ticker: string) => {
    setAllocs((prev) => ({
      ...prev,
      sources: {
        ...prev.sources,
        [source]: prev.sources[source].filter((f) => f.ticker !== ticker),
      },
    }));
  }, []);

  const addSourceFund = useCallback((source: SourceKey, fund: SourceFundAllocation) => {
    setAllocs((prev) => ({
      ...prev,
      sources: {
        ...prev.sources,
        [source]: [...prev.sources[source], fund],
      },
    }));
  }, []);

  const toggleSameForAll = () => {
    setAllocs((prev) => {
      if (prev.sameForAll) {
        const newSources = { ...prev.sources };
        activeSources.forEach((src) => {
          if (newSources[src].length === 0) {
            newSources[src] = prev.unified.map((f) => ({ ...f }));
          }
        });
        return { ...prev, sameForAll: false, sources: newSources };
      } else {
        return { ...prev, sameForAll: true };
      }
    });
  };

  const currentFundsForChart = allocs.sameForAll ? allocs.unified : allocs.sources[activeTab];

  const chartData = Object.entries(
    (currentFundsForChart || [])
      .filter((f) => f.allocation > 0)
      .reduce<Record<string, { value: number; color: string }>>((acc, f) => {
        if (!acc[f.assetClass]) acc[f.assetClass] = { value: 0, color: f.color };
        acc[f.assetClass].value += f.allocation;
        return acc;
      }, {})
  ).map(([name, d]) => ({ name, ...d }));

  const unifiedTotal = getSourceTotal(allocs.unified);
  const sourceTotals = activeSources.map((src) => ({
    key: src,
    total: getSourceTotal(allocs.sources[src]),
  }));

  const allValid = allocs.sameForAll
    ? unifiedTotal === 100
    : sourceTotals.every((s) => s.total === 100);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] p-4"
    >
      <div className="card-standard flex max-h-[90vh] w-full max-w-2xl flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)]">
          <div>
            <h2 className="text-[var(--text-primary)] text-lg">
              Edit Portfolio
            </h2>
            <p className="text-[var(--text-secondary)] mt-0.5 text-xs">
              {allocs.sameForAll
                ? "Set fund allocations for all contribution sources."
                : `Editing ${sourceLabels[activeTab]} contribution portfolio.`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-card)] border border-[var(--border-default)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Same-for-all toggle */}
        {activeSources.length > 1 && (
          <div className="px-6 pt-4">
            <button
              onClick={toggleSameForAll}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
                allocs.sameForAll
                  ? "border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]"
                  : "border-[var(--border-default)] bg-[var(--surface-card)] border border-[var(--border-default)]"
              }`}
            >
              {allocs.sameForAll ? (
                <ToggleRight className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
              )}
              <div className="text-left flex-1">
                <p
                  className={`text-sm font-medium ${allocs.sameForAll ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}
                >
                  Same portfolio for all sources
                </p>
                <p className="text-[var(--text-secondary)] text-xs">
                  {allocs.sameForAll
                    ? "One allocation applies to all contribution sources."
                    : "Customize each source independently."}
                </p>
              </div>
              {!allocs.sameForAll && (
                <div className="flex items-center gap-1 shrink-0">
                  <Layers className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)] text-xs">
                    {activeSources.length} sources
                  </span>
                </div>
              )}
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Asset Class Summary + Risk Level */}
          {chartData.length > 0 && (
            <div className="flex items-center gap-4 bg-[var(--surface-card)] border border-[var(--border-default)]  rounded-xl px-4 py-3">
              <div className="w-14 h-14 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={16}
                      outerRadius={26}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {chartData.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-[var(--text-secondary)] text-xs">
                        {d.name}:{" "}
                        <span className="text-[var(--text-primary)] font-semibold">{d.value}%</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Gauge className="w-3 h-3 text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)] text-xs">
                    Risk:{" "}
                    <span className={`${computeRiskLevel(currentFundsForChart || []).color} font-semibold`}>
                      {computeRiskLevel(currentFundsForChart || []).label}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {allocs.sameForAll ? (
            <div>
              {allocs.unified.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[var(--text-secondary)] text-sm">
                    No funds selected. Add funds to build your portfolio.
                  </p>
                  <div className="mt-3 flex justify-center">
                    <FundPicker existingTickers={[]} onAdd={addUnifiedFund} />
                  </div>
                </div>
              ) : (
                <SourceFundList
                  funds={allocs.unified}
                  onUpdate={updateUnifiedFund}
                  onRemove={removeUnifiedFund}
                  onAdd={addUnifiedFund}
                />
              )}
              <div className="mt-4 space-y-2">
                <AllocationIndicator total={unifiedTotal} label="Total Allocation" />
              </div>
            </div>
          ) : (
            <div>
              {/* Source tabs */}
              <div className="flex gap-1 bg-[var(--surface-card)] border border-[var(--border-default)]  rounded-xl p-1 mb-4">
                {activeSources.map((src) => {
                  const srcTotal = getSourceTotal(allocs.sources[src]);
                  const srcValid = srcTotal === 100;
                  return (
                    <button
                      key={src}
                      onClick={() => setActiveTab(src)}
                      className={`flex-1 rounded-lg py-2 px-3 transition-all flex items-center justify-center gap-2 ${
                        activeTab === src ? "bg-[var(--surface-card)] " : "hover:bg-[var(--surface-card)] border border-[var(--border-default)]"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: sourceColors[src] }}
                      />
                      <span
                        className={`text-xs ${activeTab === src ? "text-[var(--text-primary)] font-semibold" : "text-[var(--text-secondary)] font-normal"}`}
                      >
                        {sourceLabels[src]}
                      </span>
                      {srcTotal > 0 && (
                        <span className={`shrink-0 ${srcValid ? "text-[var(--color-primary)]" : "text-warning"}`}>
                          {srcValid ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <span className="text-xs font-semibold text-[var(--text-primary)]">{srcTotal}%</span>
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: sourceColors[activeTab] }}
                    />
                    <p className="text-[var(--text-primary)] text-sm font-semibold">
                      {sourceLabels[activeTab]} Portfolio
                    </p>
                  </div>
                  {activeSources.length > 1 && (
                    <CopyPortfolioMenu
                      currentSource={activeTab}
                      activeSources={activeSources}
                      contributionSources={contributionSources}
                      onCopy={(fromSource) => {
                        setAllocs((prev) => ({
                          ...prev,
                          sources: {
                            ...prev.sources,
                            [activeTab]: prev.sources[fromSource].map((f) => ({ ...f })),
                          },
                        }));
                      }}
                    />
                  )}
                </div>

                {allocs.sources[activeTab].length === 0 ? (
                  <div className="text-center py-6 bg-[var(--surface-card)] border border-[var(--border-default)]  rounded-xl">
                    <p className="text-[var(--text-secondary)] mb-2 text-sm">
                      No funds selected for {sourceLabels[activeTab]}.
                    </p>
                    <div className="flex justify-center">
                      <FundPicker
                        existingTickers={[]}
                        onAdd={(fund) => addSourceFund(activeTab, fund)}
                      />
                    </div>
                  </div>
                ) : (
                  <SourceFundList
                    funds={allocs.sources[activeTab]}
                    onUpdate={(ticker, val) => updateSourceFund(activeTab, ticker, val)}
                    onRemove={(ticker) => removeSourceFund(activeTab, ticker)}
                    onAdd={(fund) => addSourceFund(activeTab, fund)}
                  />
                )}

                <div className="mt-3 space-y-2">
                  <AllocationIndicator
                    total={getSourceTotal(allocs.sources[activeTab])}
                    label={`${sourceLabels[activeTab]} Allocation`}
                  />
                </div>
              </div>

              {/* All-source validation summary */}
              <div className="border-t border-[var(--border-default)] pt-3 mt-4 space-y-1.5">
                <p
                  className="text-[var(--text-secondary)] mb-1 text-xs font-semibold uppercase tracking-wide"
                >
                  All Sources
                </p>
                {sourceTotals.map((s) => (
                  <div
                    key={s.key}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg ${
                      s.total === 100 ? "bg-[var(--surface-section)]" : "bg-[var(--surface-section)]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {s.total === 100 ? (
                        <CheckCircle2 className="w-3 h-3 text-[var(--color-primary)]" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-warning" />
                      )}
                      <span
                        className={`text-xs font-medium ${s.total === 100 ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}
                      >
                        {sourceLabels[s.key]}
                      </span>
                    </div>
                    <span
                      className={`tabular-nums text-xs font-semibold ${s.total === 100 ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}
                    >
                      {s.total}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border-default)] px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-3 py-2 text-sm font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-card)] border border-[var(--border-default)] transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (allValid) onSave(allocs);
              }}
              disabled={!allValid}
              className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all text-sm font-medium ${
                allValid
                  ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
                  : "bg-[var(--surface-section)] text-[var(--text-secondary)] cursor-not-allowed"
              }`}
            >
              <Check className="w-4 h-4" /> Save Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Source Card ─── */

function SourceCard({
  sourceKey,
  monthlyAmount,
  funds,
  isCustomized,
  onEditPortfolio,
}: {
  sourceKey: SourceKey;
  monthlyAmount: number;
  funds: SourceFundAllocation[];
  isCustomized: boolean;
  onEditPortfolio: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const activeFunds = funds.filter((f) => f.allocation > 0);
  const fundCount = activeFunds.length;

  // Asset class summary
  const assetSummary = Object.entries(
    activeFunds.reduce<Record<string, { value: number; color: string }>>((acc, f) => {
      if (!acc[f.assetClass]) acc[f.assetClass] = { value: 0, color: f.color };
      acc[f.assetClass].value += f.allocation;
      return acc;
    }, {})
  ).map(([name, d]) => ({ name, ...d }));

  return (
    <div className={`card-standard overflow-hidden ${sourceBorderColors[sourceKey]}`}>
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: sourceColors[sourceKey] }}
              />
              <p className="text-[var(--text-primary)] text-sm font-semibold">
                {sourceFullLabels[sourceKey]}
              </p>
              <span
                className={`${sourceBgColors[sourceKey]} px-1.5 py-0.5 rounded text-xs font-semibold tracking-wide`}
              >
                <span style={{ color: sourceColors[sourceKey] }}>{sourceTaxLabels[sourceKey]}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[var(--text-primary)] text-sm font-medium">
                ${Math.round(monthlyAmount).toLocaleString()}/mo
              </span>
              <span className="text-[var(--text-secondary)]">·</span>
              <span className="text-[var(--text-secondary)] text-xs">
                {fundCount} {fundCount === 1 ? "fund" : "funds"}
              </span>
              {isCustomized && (
                <>
                  <span className="text-[var(--text-secondary)]">·</span>
                  <span className="text-[var(--color-primary)] text-xs font-medium">
                    Customized
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onEditPortfolio}
            className="shrink-0 text-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
          >
            <Pencil className="w-3.5 h-3.5 inline mr-1.5" />
            Edit
          </button>
        </div>

        {/* Asset class summary bars */}
        {assetSummary.length > 0 && (
          <div className="mt-3">
            {/* Stacked bar */}
            <div className="flex rounded-full h-2 overflow-hidden">
              {assetSummary.map((a) => (
                <div
                  key={a.name}
                  style={{ width: `${a.value}%`, backgroundColor: a.color }}
                  className="transition-all"
                />
              ))}
            </div>
            {/* Labels */}
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2">
              {assetSummary.map((a) => (
                <div key={a.name} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                  <span className="text-[var(--text-secondary)] text-xs">
                    {a.name}{" "}
                    <span className="text-[var(--text-primary)] font-semibold">{a.value}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fund preview */}
        {activeFunds.length > 0 && (
          <div className="mt-2.5 space-y-0.5">
            {activeFunds.slice(0, 2).map((fund) => (
              <p key={fund.ticker} className="text-[var(--text-secondary)] truncate text-xs">
                {fund.name}
              </p>
            ))}
            {activeFunds.length > 2 && (
              <p className="text-[var(--text-secondary)] text-xs">
                +{activeFunds.length - 2} more {activeFunds.length - 2 === 1 ? "fund" : "funds"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Expandable fund details */}
      {fundCount > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full border-t border-[var(--border-default)] px-4 py-2 flex items-center justify-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-card)] border border-[var(--border-default)] transition-colors text-xs font-medium"
          >
            {expanded ? "Hide" : "View"} funds
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {expanded && (
            <div className="border-t border-[var(--border-default)] px-4 py-3 space-y-2">
              {activeFunds.map((fund) => (
                <div key={fund.ticker} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-[var(--text-primary)] text-xs">
                      {fund.name}
                    </p>
                    <p className="text-[var(--text-secondary)] text-xs">
                      {fund.ticker} · ER: {fund.expense}
                    </p>
                  </div>
                  <span className="text-[var(--text-primary)] tabular-nums text-sm font-semibold">
                    {fund.allocation}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Inactive Source Card ─── */

function InactiveSourceCard({ sourceKey }: { sourceKey: SourceKey }) {
  return (
    <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] px-4 py-3.5 shadow-[var(--shadow-card)] flex items-center gap-3 opacity-60">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: sourceColors[sourceKey] }}
      />
      <div>
        <p className="text-[var(--text-secondary)] text-sm font-medium">
          {sourceFullLabels[sourceKey]}
        </p>
        <p className="text-[var(--text-secondary)] text-xs">
          Not currently used
        </p>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

export function InvestmentStrategy() {
  const navigate = useEnrollmentFlowNavigate();
  const { data, updateData, personalization, setCurrentStep } = useEnrollment();
  const [showRiskEditor, setShowRiskEditor] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showBuildPortfolioModal, setShowBuildPortfolioModal] = useState(false);
  const [editingSource, setEditingSource] = useState<SourceKey | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<SourceKey>("preTax");
  const [customAllocations, setCustomAllocations] = useState<PerSourceAllocations | null>(null);
  const [inlineAllocs, setInlineAllocs] = useState<PerSourceAllocations | null>(null);
  const [inlineActiveTab, setInlineActiveTab] = useState<SourceKey>("preTax");

  const currentAllocation = allocations[data.riskLevel];
  const defaultFunds = buildFundsFromRecommended(currentAllocation);

  // Determine active contribution sources
  const activeSources: SourceKey[] = [];
  if (data.contributionSources.roth > 0) activeSources.push("roth");
  if (data.contributionSources.preTax > 0) activeSources.push("preTax");
  if (data.supportsAfterTax && data.contributionSources.afterTax > 0) activeSources.push("afterTax");
  if (activeSources.length === 0) activeSources.push("preTax");

  // All possible sources for showing inactive
  const allSources: SourceKey[] = ["roth", "preTax", "afterTax"];
  const inactiveSources = allSources.filter(
    (s) => !activeSources.includes(s) && (s !== "afterTax" || data.supportsAfterTax)
  );

  // Get funds for a specific source
  const getFundsForSource = (src: SourceKey): SourceFundAllocation[] => {
    if (!customAllocations) return defaultFunds;
    if (customAllocations.sameForAll) return customAllocations.unified;
    return customAllocations.sources[src];
  };

  // Check if a source has been customized
  const isSourceCustomized = (src: SourceKey): boolean => {
    if (!customAllocations) return false;
    return true;
  };

  // Monthly contribution per source
  const monthlyTotal = (data.salary * data.contributionPercent) / 100 / 12;
  const getMonthlyForSource = (src: SourceKey): number => {
    const pct = data.contributionSources[src];
    return monthlyTotal * (pct / 100);
  };

  const handleNext = () => {
    updateData({ useRecommendedPortfolio: !customAllocations });
    setCurrentStep(6);
    navigate(ep("readiness"));
  };

  const handleOpenCustomize = (sourceKey: SourceKey) => {
    const initial: PerSourceAllocations = customAllocations || {
      sameForAll: activeSources.length === 1,
      unified: defaultFunds.map((f) => ({ ...f })),
      sources: {
        roth: defaultFunds.map((f) => ({ ...f })),
        preTax: defaultFunds.map((f) => ({ ...f })),
        afterTax: defaultFunds.map((f) => ({ ...f })),
      },
    };
    
    // If we're in the Build Portfolio Modal, show inline editor
    if (showBuildPortfolioModal) {
      setInlineAllocs(initial);
      setInlineActiveTab(sourceKey);
      setEditingSource(sourceKey);
    } else {
      // Otherwise, open the standalone modal
      setCustomAllocations(initial);
      setModalInitialTab(sourceKey);
      setShowCustomizeModal(true);
    }
  };

  const handleSaveCustom = (allocs: PerSourceAllocations) => {
    setCustomAllocations(allocs);
    setShowCustomizeModal(false);
  };

  const handleSaveInline = () => {
    if (inlineAllocs) {
      setCustomAllocations(inlineAllocs);
    }
    setEditingSource(null);
  };

  const handleCloseInline = () => {
    setEditingSource(null);
    setInlineAllocs(null);
  };

  // Compute blended overall allocation for the sidebar
  const overallAllocationData = (() => {
    const totalContrib = activeSources.reduce(
      (sum, src) => sum + data.contributionSources[src],
      0
    );
    if (totalContrib === 0) return [];

    const blended: Record<string, { value: number; color: string }> = {};
    activeSources.forEach((src) => {
      const weight = data.contributionSources[src] / totalContrib;
      const funds = getFundsForSource(src).filter((f) => f.allocation > 0);
      funds.forEach((f) => {
        if (!blended[f.assetClass]) blended[f.assetClass] = { value: 0, color: f.color };
        blended[f.assetClass].value += f.allocation * weight;
      });
    });

    return Object.entries(blended)
      .map(([name, d]) => ({ name, value: Math.round(d.value), color: d.color }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  })();

  // Compute overall portfolio risk level from blended funds
  const overallRiskLevel = (() => {
    const totalContrib = activeSources.reduce(
      (sum, src) => sum + data.contributionSources[src],
      0
    );
    if (totalContrib === 0) return { label: "Not Set", color: "text-[var(--text-secondary)]" };
    const allFundsBlended: SourceFundAllocation[] = [];
    activeSources.forEach((src) => {
      const weight = data.contributionSources[src] / totalContrib;
      getFundsForSource(src)
        .filter((f) => f.allocation > 0)
        .forEach((f) => {
          allFundsBlended.push({ ...f, allocation: f.allocation * weight });
        });
    });
    return computeRiskLevel(allFundsBlended);
  })();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header — full width */}
      <div className="mb-5">
        <button
          onClick={() => {
            setCurrentStep(4);
            navigate(data.autoIncrease ? ep("auto-increase-setup") : ep("auto-increase"));
          }}
          className="flex items-center gap-1 text-[var(--text-secondary)] mb-3 hover:text-[var(--text-primary)] text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Your Investment Strategy</h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          See how each contribution source is invested.
        </p>
      </div>

      <div className="space-y-5">
        {/* Investment Style Card */}
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] flex items-center justify-center shrink-0">
                <Gauge className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <p
                  className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wide"
                >
                  Investment Style
                </p>
                <p className="text-[var(--text-primary)] text-base font-bold">
                  {riskLabels[data.riskLevel]}
                </p>
                <p className="text-[var(--text-secondary)] mt-0.5 text-xs">
                  {riskDescriptions[data.riskLevel]}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRiskEditor(!showRiskEditor)}
              className="flex items-center gap-1.5 text-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors shrink-0 text-sm font-medium"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Investment Strategy
            </button>
          </div>

          {showRiskEditor && (
            <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {riskLevels.map((level) => (
                  <button
                    key={level.key}
                    onClick={() => {
                      updateData({ riskLevel: level.key });
                      setShowRiskEditor(false);
                      setCustomAllocations(null);
                    }}
                    className={`rounded-xl border-2 p-3 text-center transition-all ${
                      data.riskLevel === level.key
                        ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]"
                        : "border-[var(--border-default)] bg-[var(--surface-section)] hover:border-[var(--color-primary)]/25"
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold ${data.riskLevel === level.key ? "text-[var(--color-primary)]" : "text-[var(--text-primary)]"}`}
                    >
                      {level.label}
                    </p>
                    <p className="text-[var(--text-secondary)] mt-0.5 text-xs">
                      {level.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Plan Default Investment and Advisor Cards - 60/40 Split */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Plan Default Investment Card - 60% */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
              {/* Header with Badge, Title, and Metrics */}
              <div className="flex items-start justify-between gap-6 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="px-2.5 py-1 bg-[color-mix(in_srgb,var(--color-primary)_15%,var(--surface-card))] rounded-md">
                      <p className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-wide">
                        Recommended
                      </p>
                    </div>
                  </div>
                  <h3 className="text-[var(--text-primary)] text-lg font-bold">
                    Plan Default Investment
                  </h3>
                  <p className="text-[var(--text-secondary)] mt-1 text-xs">
                    Professionally managed, diversified portfolio
                  </p>
                </div>

                {/* Key Metrics - Compact */}
                <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-section)] px-4 py-3 space-y-1.5 shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--text-secondary)] text-xs">Return:</span>
                    <span className="text-[var(--text-primary)] text-xs font-semibold">~6–7%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--text-secondary)] text-xs">Risk:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[var(--text-primary)] text-xs font-semibold">Low</span>
                      <div className="flex gap-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)]"></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--surface-section)]"></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--surface-section)]"></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--surface-section)]"></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--surface-section)]"></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--text-secondary)] text-xs">Timeline:</span>
                    <span className="text-[var(--text-primary)] text-xs font-semibold">10+ years</span>
                  </div>
                </div>
              </div>

              {/* Allocation Preview */}
              <div className="mb-4 rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] p-4">
                <div className="space-y-2.5">
                  {currentAllocation.map((a) => (
                    <div key={a.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                        <span className="text-[var(--text-primary)] text-xs">
                          {a.name}
                        </span>
                      </div>
                      <span className="text-[var(--text-primary)] tabular-nums text-sm font-semibold">
                        {a.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why this works */}
              <div className="bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] border border-[color-mix(in_srgb,var(--color-primary)_15%,var(--border-default))] rounded-xl p-3 mb-4">
                <p className="text-[var(--text-primary)] mb-1 text-xs font-semibold">
                  Why this works for you:
                </p>
                <p className="text-[var(--text-primary)] text-xs leading-normal">
                  Balanced for growth with your retirement timeline
                </p>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleNext}
                className="w-full bg-[var(--color-primary)] text-[var(--primary-foreground)] py-3 px-6 rounded-xl hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm font-semibold"
              >
                Continue with recommended plan <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          {/* Customize Portfolio Card - 40% */}
          <div className="flex flex-col rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]">
                <Settings className="h-5 w-5 text-[var(--primary-foreground)]" />
              </div>
              <div className="rounded-md border border-[var(--border-default)] bg-[var(--surface-section)] px-2.5 py-1">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-primary)]">
                  Advanced User
                </p>
              </div>
            </div>
            
            <h3 className="text-[var(--text-primary)] mb-2 text-base font-bold">
              Customize your portfolio
            </h3>
            <p className="text-[var(--text-primary)] mb-3 text-sm leading-relaxed">
              Adjust your investment allocation based on your preferences and risk tolerance.
            </p>

            <p className="text-[var(--text-primary)] mb-4 flex-1 text-sm leading-normal font-medium">
              Best for experienced investors who want more control over their portfolio.
            </p>

            <button
              onClick={() => setShowBuildPortfolioModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[var(--border-default)] py-2.5 px-6 text-sm font-semibold text-[var(--text-primary)] transition-all hover:border-[var(--border-default)] hover:bg-[var(--surface-section)] active:scale-[0.98]"
            >
              Customize my portfolio <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Advisor Card - Full Width */}
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-md border border-[var(--border-default)] bg-[var(--surface-section)] px-2.5 py-1">
                <p className="text-[var(--text-primary)] text-xs font-bold uppercase tracking-wide">
                  Expert Help
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]">
                <Phone className="h-6 w-6 text-[var(--primary-foreground)]" />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-between gap-6">
              <div>
                <h3 className="text-[var(--text-primary)] mb-2 text-lg font-bold">Need Guidance? Contact Advisor</h3>
                <p className="text-[var(--text-secondary)] mb-3 text-sm leading-relaxed">
                  Get help from a certified financial advisor to choose the right investment strategy for your goals.
                </p>
                <div className="flex gap-6">
                  
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="text-[var(--text-primary)] text-xs">Certified professionals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="text-[var(--text-primary)] text-xs">Custom portfolio analysis</span>
                  </div>
                </div>
              </div>
              
              <button
                className="flex shrink-0 items-center gap-2 rounded-xl border-2 border-[var(--border-default)] py-2.5 px-6 text-sm font-medium text-[var(--text-primary)] transition-all hover:bg-[var(--surface-section)]"
              >
                Connect Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Continue CTA */}
        <div className="pt-1 pb-2">
          
          
        </div>
      </div>

      {/* Customize Modal */}
      <CustomizeModal
        isOpen={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        initialAllocations={
          customAllocations || {
            sameForAll: activeSources.length === 1,
            unified: defaultFunds.map((f) => ({ ...f })),
            sources: {
              roth: defaultFunds.map((f) => ({ ...f })),
              preTax: defaultFunds.map((f) => ({ ...f })),
              afterTax: defaultFunds.map((f) => ({ ...f })),
            },
          }
        }
        activeSources={activeSources}
        contributionSources={data.contributionSources}
        onSave={handleSaveCustom}
        initialTab={modalInitialTab}
      />

      {/* Build Portfolio Modal */}
      {showBuildPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] p-4">
          <div className="card-standard flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[var(--border-default)] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]">
                    <Sparkles className="h-4 w-4 text-[var(--primary-foreground)]" />
                  </div>
                  <h2 className="text-[var(--text-primary)] text-xl font-bold">
                    Build Custom Portfolio
                  </h2>
                </div>
                <p className="text-[var(--text-secondary)] text-sm">
                  {editingSource
                    ? `Customizing ${sourceFullLabels[editingSource]} allocation`
                    : "Select a source to customize its investment allocation"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowBuildPortfolioModal(false);
                  setEditingSource(null);
                  setInlineAllocs(null);
                }}
                className="w-8 h-8 rounded-lg hover:bg-[var(--surface-card)] border border-[var(--border-default)] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
            </div>

            {/* Modal Content - Two Column Layout */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Left Column - Contribution Sources */}
              <div className={`${editingSource ? "md:w-2/5" : "w-full"} border-r border-[var(--border-default)] overflow-y-auto px-6 py-5 transition-all`}>
                <div>
                  <p className="text-[var(--text-primary)] mb-4 text-base font-semibold">
                    Your Contribution Sources
                  </p>
                  <div className="space-y-3">
                    {activeSources.map((src) => (
                      <SourceCard
                        key={src}
                        sourceKey={src}
                        monthlyAmount={getMonthlyForSource(src)}
                        funds={getFundsForSource(src)}
                        isCustomized={isSourceCustomized(src)}
                        onEditPortfolio={() => handleOpenCustomize(src)}
                      />
                    ))}
                    {inactiveSources.map((src) => (
                      <InactiveSourceCard key={src} sourceKey={src} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Portfolio Editor (shown when editing) */}
              {editingSource && inlineAllocs && (
                <div className="flex-1 flex flex-col md:w-3/5 bg-[var(--surface-card)] border border-[var(--border-default)] ">
                  {/* Editor Header */}
                  <div className="px-6 py-4 border-b border-[var(--border-default)] bg-[var(--surface-card)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: sourceColors[editingSource] }}
                        />
                        <h3 className="text-[var(--text-primary)] text-base font-semibold">
                          Customize {sourceFullLabels[editingSource]}
                        </h3>
                      </div>
                      <button
                        onClick={handleCloseInline}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-secondary)] transition-colors text-sm font-medium"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Editor Content */}
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    <PortfolioEditorContent
                      allocs={inlineAllocs}
                      setAllocs={setInlineAllocs as Dispatch<SetStateAction<PerSourceAllocations>>}
                      activeSources={activeSources}
                      contributionSources={data.contributionSources}
                      activeTab={inlineActiveTab}
                      setActiveTab={setInlineActiveTab}
                    />
                  </div>

                  {/* Editor Footer */}
                  <div className="px-6 py-4 border-t border-[var(--border-default)] bg-[var(--surface-card)]">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleCloseInline}
                        className="flex-1 px-5 py-2.5 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-card)] border border-[var(--border-default)] transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveInline}
                        className="flex-1 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--primary-foreground)] hover:bg-[var(--color-primary-hover)] transition-all flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Check className="w-4 h-4" /> Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[var(--border-default)] bg-[var(--surface-card)] border border-[var(--border-default)]">
              <button
                onClick={() => {
                  setShowBuildPortfolioModal(false);
                  setEditingSource(null);
                  setInlineAllocs(null);
                }}
                className="w-full bg-[var(--color-primary)] text-[var(--primary-foreground)] py-3 px-6 rounded-xl hover:bg-[var(--color-primary-hover)] transition-all flex items-center justify-center gap-2 text-sm font-semibold"
              >
                Done <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}