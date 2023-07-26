import { parse } from 'node-html-parser';

export default class HTMLParser {
  static parse = async (link: string, selector: string, attribute: string): Promise<string> => {
    const html = await this.getPageAsText(link);
    const root = parse(html);
    const element = root.querySelector(selector);
    return element?.getAttribute(attribute) ?? '';
  };

  private static readonly getPageAsText = async (link: string): Promise<string> => {
    try {
      const response = await fetch(link);
      return await response.text();
    } catch (e) {
      console.error(e);
      return '';
    }
  };
}
