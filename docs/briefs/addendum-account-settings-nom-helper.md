# NOM Helper — Addendum: account settings

Complements the main design brief. Adds the user settings modal.

---

## Form: modal, not screen

A modal centered over the application, following the convention of modern chat interfaces. The conversation remains visible behind it, dimmed.

This is the correct decision here: configuring an account is a brief and occasional task. Taking the user to a full screen breaks the work flow for something that takes fifteen seconds.

**Entry:** from the user identity area at the bottom of the sidebar. That footer already concentrates identity, the quota indicator, and sign out — settings belong there.

**Exit:** close with the escape key, with an explicit button, or by clicking outside. No confirmation on exit, because there are no unsaved changes to lose (see below).

---

## Internal structure

With so few sections, lateral navigation inside the modal is not needed. A single-column modal with separated blocks is more honest than imitating the navigation of a product with twenty settings.

Three blocks, in this order:

### 1. Account

- Display name — editable
- Email address — visible, editable with confirmation
- Password — not shown; one action to change it

The password change opens its own step inside the same modal: current password, new password, confirmation. Not a second modal on top of the first.

### 2. Usage

Read-only, no controls.

- Queries made today and the daily limit
- When the counter resets

Deliberately duplicates the information in the sidebar indicator, with slightly more context. This is where users come to understand the limit when it catches their attention.

### 3. Data

The destructive actions block. Visually separated from the two above, at the bottom.

- **Delete conversation history** — deletes conversations, keeps the account
- **Delete account** — deletes everything, permanently

Both require explicit confirmation. Account deletion requires the user to type something to confirm — it is irreversible and must not be possible by accident.

The confirmation text says exactly what is lost and what is not. No euphemisms.

---

## Save behavior

Changes are saved on confirming each field, not with a global save button at the bottom of the modal.

Reason: with a global save, closing the modal with the escape key silently discards work. With per-field saving, closing never loses anything and there is no need to ask "are you sure you want to leave?".

Each field needs visible save confirmation — discreet, no celebration.

---

## Error states

- Email already registered to another account
- Current password incorrect
- New password does not meet requirements
- Save failed

Same standard as the access screens: the error says what happened and how to resolve it, in the voice of the interface, without apologizing.

---

## Out of scope

Explicitly excluded from this pass:

- Light/dark theme — no dark mode in this version
- Language — the application is Spanish only
- Notifications
- Billing, plans, and payment method — no monetization yet
- Profile photo
- Integrations or export

**And something worth not adding even if it is tempting:** professional profile fields (trade, specialty, years of experience, employer). They are not used for anything in this version. Asking for data that feeds no function is cost to the user with no benefit, and creates obligations around information that does not need to be stored.

**The entry to the operator module does not live here.** It is a separate view with its own access from the sidebar, not an account setting.

---

## Visual direction

Inherits everything from the main brief: no gradients, solid sober colors, green and purple as identity accents, few font weights.

The modal is content, not spectacle: no elaborate entrance animation, dimmed background without heavy blur, comfortable reading width. On mobile it occupies the full screen.

The destructive actions block is distinguished by spacing and typographic hierarchy, not by alarm color — the palette does not encode state in this product.
