import { factory, Block } from "."

export interface SectionProps {
  layout?: 'horizontal'|'vertical'
}

export const section : Block<SectionProps> = factory<SectionProps>('section');
