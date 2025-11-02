import React from "react";
import { dataAttr } from "@/sanity/lib/utils";
import TextContent from "./blocks/TextContent";
import ImageBlock from "./blocks/Image";
import LocalitySelector from "./blocks/LocalitySelector";
import SectorSelector from "./blocks/SectorSelector";
import ColumnLayout from "./blocks/ColumnLayout";
import CostsMaps from "./blocks/CostsMaps";
import CostsBreakdown from "./blocks/CostsBreakdown";
import Accordion from "./blocks/Accordion";
import ContentWrapper from "./blocks/ContentWrapper";
import OnThisPage from "./blocks/OnThisPage";
import PayerBreakdown from "./blocks/PayerBreakdown";
import LargeButton from "./blocks/LargeButton";
import DownloadButton from "./blocks/DownloadButton";
import Sources from "./blocks/Sources";
import SectorCosts from "./blocks/SectorCosts";
import LocalityPayorBreakdown from "./blocks/LocalityPayorBreakdown";
import LocalityDemographics from "./blocks/LocalityDemographics";
import JitterPlot from "./blocks/JitterPlot";
import HorizontalRule from "./blocks/HorizontalRule";
import PovertyIncome from "./blocks/PovertyIncome";
import SourcesAccordionBlock from "./blocks/SourcesAccordionBlock";
import UpdateIntro from "./blocks/UpdateIntro";
import HighestCosts from "./blocks/HighestCosts";
import BlockQuote from "./blocks/BlockQuote";
import ImageAndText from "./blocks/ImageAndText";
import { useLocality } from "@/app/contexts/LocalityContext";

type BlocksType = {
  [key: string]: React.FC<any>;
};

type BlockProps = {
  block: any;
  index: number;
  pageId: string;
  pageType: string;
  localities?: Array<any>;
  selectedLocality?: any;
  path?: string;
};

const Blocks: BlocksType = {
  textContent: TextContent,
  imageBlock: ImageBlock,
  localitySelector: LocalitySelector,
  sectorSelector: SectorSelector,
  columnLayout: ColumnLayout,
  costsMaps: CostsMaps,
  costsBreakdown: CostsBreakdown,
  accordion: Accordion,
  contentWrapper: ContentWrapper,
  onThisPage: OnThisPage,
  payerBreakdown: PayerBreakdown,
  largeButton: LargeButton,
  downloadButton: DownloadButton,
  sources: Sources,
  sectorCosts: SectorCosts,
  localityPayorBreakdown: LocalityPayorBreakdown,
  localityDemographics: LocalityDemographics,
  jitterPlot: JitterPlot,
  horizontalRule: HorizontalRule,
  povertyIncome: PovertyIncome,
  sourcesAccordion: SourcesAccordionBlock,
  updateIntro: UpdateIntro,
  highestCosts: HighestCosts,
  blockQuote: BlockQuote,
  imageAndText: ImageAndText,
};

/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function BlockRenderer({
  block,
  index,
  pageId,
  pageType,
  localities,
  selectedLocality: propSelectedLocality,
  path,
}: BlockProps) {
  const { selectedLocality: contextSelectedLocality } = useLocality();
  const selectedLocality = propSelectedLocality || contextSelectedLocality;
  const blockPath = path || `pageBuilder[_key=="${block._key}"]`;

  // Block does exist
  if (typeof Blocks[block._type] !== "undefined") {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: blockPath,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block,
          index: index,
          selectedLocality: selectedLocality,
          localities: localities,
          pageId,
          pageType,
          path: blockPath,
        })}
      </div>
    );
  }

  // Block doesn't exist yet
  return React.createElement(
    () => (
      <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    { key: block._key },
  );
}
