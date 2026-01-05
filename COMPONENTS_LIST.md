# Components List

This document lists all React components created and used in the VDH Opioid 2025 project.

## Main Application Components
*(Located in `nextjs-app/app/components/`)*

### Layout Components
- **Header.tsx** - Main site header with logo, navigation, and announcement bar
- **Footer.tsx** - Site footer with navigation, contact info, and logos
- **FooterContent.tsx** - Footer content component (used by Footer)
- **Navigation.tsx** - Desktop navigation menu component
- **MobileNavigation.tsx** - Mobile navigation menu component

### Page Building Components
- **PageBuilder.tsx** - Main page builder component that renders page content
- **BlockRenderer.tsx** - Component that renders individual blocks based on block type

### Content Components
- **PortableText.tsx** - Custom Portable Text renderer for Sanity content
- **ResolvedLink.tsx** - Link component that resolves internal/external links
- **DefinitionPopup.tsx** - Popup component for displaying term definitions

### Utility Components
- **DraftModeToast.tsx** - Toast notification for draft mode status

---

## Block Components
*(Located in `nextjs-app/app/components/blocks/`)*

These components are registered in `BlockRenderer.tsx` and used to build pages dynamically:

1. **Accordion.tsx** - Accordion/collapsible content block
2. **BlockQuote.tsx** - Block quote display component
3. **ChoroplethMap.tsx** - Choropleth map visualization
4. **ColumnLayout.tsx** - Multi-column layout container
5. **ContentWrapper.tsx** - Wrapper component for content blocks
6. **CostsBreakdown.tsx** - Costs breakdown visualization
7. **CostsMaps.tsx** - Costs maps visualization
8. **DataTableDescription.tsx** - Data table description component
9. **DownloadButton.tsx** - Download button block
10. **HighestCosts.tsx** - Highest costs visualization
11. **HorizontalRule.tsx** - Horizontal rule/divider block
12. **Image.tsx** - Image block component (exported as ImageBlock)
13. **ImageAndText.tsx** - Combined image and text block
14. **JitterPlot.tsx** - Jitter plot visualization
15. **LargeButton.tsx** - Large button block component
16. **LocalityDemographics.tsx** - Locality demographics display
17. **LocalityPayorBreakdown.tsx** - Locality payor breakdown visualization
18. **LocalitySelector.tsx** - Locality selector dropdown/component
19. **OnThisPage.tsx** - "On this page" table of contents component
20. **PayerBreakdown.tsx** - Payer breakdown visualization
21. **PovertyIncome.tsx** - Poverty/income visualization
22. **RecommendedCitation.tsx** - Recommended citation display
23. **SectorCosts.tsx** - Sector costs visualization
24. **SectorSelector.tsx** - Sector selector component
25. **Sources.tsx** - Sources display block
26. **SourcesAccordion.tsx** - Sources accordion component (used internally by other blocks)
27. **SourcesAccordionBlock.tsx** - Sources accordion block wrapper (registered in BlockRenderer)
28. **TextContent.tsx** - Text content block
29. **UpdateIntro.tsx** - Update introduction block

---

## Component Usage Notes

### Block Registration
All block components are registered in `BlockRenderer.tsx` with their corresponding Sanity schema types:
- `textContent` → TextContent
- `imageBlock` → ImageBlock
- `localitySelector` → LocalitySelector
- `sectorSelector` → SectorSelector
- `columnLayout` → ColumnLayout
- `costsMaps` → CostsMaps
- `costsBreakdown` → CostsBreakdown
- `accordion` → Accordion
- `contentWrapper` → ContentWrapper
- `onThisPage` → OnThisPage
- `payerBreakdown` → PayerBreakdown
- `largeButton` → LargeButton
- `downloadButton` → DownloadButton
- `sources` → Sources
- `sectorCosts` → SectorCosts
- `localityPayorBreakdown` → LocalityPayorBreakdown
- `localityDemographics` → LocalityDemographics
- `jitterPlot` → JitterPlot
- `horizontalRule` → HorizontalRule
- `povertyIncome` → PovertyIncome
- `sourcesAccordion` → SourcesAccordionBlock
- `updateIntro` → UpdateIntro
- `highestCosts` → HighestCosts
- `blockQuote` → BlockQuote
- `imageAndText` → ImageAndText
- `recommendedCitation` → RecommendedCitation

### Internal Components
- **SourcesAccordion.tsx** is used internally by multiple blocks (JitterPlot, CostsBreakdown, CostsMaps, PayerBreakdown, SourcesAccordionBlock) but is not registered as a standalone block type in BlockRenderer.

---

## Summary Statistics

- **Main Components**: 11
- **Block Components**: 29
- **Total**: 40 components

