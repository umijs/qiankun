type NavigateArg = string | HTMLAnchorElement | MouseEvent;
declare global {
  interface Window {
    singleSpaNavigate: (obj: NavigateArg) => void;
  }
}

export {};
