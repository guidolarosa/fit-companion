AI Nutrition Analysis Response – FQS Integration Spec
1. Goal

When the user logs food using the AI analysis button, the AI must return:

Calories

Macronutrients

Food Quality Score (FQS)

All computed in one single AI response, using the same inferred food understanding.

2. AI Button Flow (Updated)

User action

User enters free-text food description
→ clicks “Analyze with AI”


AI responsibilities

Parse food items

Estimate calories + macros

Evaluate food quality

Return a structured JSON response

3. AI Output Contract (MANDATORY)

The LLM must always return valid JSON only.

{
  "calories": number,
  "macros": {
    "protein_g": number,
    "carbs_g": number,
    "fat_g": number,
    "fiber_g": number,
    "sugar_g": number
  },
  "food_quality_score": {
    "total": number,
    "breakdown": {
      "protein_density": number,
      "fiber_density": number,
      "processing_level": number,
      "sugar_load": number,
      "fat_quality": number
    },
    "label": "low" | "moderate" | "high"
  }
}


If the AI is uncertain, it must estimate conservatively, never omit fields.

4. FQS Calculation Rules (AI-Side)

The AI should calculate FQS after macros are inferred, using the same assumptions.

4.1 Protein Density (0–25)
proteinCalories = protein_g * 4
proteinRatio = proteinCalories / calories


Scoring:

≥ 0.20 → 25

0.15–0.19 → 18

0.10–0.14 → 10

< 0.10 → 5

4.2 Fiber Density (0–20)

≥ 8 g → 20

5–7.9 g → 14

2–4.9 g → 8

< 2 g → 3

0 g → 0

4.3 Processing Level (0–25)

Start at 25, then subtract:

−5 per ultraprocessed item detected

−7 if alcohol present

−5 if sugary beverage present

Floor: 0

Ultraprocessed examples:

burger, fries, pizza, soda, candy, chips, fast food

4.4 Sugar Load (0–15)

≤ 10 g → 15

10–25 g → 8

25–50 g → 3

50 g → 0

4.5 Fat Quality (0–15)

Mostly unsaturated (fish, olive oil, nuts, seeds, avocado) → 15

Mixed sources → 8–12

Mostly fried / trans fats → 0–5

5. Label Mapping
80–100 → "high"
50–79 → "moderate"
< 50 → "low"

6. Frontend Integration

Treat FQS like calories/macros: derived, not user-editable

Store FQS per day

Display:

Daily FQS

Weekly average

Tooltip:

“Food Quality Score reflects nutritional density and processing, not calories.”

7. Failure & Safety Rules

AI must never moralize

Never block saving food if FQS is low

If alcohol is present, apply penalty but still compute full score

Missing values → lowest non-zero tier (never null)

8. Prompt Snippet for the AI Button

You can prepend something like:

“Analyze the following food description. Return calories, macros, and a Food Quality Score (0–100) based on protein density, fiber, processing level, sugar load, and fat quality. Output valid JSON only.”

9. Why This Works Well

Same AI reasoning → consistent numbers

Zero extra UI friction

No post-processing needed on frontend

Scales well when you add meal-level or micronutrient scoring