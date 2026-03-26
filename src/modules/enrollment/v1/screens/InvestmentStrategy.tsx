import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TFunction } from "i18next";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Gauge,
  Layers,
  Minus,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Settings,
  Sparkles,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { pathForWizardStep } from "../flow/v1WizardPaths";
import type { RiskLevel } from "../store/useEnrollmentStore";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

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

/* ─── Labels ─── */

const sourceColors: Record<SourceKey, string> = {
  roth: "#8b5cf6",
  preTax: "#3b82f6",
  afterTax: "#10b981",
};

const sourceBorderColors: Record<SourceKey, string> = {
  roth: "border-purple-200",
  preTax: "border-blue-200",
  afterTax: "border-green-200",
};

const sourceBgColors: Record<SourceKey, string> = {
  roth: "bg-purple-50",
  preTax: "bg-blue-50",
  afterTax: "bg-green-50",
};

/* ─── Static data ─── */

const ALLOCATION_BY_RISK: Record<RiskLevel, AllocationEntry[]> = {
  conservative: [
    { name: "Bonds", value: 45, color: "#3b82f6", funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }, { name: "PIMCO Income Fund", ticker: "PONAX", expense: "0.59%" }] },
    { name: "US Stocks", value: 25, color: "#10b981", funds: [{ name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" }] },
    { name: "International Stocks", value: 15, color: "#8b5cf6", funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }] },
    { name: "Real Estate", value: 15, color: "#f59e0b", funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }] },
  ],
  balanced: [
    { name: "US Stocks", value: 40, color: "#10b981", funds: [{ name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" }, { name: "Vanguard Mid-Cap Index", ticker: "VIMAX", expense: "0.05%" }] },
    { name: "Bonds", value: 25, color: "#3b82f6", funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }] },
    { name: "International Stocks", value: 20, color: "#8b5cf6", funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }] },
    { name: "Real Estate", value: 15, color: "#f59e0b", funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }] },
  ],
  growth: [
    { name: "US Stocks", value: 50, color: "#10b981", funds: [{ name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" }, { name: "Vanguard Growth Index", ticker: "VIGAX", expense: "0.05%" }] },
    { name: "International Stocks", value: 20, color: "#8b5cf6", funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }] },
    { name: "Bonds", value: 20, color: "#3b82f6", funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }] },
    { name: "Real Estate", value: 10, color: "#f59e0b", funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }] },
  ],
  aggressive: [
    { name: "US Stocks", value: 50, color: "#10b981", funds: [{ name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" }, { name: "Vanguard Small-Cap Growth", ticker: "VSGAX", expense: "0.07%" }] },
    { name: "International Stocks", value: 20, color: "#8b5cf6", funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }, { name: "Vanguard Emerging Markets", ticker: "VEMAX", expense: "0.14%" }] },
    { name: "Bonds", value: 20, color: "#3b82f6", funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }] },
    { name: "Real Estate", value: 10, color: "#f59e0b", funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }] },
  ],
};

const STYLE_TITLE_KEYS: Record<RiskLevel, string> = {
  conservative: "styleTitleConservative",
  balanced: "styleTitleBalanced",
  growth: "styleTitleGrowth",
  aggressive: "styleTitleAggressive",
};

const STYLE_DESC_KEYS: Record<RiskLevel, string> = {
  conservative: "styleDescConservative",
  balanced: "styleDescBalanced",
  growth: "styleDescGrowth",
  aggressive: "styleDescAggressive",
};

const WHY_KEYS: Record<RiskLevel, string> = {
  conservative: "whyConservative",
  balanced: "whyBalanced",
  growth: "whyGrowth",
  aggressive: "whyAggressive",
};

const RISK_DEF: { key: RiskLevel; labelKey: string; subKey: string }[] = [
  { key: "conservative", labelKey: "riskConservative", subKey: "riskSubConservative" },
  { key: "balanced", labelKey: "riskBalanced", subKey: "riskSubBalanced" },
  { key: "growth", labelKey: "riskGrowth", subKey: "riskSubGrowth" },
  { key: "aggressive", labelKey: "riskAggressive", subKey: "riskSubAggressive" },
];

const IV = "enrollment.v1.investment.";

function sourceShort(t: TFunction, k: SourceKey) {
  const m: Record<SourceKey, string> = { roth: "sourceRoth", preTax: "sourcePreTax", afterTax: "sourceAfterTax" };
  return t(`${IV}${m[k]}`);
}

function sourceFull(t: TFunction, k: SourceKey) {
  const m: Record<SourceKey, string> = {
    roth: "sourceRothFull",
    preTax: "sourcePreTaxFull",
    afterTax: "sourceAfterTaxFull",
  };
  return t(`${IV}${m[k]}`);
}

function sourceTax(t: TFunction, k: SourceKey) {
  const m: Record<SourceKey, string> = { roth: "taxFree", preTax: "taxDeferred", afterTax: "taxable" };
  return t(`${IV}${m[k]}`);
}

const ADVISOR_CONTACT_HREF = "mailto:support@yourplan.com?subject=Investment%20guidance";

