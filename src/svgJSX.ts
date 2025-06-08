// Forked from https://github.com/callmecavs/understated/blob/751d973e31b267cc1a7ed246170beeb673ebc662/src/understated.js
// Licensed MIT: https://github.com/callmecavs/understated/blob/751d973e31b267cc1a7ed246170beeb673ebc662/package.json#L10

import type { ReactElement } from "react";

// Changes:
// - Converted to TypeScript
// - Convert to ESM
// - Comments
// - Added support for null/false
// - Added support for camelCase -> kebab attributes
// - Special case for certain camel case attributes
//

/** Converts a JSX element into DOM calls, this is sorta your root entry point */
export const render = (tree: ReactElement, target?: any, ns = false) => {
  const rootElement = build(tree, ns);
  if (target && rootElement) target.appendChild(rootElement);
  return rootElement;
};

/** The JSX factory fn */
export const h = (tag: string, props: any, ...children: any[]) => {
  return {
    tag,
    props: props || {},
    children: [].concat(...children),
  };
};

const createText = (str: string | number) =>
  document.createTextNode(str.toString());

const setClassAttr = (node: HTMLElement | SVGElement, value: string) =>
  node.setAttribute("class", value);

const setBooleanAttr = (
  node: HTMLElement | SVGElement,
  name: keyof HTMLElement | keyof SVGElement,
  value: any
) => {
  if (value) {
    node.setAttribute(name, "");
    (node as any)[name as any] = true;
  } else {
    (node as any)[name as any] = false;
  }
};

const setEventAttr = (
  node: HTMLElement | SVGElement,
  name: keyof HTMLElementEventMap,
  value: any
) => node.addEventListener(name, value, false);

const setStyleAttr = (node: HTMLElement | SVGElement, value: any) => {
  if (typeof value === "string") {
    node.setAttribute("style", value);
  } else {
    if (!value) return;
    Object.keys(value).forEach((key) => {
      let styleVal = value[key];
      if (typeof value[key] === "number") {
        styleVal = value[key].toString() + "px";
      }
      node.style[key as any] = styleVal;
    });
  }
};

const createNode = (tag: string, props: any, children: any[], ns?: boolean) => {
  const svg = ns || tag === "svg";

  const node = svg
    ? document.createElementNS("http://www.w3.org/2000/svg", tag)
    : document.createElement(tag);

  if (props) {
    Object.keys(props).forEach((name) => {
      const value = props[name];

      if (name === "className") {
        setClassAttr(node, value);
      } else if (name === "style") {
        setStyleAttr(node, value);
      } else if (typeof value === "boolean") {
        setBooleanAttr(node, name as any, value);
      } else if (name.slice(0, 2) === "on") {
        const eventName = name.slice(2).toLowerCase();
        setEventAttr(node, eventName as any, value);
      } else {
        const hasCap = /[A-Z]/.test(name);
        const kebabCase =
          hasCap && !specialCasesForCamelCase.includes(name)
            ? name
                .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
                .toLowerCase()
            : name;
        if (name.toLowerCase() === "crossorigin") {
          node.setAttribute(name.toLowerCase(), value);
        } else {
          node.setAttribute(kebabCase, value);
        }
      }
    });
  }

  if (children && children.length > 0)
    children.forEach((child) => render(child, node, svg));

  return node;
};

const createComponent = (
  tag: (props: any) => HTMLElement | SVGElement | Text,
  props: any,
  children: any[]
) => {
  props["children"] = children;
  return build(tag(props));
};

const build = (obj: any, ns?: any): HTMLElement | SVGElement | Text | null => {
  if (obj === null || obj === undefined || obj === false) {
    return null;
  } else if (typeof obj === "string" || typeof obj === "number") {
    return createText(obj);
  } else if (typeof obj.tag === "function") {
    return createComponent(obj.tag, obj.props, obj.children);
  } else {
    return createNode(obj.tag, obj.props, obj.children, ns);
  }
};

/** Known attributes which shouldn't get auto-kebab'd */
const specialCasesForCamelCase = [
  "viewBox",
  "preserveAspectRatio",
  "patternUnits",
  "tabIndex",
  "crossOrigin",
  "gradientTransform",
  "gradientUnits",
  "textLength",
  "lengthAdjust",
];
