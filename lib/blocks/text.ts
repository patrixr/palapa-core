import { factory } from "."

export interface TextProps {
  size: "mini"|"small"|"medium"|"large"|"huge"
}

export const text = factory<TextProps, string>('text');

