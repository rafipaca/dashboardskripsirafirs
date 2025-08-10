"use client";

import React from "react";
import katex from "katex";

interface MathTexProps {
  tex: string;
  inline?: boolean;
  className?: string;
}

export function MathTex({ tex, inline = false, className }: MathTexProps) {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(tex, {
        throwOnError: false,
        displayMode: !inline,
        output: 'html',
      });
    } catch {
      return tex;
    }
  }, [tex, inline]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default MathTex;
