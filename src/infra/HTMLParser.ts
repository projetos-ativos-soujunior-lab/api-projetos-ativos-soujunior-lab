import { parse } from 'node-html-parser';

export default class HTMLParser {
  static parse = async (link: string, selector: string, attribute: string): Promise<string> => {
    const html = await this.getPageAsText(link);
    const root = parse(html);
    const element = root.querySelector(selector);
    const attributeValue = element?.getAttribute(attribute) ?? '';
    return attributeValue;
  };

  private static readonly getPageAsText = async (link: string): Promise<string> => {
    return await fetch(link)
      .then(async response => await response.text())
      .catch(error => {
        console.error(`Error getting page as text: ${(error as Error).message}`);
        return '';
      });
  };
}
