# Promptly — Design Specification

> Web implementation: The original mobile-first visual system is preserved in a responsive React website. Compact screens use bottom navigation and single-column content; desktop screens use a persistent sidebar and multi-column grids. Touch targets, readable prompt surfaces, and restrained glass effects remain unchanged.

## 1. Design Direction

Promptly should use a **minimal black-and-white glass-fluid interface inspired by modern iOS design**.

The interface should feel:

- Clean
- Soft
- Premium
- Lightweight
- Calm
- Layered
- Fluid
- Mobile-first

The visual system should combine monochrome minimalism with subtle translucent surfaces, blurred backgrounds, soft borders, and restrained depth.

Avoid making the interface overly glossy, colorful, decorative, or futuristic. The glass effect should support usability rather than become the main visual focus.

---

## 2. Core Visual Identity

Use:

- White, black, charcoal, and soft gray tones
- Semi-transparent surfaces
- Background blur
- Thin translucent borders
- Soft inner highlights
- Minimal shadows
- Smooth rounded corners
- Clear typography
- Subtle layered depth
- Generous spacing

Avoid:

- Bright gradients
- Rainbow glass effects
- Neon colors
- Heavy shadows
- Excessive transparency
- Low-contrast text
- Overlapping too many glass layers
- Large decorative illustrations
- Strong reflections
- Excessive glowing effects

---

## 3. Color System

Use a monochrome semantic color system.

### Background

```text
Main Background: #F5F5F5
Secondary Background: #ECECEC
Deep Background: #111111
```

The main background may use a very subtle vertical tonal shift, but it should remain neutral and monochrome.

### Text

```text
Primary Text: #0A0A0A
Secondary Text: #5E5E5E
Muted Text: #8A8A8A
Inverse Text: #FFFFFF
```

### Glass Surfaces

```text
Light Glass: rgba(255, 255, 255, 0.58)
Strong Glass: rgba(255, 255, 255, 0.76)
Dark Glass: rgba(18, 18, 18, 0.64)
Muted Glass: rgba(245, 245, 245, 0.48)
```

### Borders

```text
Light Glass Border: rgba(255, 255, 255, 0.72)
Dark Glass Border: rgba(255, 255, 255, 0.12)
Neutral Border: rgba(10, 10, 10, 0.08)
```

### Feedback Colors

Use semantic colors only when needed.

```text
Success: #1F7A4D
Danger: #B42318
Warning: #8A6116
```

These colors should appear only in compact feedback elements and should not dominate the interface.

---

## 4. Background Treatment

The application background should not be completely flat.

Use a restrained layered background:

- Soft off-white base
- Very subtle radial or vertical tonal variation
- Optional blurred gray shape placed far behind the content
- No colorful gradient blobs
- No visible texture noise unless extremely subtle

Example visual concept:

```text
Soft gray-white background
        ↓
Faint blurred monochrome shape
        ↓
Translucent glass panels
        ↓
Sharp black text and icons
```

The background should make the glass panels visible without distracting from the prompt content.

---

## 5. Glass Surface Rules

Glass surfaces should be used for:

- Top navigation bars
- Search bars
- Folder cards
- Category selector chips
- Bottom sheets
- Floating action buttons
- Sticky action bars
- Toasts
- Menus
- Prompt action panels

Do not place every element inside a glass card.

Long prompt content should remain on a more solid, readable surface.

Recommended glass treatment:

```text
Background opacity: 48%–76%
Backdrop blur: 16–28px
Border: 1px translucent white or black
Shadow: soft and low-opacity
Corner radius: 18–26px
```

Each glass surface should have:

- Clear separation from the background
- Sufficient contrast
- One subtle border
- Minimal shadow
- No harsh outer glow

---

## 6. Typography

Use **Inter** throughout the application.

Recommended font weights:

- 400 — body text
- 500 — labels and metadata
- 600 — headings and primary actions
- 700 — rare emphasis only

Suggested scale:

| Style | Size | Usage |
|---|---:|---|
| Caption | 12px | Dates and metadata |
| Small | 14px | Labels and compact actions |
| Body | 16px | Prompt content and form fields |
| Card Title | 17–18px | Folder, category, and prompt titles |
| Section Title | 20px | Screen sections |
| Page Title | 26–30px | Main screen heading |
| Brand Title | 32–36px | Splash branding |

Prompt content should always prioritize readability over glass effects.

Use:

- Minimum 16px font
- Comfortable line height
- Strong contrast
- Clear paragraph spacing

---

## 7. Spacing

Use a 4px spacing scale.

Recommended spacing:

```text
Screen horizontal padding: 16px
Tablet horizontal padding: 24px
Card padding: 16px
Large card padding: 20px
Card gap: 12px
Section gap: 24px
Large section gap: 32px
```

