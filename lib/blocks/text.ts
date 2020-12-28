import { createBlock } from "."

export interface TextProps {
  size: "mini"|"small"|"medium"|"large"|"huge"
}

export const text = createBlock<TextProps, string>('text');

