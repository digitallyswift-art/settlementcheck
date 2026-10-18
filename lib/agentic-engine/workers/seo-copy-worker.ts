/**
 * Conversion Copywriter & AEO Worker
 * Specialist worker crafting character-calibrated titles, meta descriptions,
 * Answer-First FAQ blocks, and contextual internal link anchors.
 */

import { AgenticWorker, ConversionCopyPackage, SeoTechnicalBrief } from '../types';
import { ConversionCopywriterAgent } from '../agents/conversion-copywriter-agent';

export const seoCopyWorker: AgenticWorker<SeoTechnicalBrief, ConversionCopyPackage> = {
  name: 'Conversion Copywriter & AEO Worker',
  description: 'Constructs character-calibrated titles, meta descriptions, and Answer-First FAQ blocks.',
  permittedTools: [],
  execute: async (brief: SeoTechnicalBrief): Promise<ConversionCopyPackage> => {
    return ConversionCopywriterAgent.generateCopyPackage(brief);
  },
};
