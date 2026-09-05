# VoltCheck24 Global Measurement Plan

This note describes the minimum telemetry and search setup needed to grow VoltCheck24 beyond a single-language calculator site.

## What we track

The site now emits lightweight browser events through `window.dataLayer` and a `voltcheck:analytics` custom event. No vendor is required for the code to run.

Tracked events:

- `tool_open`
- `calculator_calculate`
- `share_link`
- `report_print`
- `report_cart_add`
- `project_save`
- `project_load`
- `language_change`
- `theme_change`
- `user_guide_open`
- `digital_pack_open`
- `quote_modal_open`

Useful dimensions to keep in any analytics tool:

- `tool`
- `toolLabel`
- `lang`
- `tab`
- `action`
- `itemCount`
- `verdict`

## What to wire later

1. Add a real analytics vendor only after the measurement ID is confirmed.
2. Keep the current event names unchanged so history stays comparable.
3. Map the main conversions to:
   - calculator open
   - share link
   - report print
   - project save
   - quote request
4. Set up Search Console for `voltcheck24.com` and submit the sitemap.
5. Track English-page clicks separately from Korean traffic so the global landing pages can be measured on their own.

## Search Console checklist

- Verify the domain property for `voltcheck24.com`.
- Submit `https://voltcheck24.com/sitemap.xml`.
- Inspect the English landing pages first:
  - `/en/`
  - `/en/4-20ma-loop-calculator/`
  - `/en/short-circuit-current-calculator/`
  - `/en/control-panel-cooling-calculator/`
- Watch impressions, CTR, and queries for those pages before expanding to the rest of the calculator set.

## Re-engagement ideas

- Surface recently used calculators in the next visit.
- Recommend the next calculator from the same workflow family after a result is saved.
- Keep the share-link flow prominent for team usage.
- Promote English calculators from the home page so global traffic can enter directly.
