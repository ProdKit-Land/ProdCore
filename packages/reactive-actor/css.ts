// Everything related to CSS
export type CSSValue = CSSString | CSSStyleSheet;
export type CSSArray = Array<CSSValue | CSSArray>;
export type CSSContent = CSSValue | CSSArray;

const cssStyleSheetCache = new WeakMap<TemplateStringsArray, CSSStyleSheet>();

const safetyToken = Symbol();

export class CSSString {
  ['_$cssString$'] = true;
  readonly cssText: string;
  private _styleSheet?: CSSStyleSheet;
  private _strings: TemplateStringsArray | undefined;
  private _variables: Map<string, string> = new Map();

  private constructor(
    cssText: string,
    strings: TemplateStringsArray | undefined,
    safeToken: symbol
  ) {
    if (safeToken !== safetyToken) {
      throw new Error('CSSString is not constructable.');
    }
    this.cssText = cssText;
    this._strings = strings;
  }

  setVariable(name: string, value: string) {
    this._variables.set(name, value);
  }

  get styleSheet(): CSSStyleSheet | undefined {
    let styleSheet = this._styleSheet;
    let processedCSS = this.cssText;
    const strings = this._strings;
    if (styleSheet === undefined) {
      const cacheable = strings !== undefined && strings.length === 1;
      for (const [name, value] of this._variables.entries()) {
        processedCSS = processedCSS.replace(new RegExp(`var\\(--${name}\\)`, 'g'), value);
      }
      if (cacheable) {
        styleSheet = cssStyleSheetCache.get(strings);
      }
      (this._styleSheet = styleSheet = new CSSStyleSheet()).replaceSync(processedCSS);
      if (cacheable) {
        cssStyleSheetCache.set(strings, styleSheet);
      }
    }
    return styleSheet;
  }

  toString(): string {
    return this.cssText;
  }
}

type ConstructableCSSString = new (
  cssText: string,
  strings: TemplateStringsArray | undefined,
  safeToken: symbol
) => CSSString;

export const unsafeCSS = (value: unknown) =>
  new (CSSString as ConstructableCSSString)(
    typeof value === 'string' ? value : String(value),
    undefined,
    safetyToken
  );

export const css = (
  strings: TemplateStringsArray,
  ...values: (CSSContent | number)[]
): CSSString => {
  const cssText = strings.length === 1
    ? strings[0]
    : values.reduce((acc, v, idx) => (
        (v as CSSString)['_$cssString$'] === true
          ? acc + (v as CSSString).cssText + strings[idx + 1]
          : typeof v === 'number'
            ? acc + v + strings[idx + 1]
            : (() => {
                throw new Error(
                  `Value passed to 'css' function must be a 'css' function String: ${v}.`
                );
              })()
      ), strings[0]);
  return new (CSSString as ConstructableCSSString)(
    cssText,
    strings,
    safetyToken
  );
};

export const adoptStyles = (
  renderRoot: ShadowRoot | HTMLElement,
  styles: Array<CSSValue>
) => {
  styles.forEach((style) => {
    const styleEl = document.createElement('style');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nonce = (globalThis as any)['prodcoreNonce'];
    nonce !== undefined ?? styleEl.setAttribute('nonce', nonce);
    styleEl.textContent = (style instanceof CSSString) ? style.cssText : '';
    renderRoot instanceof ShadowRoot 
      ? renderRoot.appendChild(styleEl) 
      : document.head.appendChild(styleEl);
  });
};

export const getCompatibleStyle = (style: CSSValue): CSSValue => 
  globalThis.CSSStyleSheet === undefined
    ? (style instanceof CSSStyleSheet 
      ? (() => {
        let cssText = '';
        for (const rule of style.cssRules) {
          cssText += rule.cssText;
        }
        return unsafeCSS(cssText);
      })() 
      : style)
    : style;
