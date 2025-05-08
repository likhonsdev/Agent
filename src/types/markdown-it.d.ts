declare module 'markdown-it' {
  interface MarkdownItOptions {
    html?: boolean;
    xhtmlOut?: boolean;
    breaks?: boolean;
    langPrefix?: string;
    linkify?: boolean;
    typographer?: boolean;
    quotes?: string | string[];
    highlight?: (str: string, lang: string) => string;
  }

  class MarkdownIt {
    constructor(options?: MarkdownItOptions | string);
    render(src: string, env?: any): string;
    renderInline(src: string, env?: any): string;
  }

  namespace MarkdownIt {}
  export = MarkdownIt;
}