Glass interfaces can become visually busy, so spacing should remain generous.

---

## 8. Shape Language

Use fluid rounded shapes.

Recommended radius:

```text
Input: 14–16px
Button: 14–18px
Folder Card: 22px
Category Card: 20px
Prompt Card: 18px
Bottom Sheet: 28px at the top
Floating Button: 24px or fully rounded
Toast: 18px
```

Use continuous corner curves where supported to achieve an iOS-like appearance.

Avoid excessively pill-shaped cards.

---

## 9. Splash Screen

The splash screen should display:

- Promptly wordmark
- Minimal black or white symbol
- Soft off-white background
- Very subtle fade animation

Do not use glass panels on the splash screen unless they add clear value.

The splash screen should feel immediate and quiet.

---

## 10. Home Screen

The Home screen should include:

- Promptly title
- Search bar
- Favorites section
- Recent Prompts section
- Folder grid or list
- Create Folder button

### Home Header

Use a floating glass top bar:

- Semi-transparent white surface
- Strong blur
- Thin bottom border
- Safe-area padding
- Promptly title
- Search and settings actions

The top bar should remain readable while scrolling over content.

### Search Bar

Use a glass search field:

- Translucent white background
- Search icon
- Placeholder text
- Soft border
- Clear focused state

Avoid adding a heavy shadow.

---

## 11. Folder Cards

Folders represent fashion products such as:

- Dress
- Pants
- Shorts
- Tops
- Bags
- Skirts

Folder cards should use strong glass surfaces.

Each card should display:

- Folder name
- Optional description
- Total prompt count
- Updated date
- Overflow action

Recommended folder-card design:

- Semi-transparent white panel
- Soft background blur
- Thin bright top border
- Minimal shadow
- Large readable title
- Small metadata row
- Monochrome folder icon

The card should not scale dramatically when pressed.

Use a subtle opacity or elevation change.

---

## 12. Folder Screen

Opening a folder should display the prompts inside it.

Example:

```text
Dress

Search prompts

Editorial silhouette
Studio lookbook
Runway movement
+ Create Prompt
```

Each prompt card should show:

- Prompt title
- Short prompt preview
- Category name
- Updated date
- Favorite and copy actions

The screen should support searching all prompts in the folder. Creating a
prompt opens a form where the category is selected or created inline.

Recommended layout:

- Single-column prompt cards on compact screens, or
- Two- or three-column prompt grid on larger screens

New folders must not create default categories.

---

## 13. Category Selector

Categories are metadata selected while creating or editing a prompt. Display
existing categories as compact selector chips, followed by a `+ New category`
choice.

Recommended appearance:

- High-contrast selected state
- Thin borders for unselected choices
- Clear category names
- A text field when `+ New category` is selected

Pressing a category choice should use:

- Subtle opacity change
- Small 1–2px downward movement

Avoid bounce-heavy interactions.

---

## 14. Prompt Creation Flow

Prompt creation starts from the open folder and includes category selection in
the form.

Example:

```text
Create prompt

Category: [Editorial] [Movement] [+ New category]
Title
Prompt
Notes
Save prompt
```

Include:

- Back navigation
- Existing category choices for the current folder
- Inline new-category input
- Title, prompt content, and notes fields
- Save action and validation feedback

The header may use a glass navigation bar.

After saving, the prompt appears directly in the folder's prompt list.

---

## 15. Prompt Cards

Prompt cards should use restrained glassmorphism.

Each card should display:

- Prompt title
- Prompt preview
- Favorite action
- Copy button
- Updated date
- Overflow menu

Recommended treatment:

- Light translucent surface
- Moderate blur
- Soft border
- Minimal shadow
- Clear text contrast
- Preview limited to 3–5 lines

Do not let the background show through too strongly behind prompt text.

---

## 16. Prompt Detail Screen

The Prompt Detail screen should prioritize the full prompt.

Display:

- Prompt title
- Folder name
- Category name
- Full prompt content
- Notes
- Favorite
- Copy button
- Edit button
- Archive button
- Delete action

Use:

- Glass header
- Solid or nearly opaque prompt content surface
- Floating glass action bar
- Large copy button

The full prompt text should not sit on a highly transparent background.

Recommended content surface:

```text
rgba(255, 255, 255, 0.88)
```

This preserves the glass aesthetic while maintaining readability.

---

## 17. Create and Edit Screens

Use a full-screen form.

Fields:

- Title
- Category
- Prompt content
- Notes

Design requirements:

- Glass navigation header
- Mostly solid form fields
- Large multiline prompt editor
- Sticky glass save bar
- Clear labels
- Inline validation
- Keyboard-aware scrolling

