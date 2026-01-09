# Fit Companion – Improvement Specification (v2)

## Purpose
This document describes proposed improvements and new features for the Fit Companion app.
The goal is to increase usability, sustainability, and intelligence of calorie and weight tracking,
without increasing cognitive load or promoting unhealthy behaviors.

The target user is an adult actively managing nutrition, exercise, and long-term health.

---

## 1. BMI Visualization Adjustment

### Problem
BMI is currently presented as a primary metric.
BMI is a noisy indicator for users who train, track macros, or have non-average body composition.

### Proposed Changes
- Reduce visual hierarchy of BMI card (smaller size or secondary placement).
- Add a disclaimer label:
  - Text: "Reference only"
- Emphasize trend-based metrics instead of static BMI classification.

### Acceptance Criteria
- BMI is no longer the most visually dominant health metric.
- Users clearly understand BMI is contextual, not definitive.

---

## 2. Replace Fixed "Ideal Weight" with Target Ranges

### Problem
A single fixed "Ideal Weight" value can be:
- Demotivating
- Unrealistic
- Misaligned with individual body composition

### Proposed Changes
- Replace "Ideal Weight" with:
  - Target Weight Range (e.g. 62–66 kg)
- Add milestone-based goals:
  - Example: "Next milestone: –3 kg"

### Acceptance Criteria
- Users see progress as a sequence of achievable steps.
- The UI supports flexible, personalized goals.

---

## 3. Aggressive Deficit Detection and Soft Warnings

### Problem
Very low daily calorie intake (e.g. <40% of TDEE) may be unsustainable.
Currently, the app does not provide contextual feedback.

### Proposed Changes
- Detect aggressive daily deficits using rules:
  - Example: Consumed < 60% of TDEE
- Trigger non-judgmental soft warnings.

### Example Copy
> "Today's deficit is very aggressive. Long-term consistency matters more than speed."

### Acceptance Criteria
- No blocking behavior.
- Warnings are informative, not moralizing.
- Users retain full control.

---

## 4. Trend-Based Insights (Weekly and Rolling)

### Problem
Daily values lack long-term context.

### Proposed Changes
Introduce rolling metrics:
- 7-day average calorie deficit
- 7-day average intake
- Projected weight change based on current trend

### Example Outputs
- "Average deficit (last 7 days): –980 kcal/day"
- "At this pace, estimated –1 kg every 8–9 days"

### Acceptance Criteria
- Trends are calculated automatically.
- Trend insights are readable in one sentence.

---

## 5. Deficit Quality Analysis

### Problem
Calorie deficit alone does not indicate quality of the nutrition strategy.

### Proposed Changes
Track and correlate:
- Protein intake percentage
- Training days vs rest days
- Deficit consistency on training days

### Example Insights
- "High-protein intake maintained on 5/7 days"
- "Deficit aligned with training on 4 workout days"

### Acceptance Criteria
- No macro micromanagement required.
- Insights are summary-based, not granular logs.

---

## 6. Sustainability Mode Toggle

### Problem
Users fluctuate between strict and sustainable phases.
The app currently applies a single behavioral logic.

### Proposed Changes
Add a global toggle:
- Mode: "Strict"
- Mode: "Sustainable"

### Behavioral Differences
| Feature | Strict | Sustainable |
|------|--------|-------------|
| Deficit warnings | Minimal | More frequent |
| Target deficits | Aggressive allowed | Capped |
| Copy tone | Neutral | Supportive |

### Acceptance Criteria
- Mode affects feedback logic, not data integrity.
- Mode can be changed at any time.

---

## 7. Fitty Assistant – Pattern Recognition

### Problem
Raw data is present but not interpreted proactively.

### Proposed Changes
Fitty Assistant should:
- Detect repeated patterns:
  - Multiple consecutive extreme deficits
  - Plateau despite deficit
- Provide short, actionable suggestions.

### Example Assistant Messages
- "You've been under-eating for 3 days in a row. Consider a maintenance day."
- "Weight plateau detected. Possible water retention."

### Acceptance Criteria
- Assistant insights are optional and dismissible.
- No medical claims.
- Language remains supportive and neutral.

---

## Non-Goals
- No calorie shaming
- No medical diagnosis
- No forced compliance
- No over-notification

---

## Design Principles
- Sustainability over speed
- Trends over single-day data
- Guidance without control
- Intelligence without judgment