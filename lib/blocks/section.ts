import { createBlock } from "."

export interface SectionProps {
  layout?: 'horizontal'|'vertical'
}

export const section = createBlock<SectionProps>('section');