The prompt editor should be more opaque than standard inputs.

---

## 18. Buttons

### Primary Button

Use:

- Black background
- White text
- Slight glass highlight
- Rounded corners
- Minimum height of 48px

The primary button should remain visually solid for contrast.

### Secondary Button

Use:

- Semi-transparent white glass
- Black text
- Thin neutral border

### Floating Action Button

Use:

- Dark translucent glass or solid black
- White icon
- Soft shadow
- Large touch target
- Safe-area spacing

### Destructive Button

Use:

- Light glass background
- Red text or icon
- Confirmation required

---

## 19. Form Fields

Recommended field style:

- Light translucent white background
- Subtle blur
- Neutral border
- Strong black text
- Visible focus ring
- Minimum 48px height

Do not use transparent inputs over visually complex backgrounds.

The prompt textarea should use:

- Higher opacity
- Minimum height of 220px
- Comfortable line height
- Strong contrast

---

## 20. Bottom Sheets

Use glass bottom sheets for:

- Folder actions
- Prompt actions
- Sort options
- Delete confirmation
- Create Prompt
- Create Folder

Recommended appearance:

- Strong translucent white surface
- Heavy but smooth background blur
- Thin top highlight
- Rounded top corners
- Soft shadow
- Drag handle

Bottom-sheet movement should be smooth, natural, and restrained.

---

## 21. Toasts

Toasts should use compact floating glass panels.

Recommended toast style:

- Strong blur
- Semi-transparent dark or light surface
- Thin border
- Short message
- Optional monochrome icon
- Safe-area positioning

Examples:

- Folder created
- Category added
- Prompt saved
- Prompt copied
- Prompt updated
- Prompt archived
- Prompt deleted
- Unable to connect

---

## 22. Loading Skeletons

Skeletons should match the glass layout.

Use:

- Soft gray translucent blocks
- Gentle shimmer
- No bright white flashing
- Shapes that match final cards

Create skeletons for:

- Folder cards
- Category selector chips
- Prompt cards
- Prompt detail
- Search results

---

## 23. Empty States

Empty states should remain minimal.

### No Folders

**Title:** No folders yet  
**Text:** Create your first fashion folder to organize your prompts.  
**Action:** Create Folder

### Empty Folder

**Title:** No prompts here yet  
**Text:** Create a prompt, then choose or create its category in the form.
**Action:** Create Prompt

### No Search Results

**Title:** No matching prompts  
**Text:** Try another keyword.

Use a small monochrome icon rather than a large illustration.

---

## 24. Motion and Interaction

Movement must look natural, smooth, realistic, and restrained.

Use:

- Soft fades
- 4–8px vertical transitions
- Smooth glass-sheet movement
- Gentle opacity changes
- Subtle press feedback
- Light haptic feedback
- 180–260ms durations

Avoid:

- Exaggerated bounce
- Large scale changes
- Overly elastic springs
- Continuous floating animation
- Excessive blur animation
- Flashy transitions

Glass blur should remain stable during most transitions to protect performance.

---

## 25. Performance Guidelines

Glassmorphism can affect performance, especially on mobile.

Use blur selectively.

Recommended priorities:

1. Top bars
2. Bottom sheets
3. Floating actions
4. Folder and category cards
5. Toasts

Avoid applying heavy blur to every prompt card in a long list.

For long lists:

- Use lighter transparency
- Use fewer blur layers
- Reuse shared surfaces
- Prefer solid semi-transparent cards when needed

The app should remain smooth on mid-range Android devices.

---

## 26. Accessibility

Maintain:

- Strong text contrast
- Minimum 44×44px touch targets
- Visible focus states
- Accessible labels
- Dynamic text support
- Reduced-motion support
- Clear destructive confirmations
- No meaning conveyed by transparency alone

If a glass panel reduces text contrast, increase panel opacity.

Usability always takes priority over the glass effect.

---

## 27. Tablet Behavior

On tablets:

- Increase outer margins
- Use two-column folder and category grids
- Limit prompt-content width
- Center forms
- Use larger glass surfaces without stretching text too widely
- Consider side-by-side category and prompt layouts later

---

## 28. Overall Design Success Criteria

The Promptly design is successful when:

- The app feels like a refined iOS-inspired personal tool.
- The interface remains minimal and monochrome.
- Glass surfaces create depth without reducing readability.
- Folders and categories are easy to distinguish.
- Switching from Image to Video to Movements feels fast.
- Prompt text is always clear and readable.
- Motion feels smooth and natural.
- The interface remains performant on Android and iOS.
- The glass effect supports the workflow instead of distracting from it.
