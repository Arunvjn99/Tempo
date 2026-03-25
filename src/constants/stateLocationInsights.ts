/** Sync with `RETIREMENT_LOCATION_UNKNOWN` in `wizardConstants.ts`. */
const LOCATION_NOT_SURE = "unknown";

/**
 * Curated retirement-location blurbs for the pre-enrollment wizard (state-level; not city-level data).
 * Any state not listed falls back to no–income-tax template or generic copy.
 */
const SPECIFIC_INSIGHTS: Record<string, string> = {
  Florida:
    "Florida has no state income tax and a lower cost of living than many coastal states — a popular pick for stretching retirement dollars.",
  Arizona:
    "Arizona draws retirees for sunshine and outdoor living; housing costs vary by city but many areas remain affordable.",
  "North Carolina":
    "North Carolina blends mild seasons and diverse regions, often landing in the sweet spot for taxes and lifestyle.",
  "South Carolina":
    "South Carolina offers coastal living and generally lower property taxes than the national average in many counties.",
  California:
    "California’s cost of living runs high in many metros, but mild climate and services appeal to retirees — we’ll stress-test your plan for West Coast expenses.",
  Texas:
    "Texas has no state income tax on wages; property taxes can be meaningful depending on county — we’ll reflect both in your projections.",
  Nevada:
    "Nevada has no state income tax on wages and draws retirees to Las Vegas and Reno — desert living with varied housing costs.",
  Washington:
    "Washington has no state income tax on wages, though housing costs in Seattle and nearby metros are often steep — we’ll balance tax savings with living costs.",
  Tennessee:
    "Tennessee has no state income tax on wages and no tax on most retirement income — a growing retiree hub with moderate COL outside major cities.",
  "New York":
    "New York combines high services with high costs in downstate metros; upstate can be more affordable — your choice shapes income and tax assumptions.",
  Illinois:
    "Illinois leans on property taxes in many communities; Chicago-area costs differ sharply from downstate — we’ll align estimates with your destination.",
  Pennsylvania:
    "Pennsylvania exempts most retirement income for seniors in many cases and offers urban-to-rural variety — we’ll tune withdrawals to local norms.",
  Colorado:
    "Colorado balances outdoor lifestyle with growing Front Range costs; tax treatment of retirement income has nuances we’ll factor in.",
  Georgia:
    "Georgia offers a warm climate and retiree-friendly retirement-income exclusions up to limits — Atlanta’s costs differ from smaller towns.",
  Michigan:
    "Michigan mixes affordable smaller cities with seasonal appeal; Great Lakes living can mean lower housing costs than national coastal peers.",
  Ohio:
    "Ohio often lands below average on living costs, with a mix of metros and college towns — a practical Midwest retirement base.",
  Virginia:
    "Virginia balances proximity to D.C. with mountain and coastal options; state tax on retirement income depends on age and sources — we’ll use typical assumptions.",
  Oregon:
    "Oregon has no sales tax but income tax on most retirement withdrawals — Pacific Northwest appeal with a different tax trade-off than neighbors.",
  Massachusetts:
    "Massachusetts combines strong healthcare access with higher living costs in Greater Boston — we’ll stress income needs for New England retirement.",
  "New Jersey":
    "New Jersey has high property taxes in many towns but excludes much Social Security from state tax — we’ll weigh taxes against proximity to NYC and Philly.",
  Maryland:
    "Maryland offers Chesapeake and mountain living with income taxes that include retirement income — DC suburbs tend to be the priciest slice.",
  Wisconsin:
    "Wisconsin’s cost of living is moderate in many markets, with cold winters offset by lower housing costs than coastal states.",
  Minnesota:
    "Minnesota taxes retirement income but offers strong services; Twin Cities costs exceed many rural areas — we’ll align with your intended community.",
  Louisiana:
    "Louisiana keeps overall living costs relatively low; Gulf Coast humidity and hurricane risk are lifestyle factors retirees weigh.",
  Missouri:
    "Missouri combines low average living costs with four-season weather and major metros like Kansas City and St. Louis.",
  Indiana:
    "Indiana is often cited as affordable Midwest living, with modest taxes and Indianapolis as the economic hub.",
  Kentucky:
    "Kentucky taxes some retirement income but offers a lower overall cost profile than many coastal alternatives.",
  Alabama:
    "Alabama features warm weather and a low cost of living in much of the state — Gulf and college-town markets vary.",
  Mississippi:
    "Mississippi ranks among the lowest cost-of-living states — we’ll still model healthcare and long-term care assumptions carefully.",
  Arkansas:
    "Arkansas offers Ozarks and Delta living with generally affordable housing — a quiet retirement option for many.",
  Oklahoma:
    "Oklahoma combines low living costs with plains and city options; tornado risk is a regional consideration.",
  Iowa:
    "Iowa balances agricultural affordability with solid healthcare access in its larger cities.",
  Nebraska:
    "Nebraska offers Midwest stability; Omaha and Lincoln carry higher costs than rural towns.",
  Kansas:
    "Kansas provides affordable plains living with Wichita and KC suburbs as pricier pockets.",
  Delaware:
    "Delaware has no sales tax and relatively low property taxes in many areas — a small state with beach and corporate corridors.",
  Connecticut:
    "Connecticut has high living costs along the Gold Coast but offers New England charm and proximity to NYC and Boston.",
  "Rhode Island":
    "Rhode Island packs coast and culture into a small footprint — costs run higher than national averages.",
  Vermont:
    "Vermont appeals for scenery and small-town life; housing and winter costs can surprise newcomers.",
  "New Mexico":
    "New Mexico mixes high desert and mountain towns with moderate costs outside Santa Fe and Albuquerque hotspots.",
  Utah:
    "Utah offers outdoor access and fast-growing metros; Wasatch Front housing has climbed — we’ll reflect mountain-West trends.",
  Idaho:
    "Idaho has drawn retirees for affordability, though Boise-area growth has pushed prices up — still often below West Coast peers.",
  Montana:
    "Montana’s wide-open spaces appeal to nature-focused retirees; some towns have seen sharp housing growth.",
  Wyoming:
    "Wyoming has no state income tax on wages and low population density — wind and winter are part of the lifestyle trade-off.",
  Alaska:
    "Alaska has no state income tax and a unique remote cost profile — energy and goods often cost more than in the lower 48.",
  Hawaii:
    "Hawaii’s paradise premium shows up in housing and goods — we’ll assume higher spending needs for island retirement.",
  "District of Columbia":
    "D.C. offers urban amenities and healthcare access with a high cost of living — we’ll model accordingly for city retirement.",
  Maine:
    "Maine combines coastline and forests with seasonal tourism swings — Portland costs exceed many rural towns.",
  "West Virginia":
    "West Virginia offers Appalachian affordability and outdoor recreation — smaller economies mean weighing healthcare access.",
  "North Dakota":
    "North Dakota provides low-density, affordable living with cold winters — energy-sector towns can differ from farm communities.",
  "South Dakota":
    "South Dakota has no state income tax on wages and a low overall cost profile — Rapid City and Sioux Falls anchor retiree options.",
};

/** States with no broad state income tax on wages (simplified; not tax advice). */
const NO_STATE_INCOME_TAX_WAGES = new Set<string>([
  "Alaska",
  "Florida",
  "Nevada",
  "New Hampshire",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Washington",
  "Wyoming",
]);

/**
 * Returns a short insight for a selected U.S. state/DC, or null for empty / “not sure”.
 */
export function getStateLocationInsight(state: string): string | null {
  if (!state || state === LOCATION_NOT_SURE) return null;
  const specific = SPECIFIC_INSIGHTS[state];
  if (specific) return specific;
  if (NO_STATE_INCOME_TAX_WAGES.has(state)) {
    return `${state} does not levy state income tax on wages like most states — that can help retirement cash flow. We’ll reflect that in your projections.`;
  }
  return `${state} has its own cost-of-living and tax profile. Your choice helps us tune retirement income, tax, and withdrawal estimates for that state.`;
}
