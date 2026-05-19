---
name: Digital Brutalist System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4f4634'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#817661'
  outline-variant: '#d3c5ad'
  surface-tint: '#785a00'
  primary: '#785a00'
  on-primary: '#ffffff'
  primary-container: '#f4bd31'
  on-primary-container: '#694d00'
  inverse-primary: '#f5be32'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#646464'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#c4c5c5'
  on-tertiary-container: '#505252'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdf9d'
  primary-fixed-dim: '#f5be32'
  on-primary-fixed: '#251a00'
  on-primary-fixed-variant: '#5b4300'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-lg:
    fontFamily: Space Mono
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
  label-sm:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  border-width-thin: 1px
  border-width-thick: 3px
---

## Brand & Style

The design system is rooted in **Digital Brutalism**: an aesthetic that prioritizes raw functionality, structural honesty, and high-impact visual hierarchy. It is designed for users who value efficiency and a distinct, "unfiltered" digital experience.

The visual language is defined by high-contrast interfaces, heavy structural borders, and a rigid adherence to the grid. It avoids organic shapes and soft transitions in favor of "hard" depth and mechanical precision. The emotional response is one of intentionality, technical confidence, and no-nonsense utility, ensuring that despite the bold aesthetic, the interface remains exceptionally readable and predictable.

## Colors

The palette is stark and functional. The **Primary Accent (#f4bd31)** is used sparingly to draw attention to critical actions, status indicators, and active states. 

- **Primary**: A high-visibility yellow used for interactive prominence.
- **Secondary**: Pure Black, used for all structural elements, borders, and primary text.
- **Neutral**: High-contrast grays and whites to maintain a "raw web" or "technical document" feel.

Color application must follow a strict "ink-on-paper" philosophy: background surfaces are predominantly white or very light gray, with black used for all framing and containment logic.

## Typography

This design system employs a dual-font strategy to balance the "Digital Brutalist" aesthetic with high-performance legibility.

- **Headlines & Labels**: Utilizes **Space Mono**. This monospaced, technical typeface provides the "pixelated" and geometric feel required for a digital-first identity. It is used for all headings and UI labels (buttons, chips, tabs) to reinforce the mechanical nature of the system.
- **Body Text**: Utilizes **Inter**. To ensure long-form readability and accessibility, Inter provides a neutral, highly-legible contrast to the rigid headings.

All monospaced labels should be set in uppercase with tight line-heights to emphasize their role as functional UI markers rather than narrative text.

## Layout & Spacing

The layout is governed by a **Rigid Grid System**. All elements must align to a 4px baseline and a 12-column desktop grid. 

- **Columns**: 12 columns for desktop, 4 columns for mobile.
- **Gutters**: Fixed at 16px to create clear "channels" between structural blocks.
- **Borders**: Instead of using negative space to imply groupings, this system uses **Heavy Borders (3px)** to explicitly define containers.

The spacing philosophy is "packed." Elements should feel like they are part of a dense, efficient machine. Padding inside containers should be generous (24px+) to offset the visual weight of the thick borders.

## Elevation & Depth

This system rejects ambient shadows and soft blurs. Depth is conveyed through **Hard Offsets** and **Layered Borders**:

- **No Soft Shadows**: Avoid `box-shadow` with blur. Use "hard" black shadows (e.g., `4px 4px 0px #000000`) to simulate depth.
- **Tonal Layering**: Higher elevation is indicated by a thicker border or a primary color (#f4bd31) background.
- **Interactive Depth**: When a button is pressed, it should physically "sink" by removing its hard shadow and translating the element 4px down and right, mimicking a mechanical switch.

## Shapes

The shape language is strictly **Sharp (0px roundedness)**. 

Every UI element—including buttons, input fields, cards, and modals—must utilize 90-degree corners. This reinforces the "Brutalist" core and ensures the layout feels structural and architectural. Circular shapes are permitted only for specific status indicators or icons where a square would be semantically confusing.

## Components

- **Buttons**: Square corners, 3px solid black border, `Space Mono` uppercase text. Primary buttons use the `#f4bd31` background.
- **Input Fields**: White background with a 1px black border. On focus, the border thickens to 3px and the label shifts to the Primary color.
- **Cards**: Defined by a 3px black border. Content sections within the card are separated by 1px horizontal black rules.
- **Chips**: Small, rectangular blocks with 1px borders. Active chips are filled with `#f4bd31`.
- **Lists**: Strictly vertical with 1px bottom borders on each item. No hover-state background changes; instead, use a Primary color arrow or bracket (e.g., `>`) to indicate selection.
- **Checkboxes**: Square, 2px border. When checked, the box is filled with a solid black square or an "X" character in `Space Mono`.