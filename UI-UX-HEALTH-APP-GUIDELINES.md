# UI/UX Guidelines for Health & Weight Loss Applications

> A comprehensive design system and best practices guide for creating exceptional fitness, health tracking, and weight loss applications.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Psychology of Weight Loss Apps](#psychology-of-weight-loss-apps)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Data Visualization](#data-visualization)
6. [Component Patterns](#component-patterns)
7. [Progress & Feedback](#progress--feedback)
8. [Gamification & Motivation](#gamification--motivation)
9. [Onboarding & User Journeys](#onboarding--user-journeys)
10. [Mobile-First Considerations](#mobile-first-considerations)
11. [Accessibility](#accessibility)
12. [Anti-Patterns](#anti-patterns)
13. [Micro-Interactions](#micro-interactions)
14. [Content & Copy Guidelines](#content--copy-guidelines)
15. [Performance Considerations](#performance-considerations)
16. [Checklist](#pre-delivery-checklist)

---

## Design Philosophy

### Core Principles

#### 1. **Empowerment Over Shame**
- Never use guilt-based messaging or design
- Celebrate small wins, not just big milestones
- Frame setbacks as data points, not failures
- Use supportive language: "Let's get back on track" vs "You failed your goal"

#### 2. **Clarity Over Complexity**
- Users should understand their progress within 3 seconds of viewing
- One primary action per screen
- Progressive disclosure: show complexity only when needed
- Reduce cognitive load during meal/exercise logging

#### 3. **Consistency Breeds Habit**
- Consistent UI patterns reduce friction
- Same gestures for same actions across the app
- Predictable navigation and information architecture
- Muscle memory should guide users

#### 4. **Trust Through Transparency**
- Show calculation methods (how calories are estimated)
- Explain AI recommendations
- Be honest about data limitations
- Never hide unfavorable information

#### 5. **Sustainable Over Quick Results**
- Design for long-term engagement, not crash diets
- Highlight sustainable deficit ranges (300-500 kcal)
- Warn against extreme behaviors
- Encourage rest days and balanced nutrition

---

## Psychology of Weight Loss Apps

### Understanding User Mental States

| Mental State | Design Response |
|--------------|-----------------|
| **Motivated** (Day 1) | Capitalize with goal-setting, but set realistic expectations |
| **Overwhelmed** | Simplify interface, reduce options, show one clear action |
| **Discouraged** | Show non-scale victories, historical progress, encouraging messages |
| **Impatient** | Educate on healthy rates, show weekly trends over daily fluctuations |
| **Obsessive** | Limit check frequency, hide hourly details, encourage broader perspective |

### The Emotional Journey Framework

```
Day 1-7:    EXCITEMENT    → Design: Celebrate setup, first logs, baseline
Week 2-4:   REALITY       → Design: Show small wins, educate on plateaus
Month 2-3:  PLATEAU       → Design: Introduce new features, highlight NSV
Month 4+:   LIFESTYLE     → Design: Maintenance mode, long-term trends
```

### Behavioral Design Triggers

#### Variable Rewards
- Unexpected achievements ("You've logged 10 days in a row!")
- Random encouragement messages
- Surprise milestone badges

#### Completion Bias
- Show progress bars for daily targets
- Use streak counters
- Display completion percentages

#### Social Proof
- Community challenges
- Anonymous statistics ("Users like you lost X kg")
- Success stories

#### Loss Aversion
- "Don't break your streak!"
- Show potential loss of achievements
- Invested time visualization

---

## Color System

### Primary Palette (Weight Loss Focus)

| Role | Hex | HSL | Usage |
|------|-----|-----|-------|
| **Deficit/Success** | `#22C55E` | `142 71% 45%` | Caloric deficit, goals met, positive trends |
| **Surplus/Warning** | `#F97316` | `25 95% 53%` | Caloric surplus, attention needed |
| **Neutral** | `#71717A` | `240 4% 46%` | Inactive states, secondary info |
| **Background** | `#09090B` | `240 10% 4%` | Primary background |
| **Surface** | `#18181B` | `240 6% 10%` | Cards, elevated surfaces |
| **Text Primary** | `#FAFAFA` | `0 0% 98%` | Main content |
| **Text Secondary** | `#A1A1AA` | `240 5% 65%` | Supporting content |

### Semantic Color Usage

```css
/* Caloric States */
--color-deficit: #22C55E;       /* Burning more than consuming */
--color-surplus: #F97316;       /* Consuming more than burning */
--color-maintenance: #3B82F6;   /* Near TDEE (±100 kcal) */
--color-extreme: #EF4444;       /* Dangerous deficit or surplus */

/* Weight Trend States */
--color-losing: #22C55E;        /* Weight decreasing */
--color-gaining: #F97316;       /* Weight increasing (can be positive for some users) */
--color-stable: #3B82F6;        /* Weight stable */

/* Achievement States */
--color-bronze: #CD7F32;
--color-silver: #C0C0C0;
--color-gold: #FFD700;
--color-platinum: #E5E4E2;
```

### Color Psychology in Health Apps

| Color | Psychological Effect | Best Use Cases |
|-------|---------------------|----------------|
| **Green** | Safety, growth, health, "go" signal | Goals achieved, healthy ranges, progress |
| **Orange** | Energy, enthusiasm, attention | Warnings (not errors), exercise, motivation |
| **Blue** | Trust, calm, stability | Informational, water tracking, rest days |
| **Red** | Urgency, danger, stop | Errors only, extreme warnings, delete actions |
| **Purple** | Premium, wisdom, mystery | Premium features, insights, AI recommendations |
| **Yellow** | Optimism, caution, energy | Highlights, tips, approaching limits |

### Dark Mode Best Practices

```css
/* NEVER use pure black or pure white in dark mode */
--background: hsl(240 10% 4%);     /* NOT #000000 */
--text: hsl(0 0% 98%);             /* NOT #FFFFFF */

/* Use semi-transparent whites for elevation */
--surface-1: rgba(255, 255, 255, 0.02);
--surface-2: rgba(255, 255, 255, 0.04);
--surface-3: rgba(255, 255, 255, 0.06);

/* Borders should be subtle */
--border: rgba(255, 255, 255, 0.05);
```

---

## Typography

### Font Recommendations for Fitness Apps

#### Option 1: Athletic & Modern (Recommended)
- **Headings:** Barlow Condensed (500-700)
- **Body:** Barlow (400-500)
- **Numbers:** Barlow Condensed (for dashboard metrics)

#### Option 2: Clean & Minimal
- **Headings:** Inter (600-700)
- **Body:** Inter (400-500)
- **Numbers:** Tabular numbers enabled

#### Option 3: Premium & Sophisticated
- **Headings:** Outfit (600-700)
- **Body:** Work Sans (400-500)
- **Numbers:** Space Grotesk (for metrics)

### Typography Scale

```css
/* Mobile Scale */
--text-xs: 0.625rem;    /* 10px - Labels, metadata */
--text-sm: 0.6875rem;   /* 11px - Secondary info */
--text-base: 0.875rem;  /* 14px - Body text */
--text-lg: 1rem;        /* 16px - Emphasized body */
--text-xl: 1.25rem;     /* 20px - Section headers */
--text-2xl: 1.5rem;     /* 24px - Card titles */
--text-3xl: 2rem;       /* 32px - Dashboard metrics */
--text-4xl: 2.5rem;     /* 40px - Hero numbers */

/* Desktop Scale - Use calc() for fluid typography */
--text-hero: clamp(2.5rem, 5vw, 4rem);
```

### Number Display Guidelines

| Context | Style | Example |
|---------|-------|---------|
| **Primary Metric** | Bold, 2xl-4xl, high contrast | `2,450 kcal` |
| **Secondary Metric** | Medium, lg-xl, muted | `Target: 2,200` |
| **Delta/Change** | Bold, colored, with sign | `+250` or `-350` |
| **Percentage** | Tabular, followed by % | `78%` |
| **Weight** | 1 decimal, unit separated | `73.5 kg` |
| **Time** | 12h or 24h based on locale | `2:30 PM` |

### Metric Unit Styling

```tsx
// CORRECT: Units are smaller, muted, and separated
<span className="text-2xl font-bold text-white">2,450</span>
<span className="text-xs font-medium text-zinc-500 ml-1 uppercase tracking-widest">kcal</span>

// INCORRECT: Same size, same weight
<span className="text-2xl font-bold">2,450 kcal</span>
```

---

## Data Visualization

### Chart Type Selection

| Data Type | Recommended Chart | Avoid |
|-----------|------------------|-------|
| Weight over time | Line chart with area fill | Bar chart (implies discrete) |
| Calories by day | Horizontal bar or lollipop | Pie chart |
| Macro breakdown | Donut or stacked bar | 3D pie, radar |
| Progress to goal | Progress ring or gauge | Thermometer |
| Weekly comparison | Grouped bar | Line (implies continuity) |
| Calorie deficit trend | Sparkline with fill | Complex multi-axis |

### Progress Rings (Apple Watch Style)

```tsx
// Anatomy of an effective progress ring
interface ProgressRingProps {
  value: number;              // Current value
  target: number;             // Target value
  size: number;               // Ring diameter (60-120px typical)
  strokeWidth: number;        // Ring thickness (4-8px typical)
  colorPositive: string;      // Under target (green)
  colorNegative: string;      // Over target (orange)
  showCenter: boolean;        // Display value in center
}

// Best practices:
// - Start at 12 o'clock (-90deg rotation)
// - Animate on mount (1s ease-out)
// - Cap at 100% visually, show overflow numerically
// - Use square line caps for modern look
```

### Weight Charts Best Practices

1. **Smooth the data**: Use 7-day moving average alongside raw points
2. **Show target zone**: Highlight the goal weight range as a band
3. **Indicate trend**: Add a trend line or arrow showing direction
4. **Handle outliers**: Don't auto-scale to extreme outliers
5. **Time granularity**: Default to 30 days, allow 7/90/365 options

```tsx
// Weight chart configuration
const weightChartConfig = {
  showRawPoints: true,
  showMovingAverage: true,
  movingAverageWindow: 7,
  targetZoneOpacity: 0.1,
  gridLines: 'horizontal-only',
  yAxisPadding: '10%',  // Don't crop to data min/max
  animations: {
    duration: 750,
    easing: 'easeOutQuart'
  }
};
```

### Calorie Visualization

#### Daily Balance Display

```
┌─────────────────────────────────────────────────────┐
│  CONSUMED                    │        REMAINING     │
│  █████████████████████████   │  ░░░░░░░░░░░░░░░░   │
│  1,650 kcal                  │      550 kcal        │
│──────────────────────────────┴──────────────────────│
│  ↳ TDEE Target: 2,200 kcal                          │
└─────────────────────────────────────────────────────┘
```

#### Net Calories Indicator

```tsx
// Show deficit as positive outcome (green, down arrow)
// Show surplus as attention (orange, up arrow)
const NetCaloriesDisplay = ({ net }: { net: number }) => {
  const isDeficit = net < 0;
  return (
    <div className={isDeficit ? "text-green-500" : "text-orange-500"}>
      {isDeficit ? <TrendingDown /> : <TrendingUp />}
      {isDeficit ? "" : "+"}{net} kcal
    </div>
  );
};
```

### Calendar Heatmaps

Use GitHub-style contribution graphs for:
- Exercise consistency
- Logging streaks
- Weight entry compliance
- Water intake

```css
/* Heatmap intensity scale (5 levels) */
--heatmap-0: rgba(255, 255, 255, 0.02);  /* No activity */
--heatmap-1: rgba(34, 197, 94, 0.2);     /* Minimal */
--heatmap-2: rgba(34, 197, 94, 0.4);     /* Light */
--heatmap-3: rgba(34, 197, 94, 0.6);     /* Moderate */
--heatmap-4: rgba(34, 197, 94, 0.8);     /* Heavy */
```

---

## Component Patterns

### Metric Cards (Dashboard Widgets)

```tsx
// Anatomy of an effective metric card
<Card className="glass-card h-[180px]">
  <CardHeader className="pb-2">
    {/* Label: Tiny, uppercase, muted, tracking-widest */}
    <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
      Current Weight
    </CardTitle>
    {/* Icon: Small, muted, contextual */}
    <Scale className="h-3.5 w-3.5 text-zinc-600" />
  </CardHeader>
  <CardContent>
    {/* Primary metric: Large, bold, high contrast */}
    <div className="text-2xl font-bold text-white">73.5</div>
    <div className="text-[10px] uppercase tracking-widest text-zinc-500">kg</div>
    
    {/* Secondary info: Smaller, grid layout, muted labels */}
    <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
      <div className="flex flex-col">
        <span className="text-zinc-500 uppercase tracking-tight">Target</span>
        <span className="text-zinc-300">70.0 kg</span>
      </div>
      <div className="flex flex-col">
        <span className="text-zinc-500 uppercase tracking-tight">To Goal</span>
        <span className="text-orange-500">-3.5 kg</span>
      </div>
    </div>
  </CardContent>
</Card>
```

### Quick Entry Forms

For high-frequency actions (meal logging, weight entry):

```tsx
// Best practices for quick entry
interface QuickEntryProps {
  autoFocus: boolean;           // Auto-focus primary input
  numericKeyboard: boolean;     // Show number pad on mobile
  smartDefaults: boolean;       // Pre-fill common values
  recentSuggestions: boolean;   // Show recent entries
  voiceInput?: boolean;         // Voice command support
  hapticFeedback: boolean;      // Vibrate on submit (mobile)
}

// Design principles:
// 1. Minimize taps to complete entry (3 taps maximum)
// 2. Large touch targets (48x48px minimum)
// 3. Inline validation (no modals for errors)
// 4. Success confirmation with auto-dismiss
// 5. Undo option for recent entries
```

### Food Entry Patterns

```tsx
// Quick add vs detailed entry
<Tabs defaultValue="quick">
  <TabsList>
    <TabsTrigger value="quick">Quick Add</TabsTrigger>
    <TabsTrigger value="detailed">Detailed</TabsTrigger>
    <TabsTrigger value="scan">Scan</TabsTrigger>
  </TabsList>
  
  <TabsContent value="quick">
    {/* Quick: Just name + calories */}
    <Input placeholder="What did you eat?" />
    <Input type="number" placeholder="Calories" />
  </TabsContent>
  
  <TabsContent value="detailed">
    {/* Detailed: Full macro breakdown */}
    {/* Protein, carbs, fats, fiber, etc. */}
  </TabsContent>
  
  <TabsContent value="scan">
    {/* Barcode scanner or AI photo analysis */}
  </TabsContent>
</Tabs>
```

### Glass Card Pattern

```css
.glass-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);
}

/* Elevated variant for interactive cards */
.glass-card-elevated {
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* Hover state */
.glass-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  transition: all 200ms ease;
}
```

### Navigation Patterns

#### Bottom Navigation (Mobile)
- 5 items maximum
- Primary action (logging) in center as FAB
- Use filled icons for active state
- Show badge dots for notifications

```tsx
// Mobile bottom nav structure
<nav className="fixed bottom-0 inset-x-0 bg-zinc-900/95 backdrop-blur border-t border-white/5">
  <div className="flex justify-around items-center h-16">
    <NavItem icon={Home} label="Home" />
    <NavItem icon={Activity} label="Exercise" />
    <FAB icon={Plus} label="Log" primary />  {/* Center FAB */}
    <NavItem icon={UtensilsCrossed} label="Food" />
    <NavItem icon={User} label="Profile" />
  </div>
</nav>
```

#### Sidebar Navigation (Desktop)
- Collapsible with icon-only mode
- Group related items with dividers
- Show current page indicator
- Quick access to logging at top

---

## Progress & Feedback

### Progress Indicators

#### Linear Progress

```tsx
// Calorie consumption bar
<div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
  <div 
    className={cn(
      "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
      progress > 100 ? "bg-orange-500" : "bg-green-500"
    )}
    style={{ width: `${Math.min(progress, 100)}%` }}
  />
  {progress > 100 && (
    <div 
      className="absolute inset-y-0 left-0 bg-orange-500/30 animate-pulse"
      style={{ width: '100%' }}
    />
  )}
</div>
```

#### Goal Achievement States

| State | Visual Treatment |
|-------|-----------------|
| Not started | Gray outline, 0% fill |
| In progress | Colored fill proportional to progress |
| Almost there (>90%) | Pulsing animation, encouraging copy |
| Achieved | Full fill, checkmark, celebration |
| Exceeded | 100% fill + glow effect, "bonus" indicator |

### Loading States

```tsx
// Skeleton patterns for health data
<div className="space-y-4">
  {/* Metric card skeleton */}
  <div className="h-[180px] bg-white/5 rounded-lg animate-pulse" />
  
  {/* Chart skeleton */}
  <div className="h-[200px] bg-white/5 rounded-lg animate-pulse">
    <div className="flex items-end justify-around h-full p-4 gap-2">
      {[40, 60, 80, 45, 70, 55, 90].map((h, i) => (
        <div 
          key={i} 
          className="bg-white/10 rounded-t w-8"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  </div>
  
  {/* List skeleton */}
  <div className="space-y-2">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
    ))}
  </div>
</div>
```

### Empty States

```tsx
// Empty state with action
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
    <Scale className="w-8 h-8 text-zinc-600" />
  </div>
  <h3 className="text-lg font-semibold text-zinc-300 mb-2">
    No weight entries yet
  </h3>
  <p className="text-sm text-zinc-500 mb-6 max-w-xs">
    Start tracking your weight to see your progress over time
  </p>
  <Button>
    <Plus className="w-4 h-4 mr-2" />
    Add First Entry
  </Button>
</div>
```

### Success Feedback

```tsx
// Toast notification for successful entry
<Toast variant="success">
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
      <Check className="w-4 h-4 text-green-500" />
    </div>
    <div>
      <p className="font-medium">Entry saved!</p>
      <p className="text-sm text-zinc-400">+420 kcal logged</p>
    </div>
    <Button variant="ghost" size="sm">Undo</Button>
  </div>
</Toast>
```

---

## Gamification & Motivation

### Achievement System

#### Badge Categories

| Category | Examples | Unlock Criteria |
|----------|----------|-----------------|
| **Consistency** | Logger, Streak Master, Iron Will | X days of logging |
| **Milestones** | First Kilo, 5% Down, Halfway There | Weight loss milestones |
| **Activity** | Early Bird, Night Owl, Cardio King | Exercise patterns |
| **Nutrition** | Protein Pro, Hydration Hero | Macro targets hit |
| **Social** | Motivator, Team Player | Community engagement |

#### Badge Visual Design

```tsx
// Badge component structure
<div className="relative">
  <div className={cn(
    "w-16 h-16 rounded-full flex items-center justify-center",
    unlocked ? "bg-gradient-to-br from-gold-400 to-gold-600" : "bg-zinc-800"
  )}>
    <Icon className={cn(
      "w-8 h-8",
      unlocked ? "text-white" : "text-zinc-600"
    )} />
  </div>
  {/* Locked overlay */}
  {!unlocked && (
    <div className="absolute inset-0 flex items-center justify-center">
      <Lock className="w-4 h-4 text-zinc-500" />
    </div>
  )}
  {/* Progress ring for partial completion */}
  {!unlocked && progress > 0 && (
    <svg className="absolute inset-0 -rotate-90">
      <circle 
        cx="32" cy="32" r="30" 
        fill="none" 
        stroke="rgba(249, 115, 22, 0.5)"
        strokeWidth="4"
        strokeDasharray={`${progress * 1.88} 188`}
      />
    </svg>
  )}
</div>
```

### Streak System

```tsx
// Streak display component
<Card className="glass-card">
  <CardContent className="flex items-center gap-4 py-4">
    <div className="flex items-center gap-1">
      <Flame className={cn(
        "w-6 h-6",
        streak >= 7 ? "text-orange-500 animate-pulse" : "text-zinc-600"
      )} />
      <span className="text-2xl font-bold text-white">{streak}</span>
    </div>
    <div>
      <div className="text-sm font-medium text-white">Day Streak</div>
      <div className="text-xs text-zinc-500">
        {streak >= 7 ? "You're on fire! 🔥" : `${7 - streak} more to weekly badge`}
      </div>
    </div>
    {/* Mini calendar showing streak */}
    <div className="flex gap-1 ml-auto">
      {[...Array(7)].map((_, i) => (
        <div 
          key={i}
          className={cn(
            "w-3 h-3 rounded-sm",
            i < streak % 7 ? "bg-green-500" : "bg-zinc-800"
          )}
        />
      ))}
    </div>
  </CardContent>
</Card>
```

### Motivational Messages

#### Context-Aware Encouragement

```typescript
const getMotivationalMessage = (context: UserContext): string => {
  const messages = {
    // First thing in morning
    morning_no_entry: "Good morning! Ready to crush it today?",
    
    // After logging
    logged_deficit: "Great choice! You're building a healthier you.",
    logged_surplus: "No worries, one meal doesn't define your journey.",
    
    // Streak milestones
    streak_3: "Three days strong! Habits are forming.",
    streak_7: "A full week! You're officially in a rhythm.",
    streak_30: "Thirty days of dedication. You're unstoppable.",
    
    // Weight milestones
    first_kg: "First kilo down! The journey of 1000 miles...",
    percent_5: "5% of your goal achieved. Your clothes will notice soon.",
    halfway: "You're halfway there! The view is getting better.",
    
    // Plateau detection
    plateau: "Weight stable? That's normal. Focus on how you feel.",
    
    // After break
    returning: "Welcome back! Let's pick up where we left off.",
  };
  
  return messages[context.type] || "Every step counts.";
};
```

### Weekly Challenges

```tsx
// Challenge card structure
<Card className="glass-card border-l-4 border-l-orange-500">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className="text-sm font-medium">
        Weekly Challenge
      </CardTitle>
      <span className="text-xs text-zinc-500">Ends in 3 days</span>
    </div>
  </CardHeader>
  <CardContent>
    <h3 className="text-lg font-semibold text-white mb-2">
      Protein Week
    </h3>
    <p className="text-sm text-zinc-400 mb-4">
      Hit 100g protein for 5 days this week
    </p>
    <div className="flex items-center gap-2 mb-2">
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-orange-500 w-3/5" />
      </div>
      <span className="text-sm font-medium text-orange-500">3/5</span>
    </div>
    <p className="text-xs text-zinc-500">
      Reward: Protein Pro badge + 50 points
    </p>
  </CardContent>
</Card>
```

---

## Onboarding & User Journeys

### First-Time User Flow

```
1. WELCOME
   "Your weight loss journey starts here"
   → Single CTA: Get Started

2. GOAL SETTING
   "What's your target weight?"
   → Slider or input (with healthy range validation)
   → Show estimated timeline

3. BASELINE DATA
   "Tell us about yourself"
   → Height, current weight, age, sex
   → Activity level selection

4. DAILY CALORIE TARGET
   "Your daily calorie target"
   → Show TDEE calculation
   → Explain deficit options (moderate/aggressive)

5. FEATURE INTRO (Optional carousel)
   "Here's what you can do"
   → Quick feature highlights (3 max)

6. FIRST ACTION
   "Let's start with today's weight"
   → Immediate first entry
   → Celebrate first data point
```

### Progressive Onboarding

Introduce features over time, not all at once:

| Day | Feature Introduction |
|-----|---------------------|
| 1 | Weight tracking, calorie logging basics |
| 3 | Macros breakdown (if they've logged 5+ items) |
| 7 | Weekly report, streak badge |
| 14 | Exercise logging, TDEE adjustment |
| 21 | Insights, AI recommendations |
| 30 | Community features, challenges |

### Tooltip System

```tsx
// First-time tooltip for new features
<TooltipProvider>
  <Tooltip open={isFirstView}>
    <TooltipTrigger asChild>
      <Button onClick={handleAction}>
        <Plus className="w-4 h-4 mr-2" />
        Add Exercise
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="max-w-xs">
      <p className="font-medium mb-1">Track your workouts</p>
      <p className="text-sm text-zinc-400">
        Log exercises to see calories burned and adjust your daily target.
      </p>
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={dismissTooltip}
        className="mt-2"
      >
        Got it
      </Button>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## Mobile-First Considerations

### Touch Target Guidelines

```css
/* Minimum touch targets */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}

/* Comfortable touch targets (recommended) */
.touch-target-comfortable {
  min-width: 48px;
  min-height: 48px;
}

/* Spacing between adjacent targets */
.touch-target + .touch-target {
  margin-left: 8px;
}
```

### Thumb Zone Optimization

```
┌─────────────────────────────────┐
│                                 │  ← Hard to reach
│                                 │
│─────────────────────────────────│
│                                 │
│         Natural zone            │  ← Primary actions
│                                 │
│─────────────────────────────────│
│    █████ Easy zone █████        │  ← Critical actions
│    ████████████████████         │     (logging, navigation)
└─────────────────────────────────┘
```

Place high-frequency actions in the lower third:
- Bottom navigation
- FAB for quick logging
- Swipe actions on list items

### Input Optimization

```tsx
// Numeric input with proper mobile keyboard
<input
  type="number"
  inputMode="decimal"        // Shows decimal keyboard
  pattern="[0-9]*\.?[0-9]*"  // iOS decimal pattern
  enterKeyHint="done"        // Shows "Done" button
  autoComplete="off"         // Prevent autofill
  className="text-lg"        // Larger text for readability
/>

// Weight input specifically
<input
  type="number"
  inputMode="decimal"
  step="0.1"
  min="30"
  max="300"
  placeholder="73.5"
/>
```

### Swipe Gestures

```tsx
// List item with swipe actions
<SwipeableListItem
  swipeRightAction={{
    icon: <Pencil />,
    label: "Edit",
    color: "bg-blue-500",
    onSwipe: () => handleEdit()
  }}
  swipeLeftAction={{
    icon: <Trash2 />,
    label: "Delete",
    color: "bg-red-500",
    onSwipe: () => handleDelete()
  }}
>
  <FoodEntryItem entry={entry} />
</SwipeableListItem>
```

### Responsive Breakpoints

```css
/* Mobile first approach */
.card-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

/* Tablet (640px+) */
@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large desktop (1280px+) */
@media (min-width: 1280px) {
  .card-grid {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Mobile-Specific UI Patterns

```tsx
// Hide complex visualizations on mobile
<Card className="hidden sm:block">
  <WeightChart weights={weights} />
</Card>

// Show simplified mobile alternative
<Card className="sm:hidden">
  <WeightSparkline weights={weights.slice(-7)} />
</Card>

// Simplified stats for mobile
<div className="grid grid-cols-2 gap-2 sm:hidden">
  <MiniStatCard label="This Week" value="-0.5 kg" />
  <MiniStatCard label="Streak" value="7 days" />
</div>
```

---

## Accessibility

### Color & Contrast

```css
/* Minimum contrast ratios */
/* WCAG AA: 4.5:1 for normal text, 3:1 for large text */

/* Good: High contrast text on dark bg */
.text-primary { color: #FAFAFA; }    /* 15.8:1 on #09090B */
.text-secondary { color: #A1A1AA; }  /* 4.6:1 on #09090B */

/* Good: Colored text with sufficient contrast */
.text-success { color: #4ADE80; }    /* 8.2:1 on #09090B */
.text-warning { color: #FB923C; }    /* 5.8:1 on #09090B */

/* Never rely on color alone */
/* Always pair with: icon, text label, or pattern */
.deficit-indicator {
  color: var(--color-success);
  &::before {
    content: "↓";  /* Icon indicator */
  }
}
```

### Screen Reader Support

```tsx
// Proper labeling for metrics
<div 
  role="status" 
  aria-label={`Current weight: ${weight} kilograms, ${distance} kilograms from goal`}
>
  <span aria-hidden="true" className="text-2xl font-bold">
    {weight}
  </span>
  <span aria-hidden="true" className="text-xs text-zinc-500">
    kg
  </span>
</div>

// Progress announcement
<div 
  role="progressbar" 
  aria-valuenow={consumed}
  aria-valuemin={0}
  aria-valuemax={target}
  aria-label={`${consumed} of ${target} calories consumed today`}
>
  {/* Visual progress bar */}
</div>

// Status changes
<div 
  role="alert" 
  aria-live="polite"
>
  {achievementUnlocked && "Achievement unlocked: First Kilo Down!"}
</div>
```

### Keyboard Navigation

```tsx
// Ensure all interactive elements are focusable
<Card 
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  className="focus:ring-2 focus:ring-primary focus:outline-none"
>
  {/* Card content */}
</Card>

// Skip links for quick navigation
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2"
>
  Skip to main content
</a>
```

### Motion Preferences

```css
/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  /* Keep functional animations minimal */
  .progress-ring {
    transition: stroke-dashoffset 0.01ms;
  }
}
```

### Focus Management

```tsx
// Focus trap for modals
const FoodEntryModal = ({ open, onClose }) => {
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (open) {
      firstInputRef.current?.focus();
    }
  }, [open]);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <Input ref={firstInputRef} placeholder="Food name" />
        {/* ... */}
      </DialogContent>
    </Dialog>
  );
};
```

---

## Anti-Patterns

### Never Do These

#### 1. Shame-Based Design
```tsx
// ❌ NEVER
<Alert variant="destructive">
  You exceeded your calories by 500! You ruined your progress.
</Alert>

// ✅ INSTEAD
<Alert variant="info">
  You're 500 over today. Tomorrow is a fresh start—focus on protein!
</Alert>
```

#### 2. Obsession-Enabling Features
```tsx
// ❌ NEVER: Hourly weight checks
<Button onClick={checkWeightAgain}>
  Check Weight Again
</Button>

// ✅ INSTEAD: Daily limit with explanation
<Button disabled={alreadyLoggedToday}>
  {alreadyLoggedToday 
    ? "Weight logged today—check back tomorrow" 
    : "Log Today's Weight"}
</Button>
```

#### 3. Extreme Goal Validation
```tsx
// ❌ NEVER: Allow dangerous deficits
const dailyTarget = tdee - 1500; // 1500 deficit is dangerous

// ✅ INSTEAD: Cap and warn
const maxDeficit = 750;
const dailyTarget = Math.max(tdee - maxDeficit, 1200); // Never below 1200
if (requestedDeficit > maxDeficit) {
  showWarning("A deficit over 750 kcal isn't sustainable long-term.");
}
```

#### 4. Hidden Negative Data
```tsx
// ❌ NEVER: Hide surplus days from history
const filteredData = data.filter(d => d.deficit >= 0);

// ✅ INSTEAD: Show all data honestly
const allData = data; // Show surplus and deficit days equally
```

#### 5. Punishing Missed Days
```tsx
// ❌ NEVER: Aggressive streak loss
if (!loggedToday) {
  streak = 0;
  showMessage("Your 30-day streak is GONE!");
}

// ✅ INSTEAD: Graceful degradation
if (!loggedToday) {
  streakFreezes -= 1;
  if (streakFreezes > 0) {
    showMessage("Streak saved! 1 freeze used. You have 1 left this week.");
  } else {
    streak = 0;
    showMessage("Streak reset, but your progress isn't lost. Let's start fresh!");
  }
}
```

#### 6. Deceptive Progress Visualization
```tsx
// ❌ NEVER: Make 5% look like 50%
<ProgressBar value={5} visualMin={50} /> // Misleading

// ✅ INSTEAD: Honest representation
<ProgressBar value={5} />
<span>5% complete—great start!</span>
```

### UI/UX Red Flags

| Anti-Pattern | Why It's Bad | Better Alternative |
|--------------|--------------|-------------------|
| Red color for weight gain | Creates anxiety | Use neutral orange, explain context |
| Hiding the "skip" option | Feels manipulative | Prominent skip with gentle copy |
| Push notifications for missed logging | Feels like nagging | Digest-style daily summary |
| Comparing to other users | Triggers unhealthy comparison | Compare to past self only |
| "Are you sure?" for every action | Friction without value | Undo instead of confirm |
| Auto-playing sounds | Startling, annoying | Optional, off by default |
| Daily weigh-in reminders | Encourages obsession | Weekly trends, optional reminders |

---

## Micro-Interactions

### Button States

```css
.btn-primary {
  /* Default state */
  background: var(--color-success);
  color: white;
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 150ms ease;
  
  /* Hover */
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  /* Active/pressed */
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  /* Disabled */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Loading */
  &.loading {
    color: transparent;
    pointer-events: none;
    
    &::after {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid white;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Number Counting Animation

```tsx
// Animated number display for metrics
const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const start = displayValue;
    const end = value;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      
      setDisplayValue(Math.round(current));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);
  
  return <span>{displayValue.toLocaleString()}</span>;
};
```

### Progress Ring Animation

```css
.progress-ring-circle {
  /* Initial state: no fill */
  stroke-dashoffset: var(--circumference);
  
  /* Animate on mount */
  animation: progress-fill 1s ease-out forwards;
  animation-delay: 0.3s;
}

@keyframes progress-fill {
  to {
    stroke-dashoffset: var(--target-offset);
  }
}

/* Pulse when goal achieved */
.progress-ring-circle.complete {
  animation: 
    progress-fill 1s ease-out forwards,
    pulse-glow 2s ease-in-out infinite 1s;
}

@keyframes pulse-glow {
  0%, 100% { filter: drop-shadow(0 0 4px var(--color-success)); }
  50% { filter: drop-shadow(0 0 12px var(--color-success)); }
}
```

### Haptic Feedback Patterns

```typescript
// iOS/Android haptic feedback
const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'warning' | 'error') => {
  if (!navigator.vibrate) return;
  
  const patterns = {
    light: [10],
    medium: [20],
    success: [10, 50, 10],  // Double tap
    warning: [30, 50, 30],
    error: [50, 100, 50, 100, 50]
  };
  
  navigator.vibrate(patterns[type]);
};

// Usage
const handleLogEntry = async () => {
  await saveEntry();
  triggerHaptic('success');
};
```

### Card Expansion Animation

```css
.expandable-card {
  display: grid;
  grid-template-rows: auto 0fr;
  transition: grid-template-rows 300ms ease;
}

.expandable-card.expanded {
  grid-template-rows: auto 1fr;
}

.expandable-card-content {
  overflow: hidden;
}
```

---

## Content & Copy Guidelines

### Voice & Tone

| Context | Tone | Example |
|---------|------|---------|
| Success | Celebratory, brief | "Logged! You're 78% to your goal." |
| Warning | Supportive, informative | "Heads up: You're close to your limit." |
| Error | Calm, solution-focused | "Couldn't save. Check your connection." |
| Motivation | Encouraging, specific | "3 days straight! Consistency is key." |
| Education | Simple, actionable | "Protein helps preserve muscle during weight loss." |

### Number Formatting

```typescript
// Calories: No decimals, with comma separator
formatCalories(2450) // "2,450 kcal"

// Weight: One decimal, unit separated
formatWeight(73.5) // "73.5 kg"

// Percentage: No decimals for rough, one for precise
formatPercent(0.783) // "78%" or "78.3%"

// Time: Locale-aware
formatTime(new Date()) // "2:30 PM" or "14:30"

// Relative time: Natural language
formatRelative(yesterday) // "Yesterday"
formatRelative(lastWeek) // "7 days ago"
formatRelative(lastMonth) // "Mar 15"
```

### Microcopy Examples

| Context | Copy |
|---------|------|
| Empty food list | "No meals logged yet. What did you eat today?" |
| First weight entry | "Your starting point. Every journey begins here." |
| Streak broken | "Streak reset, but you haven't lost progress. Ready to start again?" |
| Goal achieved | "You did it! 🎉 Time to set a new target?" |
| Plateau detected | "Weight stable this week. That's normal—trust the process." |
| Deficit warning | "Your intake is quite low today. Listen to your body." |

### Error Messages

```typescript
const errorMessages = {
  // Network errors
  NETWORK_ERROR: "Couldn't connect. Your data is saved locally.",
  SYNC_FAILED: "Sync paused. We'll retry automatically.",
  
  // Validation errors
  WEIGHT_OUT_OF_RANGE: "Please enter a weight between 30-300 kg.",
  CALORIES_TOO_HIGH: "That seems high. Double-check the amount?",
  DATE_IN_FUTURE: "Can't log future entries. Adjust the date.",
  
  // Auth errors
  SESSION_EXPIRED: "Session expired. Please sign in again.",
  
  // Generic
  UNKNOWN: "Something went wrong. Please try again.",
};
```

---

## Performance Considerations

### Optimistic Updates

```tsx
// Update UI immediately, sync in background
const handleLogFood = async (food: FoodEntry) => {
  // 1. Optimistically update UI
  setFoodEntries(prev => [...prev, { ...food, id: 'temp', pending: true }]);
  
  // 2. Update totals immediately
  setTodayCalories(prev => prev + food.calories);
  
  // 3. Sync to server
  try {
    const saved = await api.createFoodEntry(food);
    setFoodEntries(prev => 
      prev.map(e => e.id === 'temp' ? saved : e)
    );
  } catch (error) {
    // 4. Rollback on failure
    setFoodEntries(prev => prev.filter(e => e.id !== 'temp'));
    setTodayCalories(prev => prev - food.calories);
    showError("Couldn't save. Please try again.");
  }
};
```

### Data Fetching Patterns

```tsx
// Parallel data fetching for dashboard
export async function getDashboardData(userId: string) {
  const [
    latestWeight,
    todayFood,
    todayExercise,
    weeklyStats,
    streak
  ] = await Promise.all([
    getLatestWeight(userId),
    getTodayFood(userId),
    getTodayExercise(userId),
    getWeeklyStats(userId),
    getStreak(userId)
  ]);
  
  return { latestWeight, todayFood, todayExercise, weeklyStats, streak };
}
```

### Image Optimization

```tsx
// Food photos should be compressed
const FOOD_PHOTO_CONFIG = {
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.8,
  format: 'webp'
};

// Use blur placeholder for charts
<Image
  src={chartImage}
  placeholder="blur"
  blurDataURL={chartBlurHash}
  loading="lazy"
/>
```

### Skeleton Loading Priority

```tsx
// Load in priority order
// 1. Today's summary (above fold)
// 2. Quick action buttons
// 3. Recent entries
// 4. Charts and visualizations
// 5. Historical data

const DashboardSkeleton = () => (
  <>
    {/* Priority 1: Today's summary - show immediately */}
    <TodaySummarySkeleton />
    
    {/* Priority 2: Quick actions */}
    <QuickActionsSkeleton />
    
    {/* Priority 3-5: Can show loading state */}
    <div className="animate-pulse bg-white/5 h-64 rounded-lg" />
  </>
);
```

---

## Pre-Delivery Checklist

Before shipping any UI/UX for a health app, verify:

### Visual Design
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] No color-only information (always pair with icon/text)
- [ ] Consistent icon set (Lucide/Heroicons)
- [ ] No emojis as functional icons
- [ ] Glass/card effects render on all browsers

### Interaction Design
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states with 150-300ms transitions
- [ ] Focus states visible for keyboard navigation
- [ ] Touch targets minimum 44x44px
- [ ] No layout-shifting hover effects

### Data Display
- [ ] Numbers formatted consistently (commas, decimals)
- [ ] Units styled smaller than values
- [ ] Loading states for all async data
- [ ] Empty states with clear CTAs
- [ ] Error states are helpful, not scary

### Accessibility
- [ ] Screen reader labels for all metrics
- [ ] `aria-live` for dynamic updates
- [ ] Skip navigation links
- [ ] `prefers-reduced-motion` respected
- [ ] Form inputs have visible labels

### Responsive
- [ ] Mobile: 375px minimum
- [ ] Tablet: 768px breakpoint
- [ ] Desktop: 1024px breakpoint
- [ ] Large: 1440px max-width
- [ ] No horizontal scroll on any viewport

### Psychology & Ethics
- [ ] No shame-based messaging
- [ ] Extreme deficits warned against
- [ ] Setbacks framed constructively
- [ ] No obsession-enabling features
- [ ] Honest data representation

### Performance
- [ ] Optimistic updates for logging
- [ ] Skeleton loaders for async content
- [ ] Images optimized and lazy-loaded
- [ ] No layout shift on data load
- [ ] Smooth 60fps animations

---

## Quick Reference Card

### Color Semantics
| State | Color | Hex |
|-------|-------|-----|
| Deficit/Good | Green | `#22C55E` |
| Surplus/Attention | Orange | `#F97316` |
| Neutral | Zinc | `#71717A` |
| Danger | Red | `#EF4444` |
| Info | Blue | `#3B82F6` |

### Typography Quick Guide
| Element | Size | Weight | Case |
|---------|------|--------|------|
| Card label | 10px | Medium | UPPERCASE |
| Metric value | 24-32px | Bold | Normal |
| Metric unit | 10px | Medium | UPPERCASE |
| Body text | 14px | Regular | Normal |
| Secondary | 11-12px | Medium | Normal |

### Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Inline gaps |
| sm | 8px | Icon gaps |
| md | 16px | Card padding |
| lg | 24px | Section gaps |
| xl | 32px | Major sections |

### Animation Timing
| Type | Duration | Easing |
|------|----------|--------|
| Micro (hover) | 150ms | ease |
| Standard | 200ms | ease |
| Emphasis | 300ms | ease-out |
| Progress | 750ms | ease-out |
| Page transition | 200ms | ease-in-out |

---

*Document Version: 1.0*
*Last Updated: February 2026*
*Author: Fit Companion Design Team*
