import React from "react";
import { dataAttr } from "@/sanity/lib/utils";
import TextContent from "./blocks/TextContent";
import LocalitySelector from "./blocks/LocalitySelector";
import ColumnLayout from "./blocks/ColumnLayout";
import CostsMaps from "./blocks/CostsMaps";
import CostsBreakdown from "./blocks/CostsBreakdown";
import Accordion from "./blocks/Accordion";
import ContentWrapper from "./blocks/ContentWrapper";
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
  path?: string;
};

const Blocks: BlocksType = {
  textContent: TextContent,
  localitySelector: LocalitySelector,
  columnLayout: ColumnLayout,
  costsMaps: CostsMaps,
  costsBreakdown: CostsBreakdown,
  accordion: Accordion,
  contentWrapper: ContentWrapper,
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
  path,
}: BlockProps) {
  const { selectedLocality } = useLocality();
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
