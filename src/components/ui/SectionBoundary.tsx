"use client";

import { Component, type ReactNode } from "react";
import { reportError } from "@/lib/monitoring";
import { SectionUnavailable } from "./SectionUnavailable";

interface SectionBoundaryProps {
  /** Names the section in error reports, e.g. "dashboard:passes" */
  name: string;
  children: ReactNode;
  /** Replaces the default "couldn't load" card; null hides the section */
  fallback?: ReactNode;
  className?: string;
}

/**
 * Error boundary around one section of a page. If anything inside throws
 * while rendering (including server components streamed into it), only this
 * section shows a retry card and the rest of the page stays usable.
 */
export class SectionBoundary extends Component<SectionBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error & { digest?: string }) {
    // Server render errors carry a digest and were reported on the server
    if (error.digest) console.error(error);
    else reportError(`[section:${this.props.name}] render failed`, error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;
    return <SectionUnavailable className={this.props.className} onRetry={() => this.setState({ failed: false })} />;
  }
}
