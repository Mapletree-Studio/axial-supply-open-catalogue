# Axial Supply open catalogue

The complete product catalogue of [Axial Supply](https://axialsupply.co.uk), a
trading name of The Maximum Industrial Group Limited (company 17360049, VAT
GB529820276), published as open data.

Every line we sell, with its price, unit, supplier, and its procurement codes in
both systems buyers use: **UNSPSC** (Coupa, Ariba and most corporate
procurement) and **CPV** (UK and EU public tenders).

| File | What it is |
|---|---|
| `catalogue.json` | Every line: SKU, description, category, size, unit, price inc and ex VAT (GBP), UNSPSC, CPV, supplier, product URL |
| `catalogue.csv` | The same, in the column layout procurement systems import |
| `classification.json` | Each UNSPSC code we supply under, its CPV equivalents and line count |
| `CHANGELOG.md` | Every addition, removal and price change, dated |

Ranges: industrial and ESD matting, spill control, retaining rings (DIN 471,
472, 6799), deep groove ball bearings and battery energy storage. Lines with
`priceOnRequest: true` are specified and coded but quoted individually.

## Live access

- **MCP server for AI agents:** `https://axialsupply.co.uk/mcp` (read-only, no key). Guide: <https://axialsupply.co.uk/agents>
- **JSON:** <https://axialsupply.co.uk/api/v1/catalogue.json>
- **CSV:** <https://axialsupply.co.uk/catalogue.csv>
- **What each code covers:** <https://axialsupply.co.uk/classification>

This repository is refreshed daily from the live site, so it doubles as a
public price history.

## Notes

- Prices are in GBP and include UK VAT at 20% unless the field says ex VAT.
  Prices are valid on the day published; the live site is authoritative.
- UNSPSC codes were checked against the UN Global Marketplace UNSPSC listing;
  CPV codes against the EU CPV 2008 list. We publish only the codes we supply
  under.
- Ordering: by card at axialsupply.co.uk, by purchase order to
  sales@axialsupply.co.uk, or through the Coupa Supplier Portal.

## Licence

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Reuse freely,
including commercially, with credit to "Axial Supply".