// Plan-approved fund catalog
const fundCatalog: SourceFundAllocation[] = [
  { name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%", assetClass: "Equity", color: "#10b981", allocation: 0 },
  { name: "Vanguard Mid-Cap Index", ticker: "VIMAX", expense: "0.05%", assetClass: "Equity", color: "#10b981", allocation: 0 },
  { name: "Vanguard Growth Index", ticker: "VIGAX", expense: "0.05%", assetClass: "Equity", color: "#10b981", allocation: 0 },
  { name: "Vanguard Small-Cap Growth", ticker: "VSGAX", expense: "0.07%", assetClass: "Equity", color: "#10b981", allocation: 0 },
  { name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%", assetClass: "Fixed Income", color: "#3b82f6", allocation: 0 },
  { name: "PIMCO Income Fund", ticker: "PONAX", expense: "0.59%", assetClass: "Fixed Income", color: "#3b82f6", allocation: 0 },
  { name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%", assetClass: "International", color: "#8b5cf6", allocation: 0 },
  { name: "Vanguard Emerging Markets", ticker: "VEMAX", expense: "0.14%", assetClass: "International", color: "#8b5cf6", allocation: 0 },
  { name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%", assetClass: "Real Estate", color: "#f59e0b", allocation: 0 },
];

/* ─── Helpers ─── */

function buildFundsFromRecommended(alloc: AllocationEntry[]): SourceFundAllocation[] {
  return fundCatalog
    .map((fund) => {
      const matched = alloc.find((cat) => cat.funds.some((f) => f.ticker === fund.ticker));
      if (!matched) return null;
      const share = matched.value / matched.funds.length;
      return { ...fund, allocation: Math.round(share) };
    })
    .filter((f): f is SourceFundAllocation => f !== null);
}

function getSourceTotal(funds: SourceFundAllocation[]): number {
  return funds.reduce((s, f) => s + f.allocation, 0);
}

function translateAllocName(t: TFunction, name: string) {
  const m: Record<string, string> = {
    Bonds: "allocBonds",
    "US Stocks": "allocUsStocks",
    "International Stocks": "allocIntlStocks",
    "Real Estate": "allocRealEstate",
  };
  const k = m[name];
  return k ? t(`${IV}${k}`) : name;
}

function assetClassLabelInv(t: TFunction, cls: string) {
  const m: Record<string, string> = {
    Equity: "assetEquity",
    "Fixed Income": "assetFixedIncome",
    International: "assetInternational",
    "Real Estate": "assetRealEstate",
  };
  const k = m[cls];
  return k ? t(`${IV}${k}`) : cls;
}

function computeRiskLevel(funds: SourceFundAllocation[], t: TFunction): { label: string; color: string } {
  const total = funds.reduce((s, f) => s + f.allocation, 0);
  if (total === 0) return { label: t(`${IV}riskNotSet`), color: "text-muted-foreground" };
  const equityPct = funds
    .filter((f) => f.assetClass === "Equity" || f.assetClass === "International")
    .reduce((s, f) => s + f.allocation, 0);
  if (equityPct >= 70) return { label: t(`${IV}riskAggressive`), color: "text-red-600" };
  if (equityPct >= 50) return { label: t(`${IV}riskGrowth`), color: "text-orange-600" };
  if (equityPct >= 30) return { label: t(`${IV}riskBalanced`), color: "text-blue-600" };
  return { label: t(`${IV}riskConservative`), color: "text-green-600" };
}

/* ─── Allocation indicator ─── */

function AllocationIndicator({ total, label }: { total: number; label?: string }) {
  const { t } = useTranslation();
  const isValid = total === 100;
  const diff = total - 100;
  return (
    <div className={cn("flex items-center justify-between rounded-xl px-3.5 py-2", isValid ? "bg-green-50" : "bg-amber-50")}>
      <div className="flex items-center gap-2">
        {isValid
          ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          : <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
        <span className={cn(isValid ? "text-green-700" : "text-amber-700")} style={{ fontSize: "0.78rem", fontWeight: 500 }}>
          {label ? `${label}: ` : ""}
          {isValid
            ? t(`${IV}allocBalanced`)
            : diff > 0
              ? t(`${IV}allocOver`, { diff })
              : t(`${IV}allocRemaining`, { diff: Math.abs(diff) })}
        </span>
      </div>
      <span className={cn("tabular-nums", isValid ? "text-green-800" : "text-amber-800")} style={{ fontSize: "0.9rem", fontWeight: 700 }}>
        {total}%
      </span>
    </div>
  );
}

/* ─── Fund picker dropdown ─── */

function FundPicker({ existingTickers, onAdd }: { existingTickers: string[]; onAdd: (f: SourceFundAllocation) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
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
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors py-1.5 px-2 rounded-lg hover:bg-blue-50"
        style={{ fontSize: "0.8rem", fontWeight: 500 }}
      >
        <Plus className="w-3.5 h-3.5" /> {t(`${IV}addFund`)}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-72 max-h-64 overflow-y-auto">
          {Object.entries(grouped).map(([cls, funds]) => (
            <div key={cls}>
              <p className="px-3 pt-2.5 pb-1 text-gray-400 sticky top-0 bg-white" style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {assetClassLabelInv(t, cls)}
              </p>
              {funds.map((fund) => (
            <button
                  key={fund.ticker}
              type="button"
                  onClick={() => { onAdd({ ...fund, allocation: 0 }); setOpen(false); }}
                  className="w-full px-3 py-2 hover:bg-gray-50 text-left flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="text-gray-800" style={{ fontSize: "0.8rem" }}>{fund.name}</p>
                    <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>
                      {fund.ticker} · {t(`${IV}erLabel`)} {fund.expense}
                    </p>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-gray-400" />
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Source fund list ─── */

function SourceFundList({ funds, onUpdate, onRemove, onAdd }: {
  funds: SourceFundAllocation[];
  onUpdate: (ticker: string, value: number) => void;
  onRemove: (ticker: string) => void;
  onAdd: (fund: SourceFundAllocation) => void;
}) {
  const { t } = useTranslation();
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
            <p className="text-gray-400" style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {assetClassLabelInv(t, assetClass)}
            </p>
          </div>
          <div className="space-y-2">
            {classFunds.map((fund) => (
              <div key={fund.ticker} className="bg-white border border-gray-200 rounded-xl px-3.5 py-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <p className="text-gray-900 truncate" style={{ fontSize: "0.82rem", fontWeight: 500 }}>{fund.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-gray-400" style={{ fontSize: "0.68rem" }}>{fund.ticker}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-400" style={{ fontSize: "0.68rem" }}>
                        {t(`${IV}erLabel`)} {fund.expense}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button type="button" onClick={() => onUpdate(fund.ticker, Math.max(0, fund.allocation - 1))} className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200">
                      <Minus className="w-3 h-3" />
                    </button>
                    <div className="flex items-center gap-0.5 bg-gray-50 rounded-lg px-2 py-0.5">
                      <input
                        type="number" min={0} max={100} value={fund.allocation}
                        onChange={(e) => onUpdate(fund.ticker, Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                        className="w-9 text-right bg-transparent border-none outline-none text-gray-900 tabular-nums"
                        style={{ fontSize: "0.85rem", fontWeight: 600 }}
                      />
                      <span className="text-gray-400" style={{ fontSize: "0.78rem" }}>%</span>
                    </div>
                    <button type="button" onClick={() => onUpdate(fund.ticker, Math.min(100, fund.allocation + 1))} className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button type="button" onClick={() => onRemove(fund.ticker)} className="w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors ml-0.5">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <input
                  type="range" min={0} max={100} value={fund.allocation}
                  onChange={(e) => onUpdate(fund.ticker, parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${fund.color} 0%, ${fund.color} ${fund.allocation}%, #e5e7eb ${fund.allocation}%, #e5e7eb 100%)`,
                    accentColor: fund.color,
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

/* ─── Copy portfolio menu ─── */

function CopyPortfolioMenu({ currentSource, activeSources, contributionSources, onCopy }: {
  currentSource: SourceKey;
  activeSources: SourceKey[];
  contributionSources: { preTax: number; roth: number; afterTax: number };
  onCopy: (from: SourceKey) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const others = activeSources.filter((s) => s !== currentSource);
  if (others.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors py-1 px-2 rounded-lg hover:bg-gray-100" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
        <Copy className="w-3 h-3" /> {t(`${IV}copyFrom`)}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-52 py-1">
          {others.map((src) => (
            <button key={src} type="button" onClick={() => { onCopy(src); setOpen(false); }} className="w-full px-3 py-2 hover:bg-gray-50 text-left flex items-center justify-between transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sourceColors[src] }} />
                <span className="text-gray-700" style={{ fontSize: "0.78rem" }}>
                  {sourceShort(t, src)} ({contributionSources[src]}%)
                </span>
              </div>
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Portfolio editor content (shared between inline + modal) ─── */

function PortfolioEditorContent({ allocs, setAllocs, activeSources, contributionSources, activeTab, setActiveTab }: {
  allocs: PerSourceAllocations;
  setAllocs: React.Dispatch<React.SetStateAction<PerSourceAllocations>>;
  activeSources: SourceKey[];
  contributionSources: { preTax: number; roth: number; afterTax: number };
  activeTab: SourceKey;
  setActiveTab: (tab: SourceKey) => void;
}) {
  const { t } = useTranslation();
  const updateUnifiedFund = useCallback((ticker: string, value: number) => {
    setAllocs((prev) => ({ ...prev, unified: prev.unified.map((f) => f.ticker === ticker ? { ...f, allocation: value } : f) }));
  }, [setAllocs]);

  const removeUnifiedFund = useCallback((ticker: string) => {
    setAllocs((prev) => ({ ...prev, unified: prev.unified.filter((f) => f.ticker !== ticker) }));
  }, [setAllocs]);

  const addUnifiedFund = useCallback((fund: SourceFundAllocation) => {
    setAllocs((prev) => ({ ...prev, unified: [...prev.unified, fund] }));
  }, [setAllocs]);

  const updateSourceFund = useCallback((source: SourceKey, ticker: string, value: number) => {
    setAllocs((prev) => ({ ...prev, sources: { ...prev.sources, [source]: prev.sources[source].map((f) => f.ticker === ticker ? { ...f, allocation: value } : f) } }));
  }, [setAllocs]);

  const removeSourceFund = useCallback((source: SourceKey, ticker: string) => {
    setAllocs((prev) => ({ ...prev, sources: { ...prev.sources, [source]: prev.sources[source].filter((f) => f.ticker !== ticker) } }));
  }, [setAllocs]);

  const addSourceFund = useCallback((source: SourceKey, fund: SourceFundAllocation) => {
    setAllocs((prev) => ({ ...prev, sources: { ...prev.sources, [source]: [...prev.sources[source], fund] } }));
  }, [setAllocs]);

  const toggleSameForAll = () => {
    setAllocs((prev) => {
      if (prev.sameForAll) {
        const newSources = { ...prev.sources };
        activeSources.forEach((src) => { if (newSources[src].length === 0) newSources[src] = prev.unified.map((f) => ({ ...f })); });
        return { ...prev, sameForAll: false, sources: newSources };
      }
      return { ...prev, sameForAll: true };
    });
  };

  const unifiedTotal = getSourceTotal(allocs.unified);
  const sourceTotals = activeSources.map((src) => ({ key: src, total: getSourceTotal(allocs.sources[src]) }));
  const currentFunds = allocs.sameForAll ? allocs.unified : allocs.sources[activeTab];

  const chartData = Object.entries(
    (currentFunds || []).filter((f) => f.allocation > 0).reduce<Record<string, { value: number; color: string }>>((acc, f) => {
      if (!acc[f.assetClass]) acc[f.assetClass] = { value: 0, color: f.color };
      acc[f.assetClass].value += f.allocation;
      return acc;
    }, {})
  ).map(([name, d]) => ({ name, ...d }));

  return (
    <div className="space-y-4">
      {/* Same-for-all toggle */}
      {activeSources.length > 1 && (
        <button type="button" onClick={toggleSameForAll} className={cn("w-full flex items-center gap-3 rounded-xl px-4 py-3 border transition-all", allocs.sameForAll ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50")}>
          {allocs.sameForAll ? <ToggleRight className="w-5 h-5 text-blue-600 shrink-0" /> : <ToggleLeft className="w-5 h-5 text-gray-400 shrink-0" />}
          <div className="text-left flex-1">
            <p className={cn(allocs.sameForAll ? "text-blue-800" : "text-gray-700")} style={{ fontSize: "0.82rem", fontWeight: 500 }}>
              {t(`${IV}sameForAllTitle`)}
            </p>
            <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>
              {allocs.sameForAll ? t(`${IV}sameForAllOn`) : t(`${IV}sameForAllOff`)}
            </p>
          </div>
          {!allocs.sameForAll && (
            <div className="flex items-center gap-1 shrink-0">
              <Layers className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500" style={{ fontSize: "0.72rem" }}>
                {t(`${IV}sourcesCount`, { count: activeSources.length })}
              </span>
            </div>
          )}
        </button>
      )}

      {/* Donut chart summary */}
      {chartData.length > 0 && (
        <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3">
          <div className="w-14 h-14 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={16} outerRadius={26} paddingAngle={2} dataKey="value" strokeWidth={0}>
                  {chartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {chartData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-600" style={{ fontSize: "0.72rem" }}>
                    {assetClassLabelInv(t, d.name)}: <span className="text-gray-900" style={{ fontWeight: 600 }}>{d.value}%</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Gauge className="w-3 h-3 text-gray-400" />
              <span className="text-gray-500" style={{ fontSize: "0.68rem" }}>
                {t(`${IV}riskLabel`)}{" "}
                <span className={computeRiskLevel(currentFunds || [], t).color} style={{ fontWeight: 600 }}>
                  {computeRiskLevel(currentFunds || [], t).label}
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
              <p className="text-gray-400" style={{ fontSize: "0.85rem" }}>{t(`${IV}noFunds`)}</p>
              <div className="mt-3 flex justify-center"><FundPicker existingTickers={[]} onAdd={addUnifiedFund} /></div>
            </div>
          ) : (
            <SourceFundList funds={allocs.unified} onUpdate={updateUnifiedFund} onRemove={removeUnifiedFund} onAdd={addUnifiedFund} />
          )}
          <div className="mt-4 space-y-2">
            <AllocationIndicator total={unifiedTotal} label={t(`${IV}totalAllocation`)} />
          </div>
        </div>
      ) : (
        <div>
          {/* Source tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
            {activeSources.map((src) => {
              const srcTotal = getSourceTotal(allocs.sources[src]);
              const srcValid = srcTotal === 100;
              return (
                <button key={src} type="button" onClick={() => setActiveTab(src)} className={cn("flex-1 rounded-lg py-2 px-3 transition-all flex items-center justify-center gap-2", activeTab === src ? "bg-white shadow-sm" : "hover:bg-gray-50")}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sourceColors[src] }} />
                  <span className={cn(activeTab === src ? "text-gray-900" : "text-gray-500")} style={{ fontSize: "0.8rem", fontWeight: activeTab === src ? 600 : 400 }}>
                    {sourceShort(t, src)}
                  </span>
                  {srcTotal > 0 && (
                    <span className={cn("shrink-0", srcValid ? "text-green-600" : "text-amber-600")}>
                      {srcValid ? <CheckCircle2 className="w-3 h-3" /> : <span style={{ fontSize: "0.65rem", fontWeight: 600 }}>{srcTotal}%</span>}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: sourceColors[activeTab] }} />
                <p className="text-gray-800" style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                  {t(`${IV}sourcePortfolio`, { source: sourceShort(t, activeTab) })}
                </p>
              </div>
              {activeSources.length > 1 && (
                <CopyPortfolioMenu
                  currentSource={activeTab}
                  activeSources={activeSources}
                  contributionSources={contributionSources}
                  onCopy={(fromSource) => setAllocs((prev) => ({ ...prev, sources: { ...prev.sources, [activeTab]: prev.sources[fromSource].map((f) => ({ ...f })) } }))}
                />
              )}
            </div>

            {allocs.sources[activeTab].length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-xl">
                <p className="text-gray-400 mb-2" style={{ fontSize: "0.82rem" }}>
                  {t(`${IV}noFundsForSource`, { source: sourceShort(t, activeTab) })}
                </p>
                <div className="flex justify-center"><FundPicker existingTickers={[]} onAdd={(fund) => addSourceFund(activeTab, fund)} /></div>
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
                label={t(`${IV}sourceAllocationLabel`, { source: sourceShort(t, activeTab) })}
              />
            </div>
          </div>

          {/* All-source summary */}
          <div className="border-t border-gray-100 pt-3 mt-4 space-y-1.5">
            <p className="text-gray-400 mb-1" style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {t(`${IV}allSources`)}
            </p>
            {sourceTotals.map((s) => (
              <div key={s.key} className={cn("flex items-center justify-between px-3 py-1.5 rounded-lg", s.total === 100 ? "bg-green-50" : "bg-amber-50")}>
                <div className="flex items-center gap-2">
                  {s.total === 100 ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <AlertTriangle className="w-3 h-3 text-amber-600" />}
                  <span className={cn(s.total === 100 ? "text-green-700" : "text-amber-700")} style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                    {sourceShort(t, s.key)}
                  </span>
                </div>
                <span className={cn("tabular-nums", s.total === 100 ? "text-green-800" : "text-amber-800")} style={{ fontSize: "0.8rem", fontWeight: 600 }}>{s.total}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Source card ─── */

function SourceCard({ sourceKey, monthlyAmount, funds, isCustomized, onEditPortfolio }: {
  sourceKey: SourceKey;
  monthlyAmount: number;
  funds: SourceFundAllocation[];
  isCustomized: boolean;
  onEditPortfolio: () => void;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const activeFunds = funds.filter((f) => f.allocation > 0);

  const assetSummary = Object.entries(
    activeFunds.reduce<Record<string, { value: number; color: string }>>((acc, f) => {
      if (!acc[f.assetClass]) acc[f.assetClass] = { value: 0, color: f.color };
      acc[f.assetClass].value += f.allocation;
      return acc;
    }, {})
  ).map(([name, d]) => ({ name, ...d }));

  return (
    <div className={cn("bg-white rounded-2xl border shadow-sm overflow-hidden", sourceBorderColors[sourceKey])}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sourceColors[sourceKey] }} />
              <p className="text-gray-900" style={{ fontSize: "0.9rem", fontWeight: 600 }}>{sourceFull(t, sourceKey)}</p>
              <span className={cn(sourceBgColors[sourceKey], "px-1.5 py-0.5 rounded")} style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.03em" }}>
                <span style={{ color: sourceColors[sourceKey] }}>{sourceTax(t, sourceKey)}</span>
                  </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-gray-700" style={{ fontSize: "0.82rem", fontWeight: 500 }}>
                {t(`${IV}perMo`, { amount: `$${Math.round(monthlyAmount).toLocaleString()}` })}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-500" style={{ fontSize: "0.78rem" }}>
                {t(`${IV}fund`, { count: activeFunds.length })}
              </span>
              {isCustomized && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="text-blue-600" style={{ fontSize: "0.72rem", fontWeight: 500 }}>
                    {t(`${IV}customized`)}
                  </span>
                </>
              )}
            </div>
          </div>
          <button type="button" onClick={onEditPortfolio} className="shrink-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors" style={{ fontSize: "0.82rem", fontWeight: 500 }}>
            <Pencil className="w-3.5 h-3.5 inline mr-1.5" />
            {t(`${IV}edit`)}
          </button>
        </div>

        {assetSummary.length > 0 && (
          <div className="mt-3">
            <div className="flex rounded-full h-2 overflow-hidden">
              {assetSummary.map((a) => <div key={a.name} style={{ width: `${a.value}%`, backgroundColor: a.color }} className="transition-all" />)}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2">
              {assetSummary.map((a) => (
                <div key={a.name} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                  <span className="text-gray-500" style={{ fontSize: "0.68rem" }}>
                    {assetClassLabelInv(t, a.name)} <span className="text-gray-700" style={{ fontWeight: 600 }}>{a.value}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeFunds.length > 0 && (
          <div className="mt-2.5 space-y-0.5">
            {activeFunds.slice(0, 2).map((fund) => <p key={fund.ticker} className="text-gray-500 truncate" style={{ fontSize: "0.72rem" }}>{fund.name}</p>)}
            {activeFunds.length > 2 && (
              <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>
                {t(`${IV}moreFunds`, { count: activeFunds.length - 2 })}
              </p>
            )}
          </div>
        )}
      </div>

      {activeFunds.length > 0 && (
        <>
          <button type="button" onClick={() => setExpanded(!expanded)} className="w-full border-t border-gray-100 px-4 py-2 flex items-center justify-center gap-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
            {expanded ? t(`${IV}hideFunds`) : t(`${IV}viewFunds`)}
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {expanded && (
            <div className="border-t border-gray-100 px-4 py-3 space-y-2">
              {activeFunds.map((fund) => (
                <div key={fund.ticker} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-gray-700" style={{ fontSize: "0.78rem" }}>{fund.name}</p>
                    <p className="text-gray-400" style={{ fontSize: "0.65rem" }}>
                      {fund.ticker} · {t(`${IV}erLabel`)} {fund.expense}
                    </p>
                  </div>
                  <span className="text-gray-900 tabular-nums" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{fund.allocation}%</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function InactiveSourceCard({ sourceKey }: { sourceKey: SourceKey }) {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3.5 flex items-center gap-3 opacity-60">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sourceColors[sourceKey] }} />
      <div>
        <p className="text-gray-500" style={{ fontSize: "0.85rem", fontWeight: 500 }}>{sourceFull(t, sourceKey)}</p>
        <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>{t(`${IV}inactiveSource`)}</p>
      </div>
    </div>
  );
}

/* ─── Build Portfolio Modal ─── */

function BuildPortfolioModal({ isOpen, onClose, defaultFunds, activeSources, inactiveSources, contributionSources, monthlyTotal, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  defaultFunds: SourceFundAllocation[];
  activeSources: SourceKey[];
  inactiveSources: SourceKey[];
  contributionSources: { preTax: number; roth: number; afterTax: number };
  monthlyTotal: number;
  onSave: (allocs: PerSourceAllocations) => void;
}) {
  const { t } = useTranslation();
  const [allocs, setAllocs] = useState<PerSourceAllocations>({
    sameForAll: activeSources.length === 1,
    unified: defaultFunds.map((f) => ({ ...f })),
    sources: { roth: defaultFunds.map((f) => ({ ...f })), preTax: defaultFunds.map((f) => ({ ...f })), afterTax: defaultFunds.map((f) => ({ ...f })) },
  });
  const [editingSource, setEditingSource] = useState<SourceKey | null>(null);
  const [inlineAllocs, setInlineAllocs] = useState<PerSourceAllocations | null>(null);
  const [inlineActiveTab, setInlineActiveTab] = useState<SourceKey>("preTax");

  useEffect(() => {
    if (isOpen) {
      setAllocs({ sameForAll: activeSources.length === 1, unified: defaultFunds.map((f) => ({ ...f })), sources: { roth: defaultFunds.map((f) => ({ ...f })), preTax: defaultFunds.map((f) => ({ ...f })), afterTax: defaultFunds.map((f) => ({ ...f })) } });
      setEditingSource(null);
      setInlineAllocs(null);
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, defaultFunds, activeSources]);

  if (!isOpen) return null;

  const getFundsForSource = (src: SourceKey) => {
    if (allocs.sameForAll) return allocs.unified;
    return allocs.sources[src];
  };

  const getMonthlyForSource = (src: SourceKey) => monthlyTotal * (contributionSources[src] / 100);

  const handleEditSource = (src: SourceKey) => {
    const initial = { ...allocs, unified: allocs.unified.map((f) => ({ ...f })), sources: { roth: allocs.sources.roth.map((f) => ({ ...f })), preTax: allocs.sources.preTax.map((f) => ({ ...f })), afterTax: allocs.sources.afterTax.map((f) => ({ ...f })) } };
    setInlineAllocs(initial);
    setInlineActiveTab(src);
    setEditingSource(src);
  };

  const handleSaveInline = () => {
    if (inlineAllocs) setAllocs(inlineAllocs);
    setEditingSource(null);
    setInlineAllocs(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-gray-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {t(`${IV}modalTitle`)}
              </h2>
            </div>
            <p className="text-gray-500" style={{ fontSize: "0.85rem" }}>
              {editingSource
                ? t(`${IV}modalSubtitleEdit`, { source: sourceFull(t, editingSource) })
                : t(`${IV}modalSubtitlePick`)}
            </p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body — two columns */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left — source cards */}
          <div className={cn(editingSource ? "md:w-2/5" : "w-full", "border-r border-gray-200 overflow-y-auto px-6 py-5 transition-all")}>
            <p className="text-gray-900 mb-4" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
              {t(`${IV}yourSources`)}
            </p>
            <div className="space-y-3">
              {activeSources.map((src) => (
                <SourceCard
                  key={src}
                  sourceKey={src}
                  monthlyAmount={getMonthlyForSource(src)}
                  funds={getFundsForSource(src)}
                  isCustomized={!!editingSource}
                  onEditPortfolio={() => handleEditSource(src)}
                />
              ))}
              {inactiveSources.map((src) => <InactiveSourceCard key={src} sourceKey={src} />)}
            </div>
          </div>

          {/* Right — inline editor */}
          {editingSource && inlineAllocs && (
            <div className="flex-1 flex flex-col md:w-3/5 bg-gray-50">
              <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: sourceColors[editingSource] }} />
                  <h3 className="text-gray-900" style={{ fontSize: "1rem", fontWeight: 600 }}>
                    {t(`${IV}customizeSource`, { source: sourceFull(t, editingSource) })}
                  </h3>
                </div>
                <button type="button" onClick={() => { setEditingSource(null); setInlineAllocs(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <PortfolioEditorContent
                  allocs={inlineAllocs}
                  setAllocs={setInlineAllocs}
                  activeSources={activeSources}
                  contributionSources={contributionSources}
                  activeTab={inlineActiveTab}
                  setActiveTab={setInlineActiveTab}
                />
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setEditingSource(null); setInlineAllocs(null); }}
                  className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  style={{ fontSize: "0.85rem", fontWeight: 500 }}
                >
                  {t(`${IV}cancel`)}
                </button>
                <button
                  type="button"
                  onClick={handleSaveInline}
                  className="flex-1 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  style={{ fontSize: "0.85rem", fontWeight: 500 }}
                >
                  <Check className="w-4 h-4" /> {t(`${IV}saveChanges`)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => { onSave(allocs); onClose(); }}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            style={{ fontSize: "0.9rem", fontWeight: 600 }}
          >
            {t(`${IV}saveContinue`)} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─── */

export function InvestmentStrategy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const riskLevel = useEnrollmentStore((s) => s.riskLevel);
  const updateField = useEnrollmentStore((s) => s.updateField);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const contribution = useEnrollmentStore((s) => s.contribution);
  const salary = useEnrollmentStore((s) => s.salary);
  const contributionSources = useEnrollmentStore((s) => s.contributionSources);
  const supportsAfterTax = useEnrollmentStore((s) => s.supportsAfterTax);

  const [editorOpen, setEditorOpen] = useState(false);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [customAllocations, setCustomAllocations] = useState<PerSourceAllocations | null>(null);

  useEffect(() => {
    if (riskLevel == null) updateField("riskLevel", "balanced");
  }, [riskLevel, updateField]);

  const activeRisk = riskLevel ?? "balanced";
  const currentAllocation = ALLOCATION_BY_RISK[activeRisk];
  const defaultFunds = buildFundsFromRecommended(currentAllocation);

  // Determine active contribution sources
  const activeSources: SourceKey[] = [];
  if (contributionSources.roth > 0) activeSources.push("roth");
  if (contributionSources.preTax > 0) activeSources.push("preTax");
  if (supportsAfterTax && contributionSources.afterTax > 0) activeSources.push("afterTax");
  if (activeSources.length === 0) activeSources.push("preTax");

  const allSources: SourceKey[] = ["roth", "preTax", "afterTax"];
  const inactiveSources = allSources.filter((s) => !activeSources.includes(s) && (s !== "afterTax" || supportsAfterTax));

  const monthlyTotal = (salary * contribution) / 100 / 12;

  const riskOptions = useMemo(
    () =>
      RISK_DEF.map((opt) => ({
        key: opt.key,
        label: t(`${IV}${opt.labelKey}`),
        sub: t(`${IV}${opt.subKey}`),
      })),
    [t],
  );

  const handleContinueRecommended = () => {
    updateField("useRecommendedPortfolio", true);
    if (riskLevel == null) updateField("riskLevel", "balanced");
    nextStep();
    navigate(pathForWizardStep(useEnrollmentStore.getState().currentStep));
  };

  const handleSaveCustom = (allocs: PerSourceAllocations) => {
    setCustomAllocations(allocs);
    updateField("useRecommendedPortfolio", false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t(`${IV}pageTitle`)}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t(`${IV}pageSubtitle`)}</p>
      </div>

      {/* Investment style card */}
      <div className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="icon-box-soft h-10 w-10 shrink-0 rounded-xl">
            <Gauge className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t(`${IV}styleEyebrow`)}</p>
            <p className="text-lg font-medium text-foreground">{t(`${IV}${STYLE_TITLE_KEYS[activeRisk]}`)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t(`${IV}${STYLE_DESC_KEYS[activeRisk]}`)}</p>
          </div>
        </div>
        <button type="button" onClick={() => setEditorOpen((o) => !o)} aria-expanded={editorOpen} className="btn btn-outline shrink-0 gap-1 self-start sm:self-center">
          <Pencil className="h-4 w-4" aria-hidden />
          {t(`${IV}editStrategy`)}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {editorOpen && (
        <div className="card">
          <p className="mb-3 text-sm text-muted-foreground">{t(`${IV}chooseProfile`)}</p>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {riskOptions.map((opt) => (
              <button key={opt.key} type="button" onClick={() => { updateField("riskLevel", opt.key); setEditorOpen(false); setCustomAllocations(null); }} className={cn("btn min-h-20 flex-col gap-0.5 py-3 text-center", activeRisk === opt.key ? "btn-primary" : "btn-outline")}>
                <span className="text-sm font-medium">{opt.label}</span>
                <span className={cn("text-xs", activeRisk === opt.key ? "opacity-90" : "text-muted-foreground")}>{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recommended (2/3) + Customize (1/3) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Recommended card */}
        <div className="card space-y-4 lg:col-span-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-blue-100 rounded-md text-blue-700 text-xs font-bold uppercase tracking-wide">
                {t(`${IV}recommendedBadge`)}
              </span>
            </div>
            <h2 className="text-lg font-medium text-foreground">{t(`${IV}planDefaultTitle`)}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t(`${IV}planDefaultDesc`)}</p>
          </div>

          <div className="card-soft space-y-2">
            {currentAllocation.map((row) => (
              <div key={row.name} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: row.color }} />
                  <span className="text-foreground">{translateAllocName(t, row.name)}</span>
                </div>
                <span className="font-medium tabular-nums text-foreground">{row.value}%</span>
              </div>
            ))}
          </div>

          <div className="card-highlight">
            <p className="text-sm font-medium text-foreground">{t(`${IV}whyTitle`)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t(`${IV}${WHY_KEYS[activeRisk]}`)}</p>
          </div>

          <button type="button" onClick={handleContinueRecommended} className="btn btn-primary w-full gap-2">
            {t(`${IV}continueRecommended`)}
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </button>
        </div>

        {/* Customize card — light gradient in light mode; dark slate + purple in dark mode (no light-on-light) */}
        <div
          className={cn(
            "flex flex-col gap-2 rounded-2xl border p-5 shadow-sm lg:col-span-1",
            "border-purple-200/80 bg-gradient-to-br from-violet-50 via-white to-sky-50/90 text-slate-900",
            "dark:border-purple-500/35 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 dark:text-slate-100",
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}>
              <Settings className="w-5 h-5 text-white" aria-hidden />
            </div>
            <span
              className={cn(
                "rounded-md border border-[#ddd6fe] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-purple-800",
                "bg-gradient-to-r from-violet-100 to-sky-100",
                "dark:border-purple-400/40 dark:bg-gradient-to-r dark:from-purple-950/95 dark:to-indigo-950/95 dark:text-purple-200",
              )}
            >
              {t(`${IV}advancedUser`)}
            </span>
          </div>

          <h2 className="text-base font-bold text-slate-900 dark:text-white">{t(`${IV}customizeTitle`)}</h2>
          <p className="text-sm leading-snug text-slate-600 dark:text-slate-300">
            {t(`${IV}customizeDesc`)}
          </p>
          <p className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
            {t(`${IV}customizeBestFor`)}
          </p>

          {customAllocations && (
            <div className="flex items-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-3 py-2 dark:border-green-600/40 dark:bg-green-950/35">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">{t(`${IV}customSaved`)}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowBuildModal(true)}
            className={cn(
              "mt-auto flex w-full items-center justify-center gap-2 rounded-xl border-2 px-5 py-2.5 text-sm font-semibold transition-all",
              "border-purple-300 text-purple-800 hover:border-purple-400 hover:bg-purple-50/90",
              "dark:border-purple-400/55 dark:text-purple-200 dark:hover:border-purple-300 dark:hover:bg-purple-950/50",
            )}
          >
            {customAllocations ? t(`${IV}editPortfolioCta`) : t(`${IV}customizeCta`)}
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
          </button>
        </div>
      </div>

      {/* Advisor card */}
      <div className="card card-highlight flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex shrink-0 flex-col items-center gap-2 sm:items-start">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t(`${IV}expertHelp`)}</p>
            <div className="icon-box-soft flex h-12 w-12 rounded-xl">
              <Phone className="h-6 w-6" aria-hidden />
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-medium text-foreground">{t(`${IV}advisorTitle`)}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t(`${IV}advisorDesc`)}</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 shrink-0 text-green-600" aria-hidden />
                {t(`${IV}advisorBullet1`)}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 shrink-0 text-green-600" aria-hidden />
                {t(`${IV}advisorBullet2`)}
              </div>
            </div>
          </div>
        </div>
        <a href={ADVISOR_CONTACT_HREF} className="btn btn-outline shrink-0 gap-2 self-start sm:self-center">
          {t(`${IV}connectNow`)} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </a>
      </div>

      {/* Build Portfolio Modal */}
      <BuildPortfolioModal
        isOpen={showBuildModal}
        onClose={() => setShowBuildModal(false)}
        defaultFunds={defaultFunds}
        activeSources={activeSources}
        inactiveSources={inactiveSources}
        contributionSources={contributionSources}
        monthlyTotal={monthlyTotal}
        onSave={handleSaveCustom}
      />
    </div>
  );
}
