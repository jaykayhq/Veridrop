/* eslint-disable */
export const brand = {
  name: "Veridrop",
  tagline: "Trust Commerce Infrastructure",
  description: "Escrow-protected payments, physical inspection at source, and managed logistics — the trust layer for verified commerce across Africa.",

  colors: {
    dark: {
      background: "#0a0a0a",
      backgroundElevated: "#111111",
      backgroundHover: "#1a1a1a",
      surface: "#111111",
      surfaceHover: "#1a1a1a",
      border: "#1a1a1a",
      borderHover: "#2a2a2a",
      borderFocus: "#00bda6",
      textPrimary: "#e8e8e8",
      textSecondary: "#a0a0a0",
      textMuted: "#666666",
      textInverse: "#0a0a0a",
      brandTeal: "#089b8a",
      brandTealLight: "#00bda6",
      brandTealMuted: "#00bda622",
      brandBlue: "#0a54a6",
      brandBlueMuted: "#0a54a622",
      brandGold: "#c8a862",
      brandGoldMuted: "#c8a86222",
      success: "#00bda6",
      warning: "#d97706",
      danger: "#dc2626",
      focusRing: "#00bda666",
    },
    light: {
      background: "#ffffff",
      backgroundElevated: "#f8f9fa",
      backgroundHover: "#f1f5f9",
      surface: "#ffffff",
      surfaceHover: "#f8f9fa",
      border: "#e2e8f0",
      borderHover: "#cbd5e1",
      borderFocus: "#0a54a6",
      textPrimary: "#1a1a1a",
      textSecondary: "#475569",
      textMuted: "#64748b",
      textInverse: "#ffffff",
      brandTeal: "#089b8a",
      brandTealLight: "#00bda6",
      brandTealMuted: "#00bda61a",
      brandBlue: "#0a54a6",
      brandBlueMuted: "#0a54a61a",
      brandGold: "#c8a862",
      brandGoldMuted: "#c8a8621a",
      success: "#00bda6",
      warning: "#d97706",
      danger: "#dc2626",
      focusRing: "#0a54a633",
    },
  },

  gradients: {
    brandPrimary: "linear-gradient(135deg, #0a54a6 0%, #00bda6 100%)",
    brandPrimaryReverse: "linear-gradient(135deg, #00bda6 0%, #0a54a6 100%)",
    brandGold: "linear-gradient(135deg, #c8a862 0%, #e8c872 100%)",
    brandSubtle: "linear-gradient(135deg, #00bda622 0%, #0a54a611 100%)",
    brandSubtleReverse: "linear-gradient(135deg, #0a54a611 0%, #00bda622 100%)",
    textGradient: "linear-gradient(135deg, #00bda6 0%, #0a54a6 50%, #00bda6 100%)",
    goldTextGradient: "linear-gradient(135deg, #c8a862 0%, #e8c872 100%)",
    surface: "linear-gradient(180deg, #111111 0%, #0a0a0a 100%)",
    surfaceLight: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
    heroMesh: "radial-gradient(ellipse 80% 50% at 50% -20%, #00bda61a 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, #0a54a61a 0%, transparent 60%)",
  },

  typography: {
    fontFamilies: {
      display: '"Canela", "Georgia", serif',
      displayFallback: "Georgia, serif",
      heading: '"Space Grotesk", "Inter", system-ui, sans-serif',
      headingFallback: "Inter, system-ui, sans-serif",
      body: '"Inter", system-ui, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
      monoFallback: "Fira Code, monospace",
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    sizes: {
      display: "clamp(3.5rem, 8vw, 6rem)",
      h1: "clamp(2.5rem, 5vw, 4rem)",
      h2: "clamp(2rem, 4vw, 3rem)",
      h3: "clamp(1.5rem, 3vw, 2.25rem)",
      h4: "clamp(1.25rem, 2.5vw, 1.75rem)",
      h5: "clamp(1.125rem, 2vw, 1.5rem)",
      h6: "clamp(1rem, 1.5vw, 1.25rem)",
      bodyLarge: "1.125rem",
      body: "1rem",
      bodySmall: "0.875rem",
      caption: "0.75rem",
      micro: "0.625rem",
    },
    lineHeights: {
      tight: 1.1,
      snug: 1.35,
      normal: 1.5,
      relaxed: 1.65,
      loose: 1.8,
    },
    letterSpacing: {
      tighter: "-0.03em",
      tight: "-0.02em",
      normal: "0",
      wide: "0.02em",
      wider: "0.05em",
      widest: "0.1em",
      tracking: "0.15em",
      trackingWide: "0.2em",
    },
  },

  spacing: {
    base: 4,
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
  },

  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  shadows: {
    none: "none",
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
    xxl: "0 25px 50px -12px rgb(0 0 0 / 0.5)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.4)",
    brandGlow: "0 0 30px -10px rgb(13 143 143 / 0.4)",
    brandGlowSubtle: "0 0 20px -8px rgb(13 143 143 / 0.15)",
    goldGlow: "0 0 30px -10px rgb(200 168 98 / 0.3)",
    focus: "0 0 0 3px rgb(13 143 143 / 0.4)",
  },

  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
    slower: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    modal: 40,
    popover: 50,
    tooltip: 60,
    toast: 70,
    max: 9999,
  },

  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },

  logo: {
    mark: {
      primary: "V",
      symbol: "⬢",
      description: "Hexagonal trust mark representing the six pillars: Escrow, Inspection, Logistics, Verification, Settlement, Trust",
    },
    wordmark: "VERIDROP",
    lockup: {
      horizontal: "mark + wordmark",
      vertical: "mark above wordmark",
      iconOnly: "mark only",
    },
    clearSpace: "height of 'V' in wordmark",
    minWidth: "32px (icon), 120px (lockup)",
  },

  iconography: {
    style: "outline",
    strokeWidth: 1.5,
    cornerRadius: 2,
    sizes: {
      xs: 12,
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
  },

  motion: {
    reduced: "0ms",
    micro: "100ms",
    standard: "200ms",
    complex: "300ms",
    page: "400ms",
    easing: {
      standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      emphatic: "cubic-bezier(0.2, 0, 0, 1)",
      spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
  },

  components: {
    button: {
      heights: {
        sm: 36,
        md: 44,
        lg: 52,
        xl: 60,
      },
      borderRadius: 8,
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
    input: {
      height: 44,
      borderRadius: 8,
      borderWidth: 1,
      fontSize: "1rem",
      paddingX: 16,
      paddingY: 12,
    },
    card: {
      borderRadius: 12,
      borderWidth: 1,
      padding: 24,
    },
    badge: {
      height: 24,
      borderRadius: 6,
      fontSize: "0.625rem",
      fontWeight: 600,
      letterSpacing: "0.05em",
      paddingX: 8,
    },
    table: {
      cellPaddingY: 12,
      cellPaddingX: 16,
      headerFontSize: "0.75rem",
      headerFontWeight: 600,
      headerLetterSpacing: "0.05em",
      rowHoverBg: "rgb(17 17 17)",
    },
  },

  trustSignals: {
    badges: [
      "Escrow Protected",
      "Physically Inspected",
      "Managed Logistics",
      "Chain of Custody Verified",
      "Dispute Arbitration",
    ],
    certifications: [
      "PCI DSS Compliant",
      "SOC 2 Type II",
      "GDPR Ready",
      "ISO 27001 Aligned",
    ],
    metrics: {
      escrowVolume: "$2.5M+",
      transactions: "5K+",
      vendors: "1K+",
      inspectors: "500+",
      passRate: "95%",
      disputeRate: "<0.5%",
    },
  },

  voice: {
    tone: "confident, precise, trustworthy",
    principles: [
      "Lead with clarity, not cleverness",
      "Use specific numbers over vague claims",
      "Acknowledge risk, then show how we eliminate it",
      "Speak like a partner, not a vendor",
      "Every word must earn its place",
    ],
    vocabulary: {
      preferred: ["secure", "verified", "guaranteed", "protected", "transparent", "immutable", "settled"],
      avoid: ["safe", "secure-ish", "mostly", "try", "hope", "believe", "feel"],
    },
  },
} as const;

export type BrandConfig = typeof brand;

export function getColor(mode: "dark" | "light", path: string): string {
  const keys = path.split(".");
  let value: any = brand.colors[mode];
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return "";
  }
  return value;
}

export function getGradient(name: keyof typeof brand.gradients): string {
  return brand.gradients[name];
}

export function getFontFamily(role: "display" | "heading" | "body" | "mono"): string {
  return brand.typography.fontFamilies[role];
}

export function getSpacing(steps: number): string {
  return `${brand.spacing.base * steps}px`;
}

export function getShadow(name: keyof typeof brand.shadows): string {
  return brand.shadows[name];
}

export function getTransition(name: keyof typeof brand.transitions): string {
  return brand.transitions[name];
}
