export interface XMLElement {
  tagName: string;
  attributes?: Record<string, string>;
  children?: (XMLElement | string)[];
}
