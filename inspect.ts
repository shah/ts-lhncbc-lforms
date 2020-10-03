import type { NihLhcForm, FormItem } from "./lform.ts";

export interface FormItemsIndex {
  [key: string]: FormItem;
}

/**
 * Create a dictionary which looks and acts like a normal object but
 * is backed by a Proxy object that retrieves sections from a FormItems[]
 * supplier.
 * @param supplier The list of items to search when searching for sections
 */
export function sectionsIndex(
  items?: FormItem[],
  index: FormItemsIndex = {},
): FormItemsIndex {
  return new Proxy(index, {
    get: function (_, key) {
      if (!items) return undefined;
      let sections;
      switch (typeof key) {
        case "string":
          return items.find((i) => i.header && i.question == key);

        case "number":
          sections = items.filter((i) => i.header);
          return key >= 0 && key < sections.length ? sections[key] : false;

        default:
          return undefined;
      }
    },
    enumerate: function () {
      if (!items) return [];
      return items.filter((i) => i.header).map((item, index) =>
        item.question ? item.question : `<sect-${index}-name>`
      );
    },
    ownKeys: function () {
      if (!items) return [];
      return items.filter((i) => i.header).map((item, index) =>
        item.question ? item.question : `<sect-${index}-name>`
      );
    },
    has: function (_, key) {
      if (!items) return false;
      let sections;
      switch (typeof key) {
        case "string":
          return items.find((i) => i.header && i.question == key)
            ? true
            : false;

        case "number":
          sections = items.filter((i) => i.header);
          return key >= 0 && key < sections.length ? true : false;

        default:
          return false;
      }
    },
    getOwnPropertyDescriptor: function (_, key) {
      if (!items) return undefined;
      const item = items.find((i) => i.header && i.question == key);
      return item
        ? {
          value: item,
          writable: false, // TODO: allow writing
          enumerable: true,
          configurable: true,
        }
        : undefined;
    },
    // TODO: allow writing
    // set: function (oTarget, sKey, vValue) {
    //   if (sKey in oTarget) return false;
    //   return oTarget.setItem(sKey, vValue);
    // },
    // deleteProperty: function (oTarget, sKey) {
    //   if (sKey in oTarget) return false;
    //   return oTarget.removeItem(sKey);
    // },
    // defineProperty: function (oTarget, sKey, oDesc) {
    //   if (oDesc && "value" in oDesc) oTarget.setItem(sKey, oDesc.value);
    //   return oTarget;
    // },
  });
}

export interface LhcFormVisitorContext {
  form: NihLhcForm;
  handler: LchFormVisitItemHandler;
  maxLevels?: number;
}

export interface LhcFormVisitorSupplier {
  items?: FormItem[];
}

export interface LchFormVisitItemHandler {
  (
    ctx: LhcFormVisitorContext,
    item: FormItem,
    ...ancestors: FormItem[]
  ): unknown;
}

export function visitLhcFormItems(
  ctx: LhcFormVisitorContext,
  itemsSupplier: LhcFormVisitorSupplier = ctx.form,
  level = 0,
  ...ancestors: FormItem[]
): unknown {
  const maxLevels = typeof ctx.maxLevels === "undefined"
    ? Number.MAX_VALUE
    : ctx.maxLevels;
  let result: unknown;
  if (itemsSupplier.items) {
    for (const item of itemsSupplier.items) {
      result = ctx.handler(ctx, item, itemsSupplier, ...ancestors);
      if (level <= maxLevels && item.items) {
        result = visitLhcFormItems(ctx, item, level + 1, ...ancestors, item);
      }
    }
  }
  return result;
}
