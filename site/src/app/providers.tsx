"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useLenis } from "./lenis-provider";

export function Providers({ children }: { children: ReactNode }) {
  useLenis();
  return <>{children}</>;
}
