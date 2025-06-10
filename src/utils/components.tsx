/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export const bindTableFixedBehavior = (ref: HTMLTableCellElement) => {
  return ref && ref.parentElement
    ? (ref.style.top = `${
        ref.parentElement!.getBoundingClientRect().top -
        ref.parentElement!.parentElement!.getBoundingClientRect().top
      }px`)
    : null;
};

export const findComponentsByGroup = (groups: any, type: React.FC) => {
  const targetName = type.displayName || type.name;
  const result: React.ReactNode[] = [];

  const search = (group: any) => {
    if (group && group.type) {
      const groupType = group.type.displayName || group.type.name;

      if (groupType === targetName) {
        result.push(group.props.children);
      }
    }
  };

  if (Array.isArray(groups)) {
    groups.forEach(search);
  } else {
    search(groups);
  }

  return result;
};

export const isOfType = (element: React.ReactComponentElement<any>, type: React.FC) => {
  const elementType = element.type.name || element.type.displayName;
  const name = type.name || type.displayName;

  return name && name === elementType;
};

export const renderComponent = (Component?: React.ElementType, props?: object) =>
  Component ? <Component {...props} /> : null;

export const classes = (...args: (string | undefined | null | false | 0)[]) => {
  const arr: string[] = [];
  args.forEach((arg) => (arg ? arr.push(arg) : null));
  return arr.join(' ');
};

export const scrollToRef = (ref: React.RefObject<any>) => {
  if (ref && ref.current) {
    _scrollIntoView(ref.current);
  }
};

export const scrollToRefAndFocus = (ref?: React.RefObject<any>) => {
  if (ref && ref.current) {
    _scrollIntoView(ref.current);
    ref.current.focus({ preventScroll: true });
  }
};

export const focusRef = (ref: React.RefObject<any>) => {
  if (ref && ref.current) {
    ref.current.focus({ preventScroll: true });
  }
};

export function getScrollingParent(el: Node | null): Node | null {
  if (!(el instanceof HTMLElement)) {
    return null;
  }

  if (isScrollable(el)) {
    return el;
  }

  return getScrollingParent(el.parentNode);
}

function _scrollIntoView(el: HTMLElement) {
  if (typeof el.scrollIntoView === 'function') {
    try {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    } catch (err) {
      el.scrollIntoView();
    }
  }
}

function isScrollable(el: HTMLElement) {
  const computedStyle = window.getComputedStyle(el) as any;
  const overflowRegex = /(auto|scroll)/;
  const properties = ['overflow', 'overflowX', 'overflowY'];

  return properties.find((property) => overflowRegex.test(computedStyle[property]));
}
