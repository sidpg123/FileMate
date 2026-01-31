"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}

/**
 * 
 * What is portal? ::::====>>>>>
 * 
 Great question. This is one of those **“once it clicks, React feels more powerful”** concepts.

I’ll explain **what a Portal is, why it exists, and when you *must* use it**, in a very practical way.

---

## 1️⃣ What is a Portal (in plain English)

A **Portal** lets you render a React component **outside its parent DOM tree**, while **keeping it in the same React component tree**.

👉 **React logic stays the same**
👉 **DOM position changes**

Think of it like this:

> “Logically this component belongs here,
> but visually it should live somewhere else.”

---

## 2️⃣ Normal rendering vs Portal rendering

### ❌ Normal rendering (problematic for overlays)

```tsx
<App>
  <Navbar>
    <MobileMenu />   ❌ rendered inside navbar
  </Navbar>
</App>
```

DOM becomes:

```html
<body>
  <nav>
    <div class="mobile-menu">...</div> ❌
  </nav>
</body>
```

### Problems:

* Inherits parent styles (`overflow`, `z-index`)
* Scroll bugs
* Clipping issues
* Sticky / fixed weirdness

---

### ✅ Portal rendering (correct for overlays)

```tsx
<App>
  <Navbar>
    <MobileMenu />   ← logically here
  </Navbar>
</App>
```

DOM becomes:

```html
<body>
  <nav>...</nav>
  <div class="mobile-menu">...</div> ✅
</body>
```

**Same React state**, **different DOM location**.

---

## 3️⃣ Why Portals exist (the real reason)

Portals solve **UI layering problems**:

| UI Element  | Why Portal               |
| ----------- | ------------------------ |
| Modal       | Escape parent overflow   |
| Dropdown    | Escape `overflow:hidden` |
| Tooltip     | Proper z-index           |
| Toast       | Global visibility        |
| Mobile menu | Avoid scroll issues      |

This is why **almost every UI library uses portals internally**.

---

## 4️⃣ How Portal fixes YOUR navbar issue

Your problem:

* Navbar is inside a scrolling page
* Mobile menu rendered inside navbar
* Body scroll + fixed overlay fight each other

### With Portal:

* Menu is rendered **directly under `<body>`**
* It ignores page scroll
* No background transparency
* No scroll locking hacks

That’s why this is the clean solution.

---

## 5️⃣ Does Portal break React rules?

❌ No.

React guarantees:

* Props work normally
* State updates normally
* Context works
* Event bubbling works

```tsx
<button onClick={() => setIsClick(false)} />
```

This still works even though DOM is elsewhere.

---

## 6️⃣ Real-world analogy (easy to remember)

Think of a **theatre play** 🎭

* Script (React tree) stays the same
* Actors may enter from a different stage door (Portal)
* Audience doesn’t care — play works perfectly

---

## 7️⃣ Is Portal “industry standard”?

### 100% YES

Used by:

* **Radix UI** (Dialog, Dropdown, Popover)
* **shadcn/ui**
* **Headless UI**
* **Material UI**
* **Ant Design**
* **React Aria**

If you use modals or dropdowns → you’re already using portals.

---

## 8️⃣ When you should NOT use Portal

❌ Regular layout components
❌ Cards, sections, lists
❌ Anything that depends on parent layout flow

Use Portal **only for floating UI**.

---

## 9️⃣ Minimal Portal code (for memory)

```tsx
import { createPortal } from "react-dom";

createPortal(
  <MobileMenu />,
  document.body
);
```

That’s it. Everything else is ergonomics.

---

## 🔑 Final mental model (important)

> **Portal = visual escape hatch, not a logic escape**

You use it when **DOM hierarchy ≠ UI hierarchy**.

---

If you want next:

* I can refactor your navbar **using Portal**
* Or convert it to **Radix Dialog** (even better)
* Or explain **event bubbling through portals**

Just say 👍

 */