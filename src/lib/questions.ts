import type { Question } from './types'

let _qid = 0
function qid(): string {
  return `q-${Date.now()}-${_qid++}`
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function mcq(prompt: string, answer: string, distractors: string[], hint?: string): Question {
  return {
    id: qid(),
    type: 'multiple-choice',
    prompt,
    options: shuffle([answer, ...distractors]),
    answer,
    hint,
  }
}

function typein(prompt: string, answer: string, hint?: string): Question {
  return { id: qid(), type: 'type-in', prompt, answer, hint }
}

function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) { [a, b] = [b, a % b] }
  return a
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b)
}

// ─── 1. MULTIPLICATION ────────────────────────────────────────
function genMultiplication(): Question[] {
  const qs: Question[] = []
  // Two-digit × one-digit
  for (let i = 0; i < 6; i++) {
    const a = rand(12, 99)
    const b = rand(3, 9)
    const answer = a * b
    qs.push(mcq(
      `What is ${a} × ${b}?`,
      `${answer}`,
      [`${answer + b}`, `${answer - b}`, `${answer + 10}`],
      `Break it up: ${a} × ${b} = (${Math.floor(a / 10) * 10} × ${b}) + (${a % 10} × ${b})`
    ))
  }
  // Two-digit × two-digit
  for (let i = 0; i < 4; i++) {
    const a = rand(11, 25)
    const b = rand(11, 25)
    const answer = a * b
    qs.push(typein(
      `What is ${a} × ${b}?`,
      `${answer}`,
      `Try breaking it into parts!`
    ))
  }
  // Word problems
  qs.push(mcq(
    'A box has 24 crayons. How many crayons are in 8 boxes?',
    '192',
    ['182', '196', '176'],
    '24 × 8 = 192'
  ))
  qs.push(mcq(
    'There are 15 rows with 12 chairs each. How many chairs total?',
    '180',
    ['170', '190', '160'],
    '15 × 12 = 180'
  ))
  return shuffle(qs)
}

// ─── 2. LONG DIVISION ─────────────────────────────────────────
function genDivision(): Question[] {
  const qs: Question[] = []
  // Clean division
  for (let i = 0; i < 5; i++) {
    const divisor = rand(3, 12)
    const quotient = rand(5, 25)
    const dividend = divisor * quotient
    qs.push(mcq(
      `What is ${dividend} ÷ ${divisor}?`,
      `${quotient}`,
      [`${quotient + 1}`, `${quotient - 1}`, `${quotient + 3}`],
      `Think: what times ${divisor} equals ${dividend}?`
    ))
  }
  // Division with remainders
  for (let i = 0; i < 4; i++) {
    const divisor = rand(3, 9)
    const quotient = rand(5, 20)
    const remainder = rand(1, divisor - 1)
    const dividend = divisor * quotient + remainder
    qs.push(mcq(
      `What is ${dividend} ÷ ${divisor}? (Write as quotient R remainder)`,
      `${quotient} R ${remainder}`,
      [`${quotient + 1} R ${remainder}`, `${quotient} R ${remainder + 1}`, `${quotient - 1} R ${divisor - remainder}`],
      `${divisor} × ${quotient} = ${divisor * quotient}, remainder = ${dividend} - ${divisor * quotient} = ${remainder}`
    ))
  }
  // Type-in
  for (let i = 0; i < 3; i++) {
    const divisor = rand(4, 8)
    const quotient = rand(10, 30)
    const dividend = divisor * quotient
    qs.push(typein(
      `${dividend} ÷ ${divisor} = ?`,
      `${quotient}`,
      `What times ${divisor} equals ${dividend}?`
    ))
  }
  return shuffle(qs)
}

// ─── 3. FACTORS & MULTIPLES ───────────────────────────────────
function genFactorsMultiples(): Question[] {
  const qs: Question[] = []
  // GCF
  const gcfPairs: Array<[number, number]> = [[12, 18], [8, 20], [15, 25], [24, 36], [16, 28]]
  for (const [a, b] of gcfPairs) {
    const g = gcd(a, b)
    qs.push(mcq(
      `What is the GCF (Greatest Common Factor) of ${a} and ${b}?`,
      `${g}`,
      [`${g + 1}`, `${g * 2}`, `${Math.min(a, b)}`],
      `List factors of both numbers and find the biggest one they share`
    ))
  }
  // LCM
  const lcmPairs: Array<[number, number]> = [[4, 6], [3, 8], [5, 7], [6, 9], [8, 12]]
  for (const [a, b] of lcmPairs) {
    const l = lcm(a, b)
    qs.push(mcq(
      `What is the LCM (Least Common Multiple) of ${a} and ${b}?`,
      `${l}`,
      [`${l + a}`, `${a * b}`, `${l - b}`].filter(v => v !== `${l}`).slice(0, 3),
      `List multiples of each number until you find the first one they share`
    ))
  }
  // Is it prime?
  qs.push(mcq('Is 17 a prime number?', 'Yes', ['No'], 'A prime number has only 2 factors: 1 and itself'))
  qs.push(mcq('Is 21 a prime number?', 'No', ['Yes'], '21 = 3 × 7, so it is not prime'))
  return shuffle(qs)
}

// ─── 4. FRACTION BASICS ───────────────────────────────────────
function genFractionBasics(): Question[] {
  const qs: Question[] = []
  // Simplify fractions
  const fracs: Array<[number, number, string]> = [
    [4, 8, '1/2'], [3, 9, '1/3'], [6, 10, '3/5'], [8, 12, '2/3'],
    [10, 15, '2/3'], [6, 8, '3/4'], [4, 6, '2/3'],
  ]
  for (const [n, d, answer] of fracs) {
    qs.push(mcq(
      `Simplify ${n}/${d}`,
      answer,
      shuffle(['1/2', '1/3', '2/3', '3/4', '3/5', '1/4', '2/5'].filter(v => v !== answer)).slice(0, 3),
      `Divide both by their GCF`
    ))
  }
  // Compare fractions
  qs.push(mcq('Which is larger: 3/4 or 2/3?', '3/4', ['2/3', 'They are equal'], 'Find common denominators: 9/12 vs 8/12'))
  qs.push(mcq('Which is larger: 5/8 or 3/5?', '5/8', ['3/5', 'They are equal'], '25/40 vs 24/40'))
  // Convert to mixed numbers
  qs.push(mcq('Convert 7/3 to a mixed number', '2 1/3', ['1 2/3', '3 1/7', '2 1/7']))
  qs.push(mcq('Convert 11/4 to a mixed number', '2 3/4', ['3 1/4', '1 3/4', '2 1/4']))
  // Convert to improper
  qs.push(mcq('Convert 3 1/2 to an improper fraction', '7/2', ['5/2', '6/2', '3/2']))
  return shuffle(qs)
}

// ─── 5. ADD & SUBTRACT FRACTIONS ──────────────────────────────
function genAddSubFractions(): Question[] {
  const qs: Question[] = []
  // Same denominator
  qs.push(mcq('1/5 + 2/5 = ?', '3/5', ['2/5', '3/10', '1/5']))
  qs.push(mcq('5/8 - 3/8 = ?', '2/8 = 1/4', ['2/8', '3/8', '8/8'], 'Subtract numerators, simplify'))
  // Unlike denominators
  qs.push(mcq('1/3 + 1/4 = ?', '7/12', ['2/7', '1/7', '5/12'], 'LCD is 12: 4/12 + 3/12'))
  qs.push(mcq('1/2 + 1/3 = ?', '5/6', ['2/5', '1/6', '3/6'], 'LCD is 6: 3/6 + 2/6'))
  qs.push(mcq('3/4 - 1/3 = ?', '5/12', ['2/1', '2/12', '1/4'], 'LCD is 12: 9/12 - 4/12'))
  qs.push(mcq('2/3 + 1/6 = ?', '5/6', ['3/9', '3/6', '1/2'], 'LCD is 6: 4/6 + 1/6'))
  qs.push(mcq('3/5 - 1/4 = ?', '7/20', ['2/1', '2/20', '1/5'], 'LCD is 20: 12/20 - 5/20'))
  // Mixed numbers
  qs.push(mcq('1 1/2 + 2 1/3 = ?', '3 5/6', ['3 2/5', '4 1/6', '3 1/5']))
  qs.push(mcq('3 1/4 - 1 1/2 = ?', '1 3/4', ['2 1/4', '1 1/2', '2 3/4']))
  // Type-in
  qs.push(typein('What is 1/4 + 1/4?', '1/2', 'Add the numerators: 2/4 = 1/2'))
  qs.push(typein('What is 1/2 + 1/4?', '3/4', 'LCD is 4: 2/4 + 1/4 = 3/4'))
  return shuffle(qs)
}

// ─── 6. MULTIPLY & DIVIDE FRACTIONS ──────────────────────────
function genMultDivFractions(): Question[] {
  const qs: Question[] = []
  // Multiply
  qs.push(mcq('1/2 × 1/3 = ?', '1/6', ['2/5', '1/5', '2/6'], 'Multiply tops, multiply bottoms'))
  qs.push(mcq('2/3 × 3/4 = ?', '1/2', ['6/7', '5/12', '2/4'], '6/12 = 1/2'))
  qs.push(mcq('3/5 × 2/3 = ?', '2/5', ['5/8', '6/15', '1/5'], '6/15 = 2/5'))
  qs.push(mcq('4 × 1/3 = ?', '4/3', ['4/1', '1/12', '3/4'], 'Write 4 as 4/1, then multiply'))
  // Divide
  qs.push(mcq('1/2 ÷ 1/4 = ?', '2', ['1/8', '1/2', '4'], 'Flip the second fraction and multiply: 1/2 × 4/1'))
  qs.push(mcq('3/4 ÷ 1/2 = ?', '3/2', ['3/8', '1/2', '6/4'], 'Flip & multiply: 3/4 × 2/1'))
  qs.push(mcq('2/5 ÷ 3/5 = ?', '2/3', ['6/25', '6/5', '5/3'], 'Flip & multiply: 2/5 × 5/3'))
  // Word problems
  qs.push(mcq('A recipe needs 3/4 cup of sugar. You want to make half the recipe. How much sugar?', '3/8 cup', ['1/4 cup', '3/2 cups', '1/2 cup'], '3/4 × 1/2 = 3/8'))
  qs.push(mcq('You have 6 pizzas. Each person eats 3/4 of a pizza. How many people can eat?', '8', ['6', '4', '9'], '6 ÷ 3/4 = 6 × 4/3 = 8'))
  // Type-in
  qs.push(typein('What is 1/3 × 1/3?', '1/9', 'Multiply tops and bottoms'))
  qs.push(typein('What is 1/2 ÷ 1/3?', '3/2', 'Flip & multiply: 1/2 × 3/1'))
  return shuffle(qs)
}

// ─── 7. DECIMALS ──────────────────────────────────────────────
function genDecimals(): Question[] {
  const qs: Question[] = []
  // Add/subtract decimals
  for (let i = 0; i < 3; i++) {
    const a = (rand(10, 99) / 10)
    const b = (rand(10, 99) / 10)
    const sum = (a + b).toFixed(1)
    qs.push(mcq(
      `${a.toFixed(1)} + ${b.toFixed(1)} = ?`,
      sum,
      [`${(a + b + 0.1).toFixed(1)}`, `${(a + b - 0.1).toFixed(1)}`, `${(a + b + 1).toFixed(1)}`],
      'Line up the decimal points'
    ))
  }
  // Multiply decimals
  qs.push(mcq('0.3 × 0.4 = ?', '0.12', ['0.12', '1.2', '0.7', '0.07'].filter((_, i, a) => a.indexOf(a[i]) === i).length > 3 ? ['1.2', '0.7', '0.07'] : ['1.2', '0.7', '0.07'], 'Multiply 3 × 4 = 12, count decimal places'))
  qs.push(mcq('1.5 × 4 = ?', '6', ['5.4', '6.5', '4.5']))
  qs.push(mcq('2.5 × 0.2 = ?', '0.5', ['0.05', '5.0', '0.52']))
  // Fraction ↔ Decimal
  qs.push(mcq('Convert 3/4 to a decimal', '0.75', ['0.34', '0.7', '0.43']))
  qs.push(mcq('Convert 1/5 to a decimal', '0.2', ['0.15', '0.5', '0.25']))
  qs.push(mcq('Convert 0.6 to a fraction', '3/5', ['6/10', '1/6', '2/3'], '0.6 = 6/10 = 3/5'))
  qs.push(mcq('Convert 0.25 to a fraction', '1/4', ['1/25', '2/5', '25/10']))
  // Ordering
  qs.push(mcq('Which is greatest: 0.45, 0.5, or 0.405?', '0.5', ['0.45', '0.405']))
  qs.push(mcq('Which is smallest: 0.8, 0.08, or 0.78?', '0.08', ['0.78', '0.8']))
  return shuffle(qs)
}

// ─── 8. RATIOS ────────────────────────────────────────────────
function genRatios(): Question[] {
  const qs: Question[] = []
  qs.push(mcq('In a class of 10 boys and 15 girls, what is the ratio of boys to girls?', '2:3', ['10:15', '3:2', '1:5'], 'Simplify 10:15 by dividing both by 5'))
  qs.push(mcq('Simplify the ratio 12:8', '3:2', ['12:8', '4:3', '6:4']))
  qs.push(mcq('A recipe uses 2 cups flour for 3 cups milk. How much flour for 9 cups milk?', '6 cups', ['4 cups', '5 cups', '3 cups'], '2/3 = ?/9 → ? = 6'))
  qs.push(mcq('Simplify the ratio 20:30:10', '2:3:1', ['4:6:2', '20:30:10', '10:15:5']))
  qs.push(mcq('If the ratio of cats to dogs is 3:5 and there are 15 cats, how many dogs?', '25', ['20', '30', '10'], '3/5 = 15/? → ? = 25'))
  // Unit rates
  qs.push(mcq('You drive 180 miles in 3 hours. What is the unit rate?', '60 mph', ['90 mph', '45 mph', '180 mph']))
  qs.push(mcq('12 apples cost $4. What is the cost per apple?', '$0.33', ['$3.00', '$0.25', '$0.50'], '$4 ÷ 12 ≈ $0.33'))
  qs.push(mcq('You earn $45 for 5 hours of work. What is your hourly rate?', '$9/hour', ['$5/hour', '$8/hour', '$10/hour']))
  // Equivalent
  qs.push(mcq('Which ratio is equivalent to 4:6?', '2:3', ['3:4', '4:3', '8:10']))
  qs.push(mcq('Which ratio is NOT equivalent to 1:2?', '3:5', ['2:4', '5:10', '3:6']))
  return shuffle(qs)
}

// ─── 9. PROPORTIONS ───────────────────────────────────────────
function genProportions(): Question[] {
  const qs: Question[] = []
  // Solve for x
  const props: Array<[number, number, number, number]> = [
    [2, 5, 6, 15], [3, 4, 9, 12], [1, 3, 5, 15], [4, 7, 8, 14], [2, 3, 10, 15],
  ]
  for (const [a, b, c, d] of props) {
    qs.push(mcq(
      `Solve: ${a}/${b} = ${c}/x`,
      `${d}`,
      [`${d + 1}`, `${d - 2}`, `${b * 2}`],
      `Cross multiply: ${a} × x = ${b} × ${c} → x = ${d}`
    ))
  }
  // Word problems
  qs.push(mcq('If 3 notebooks cost $6, how much do 7 notebooks cost?', '$14', ['$12', '$18', '$21'], '3/6 = 7/x → x = 14'))
  qs.push(mcq('A map scale is 1 inch = 50 miles. Two cities are 4.5 inches apart. How far apart are they?', '225 miles', ['200 miles', '250 miles', '180 miles']))
  qs.push(mcq('If 5 pounds of apples make 2 pies, how many pounds for 6 pies?', '15 pounds', ['12 pounds', '10 pounds', '18 pounds'], '5/2 = x/6 → x = 15'))
  // Type-in
  qs.push(typein('Solve: 4/6 = x/9', '6', 'Cross multiply: 4 × 9 = 6 × x'))
  qs.push(typein('Solve: 5/8 = 15/x', '24', 'Cross multiply: 5x = 8 × 15 = 120'))
  qs.push(typein('If 2 tickets cost $14, how much do 5 tickets cost?', '35', '2/14 = 5/x → x = 35'))
  return shuffle(qs)
}

// ─── 10. PERCENTAGES ──────────────────────────────────────────
function genPercentages(): Question[] {
  const qs: Question[] = []
  // Basic percent of a number
  qs.push(mcq('What is 50% of 80?', '40', ['30', '45', '50']))
  qs.push(mcq('What is 25% of 60?', '15', ['20', '12', '25']))
  qs.push(mcq('What is 10% of 250?', '25', ['250', '2.5', '50']))
  qs.push(mcq('What is 75% of 200?', '150', ['175', '125', '100']))
  qs.push(mcq('What is 20% of 45?', '9', ['8', '10', '12']))
  // Convert
  qs.push(mcq('Convert 3/5 to a percent', '60%', ['35%', '53%', '65%'], '3 ÷ 5 = 0.6 = 60%'))
  qs.push(mcq('Convert 0.35 to a percent', '35%', ['3.5%', '0.35%', '350%']))
  // Discount/tip
  qs.push(mcq('A $40 shirt is 25% off. What is the sale price?', '$30', ['$35', '$25', '$10'], '25% of $40 = $10 discount'))
  qs.push(mcq('A $20 meal with a 15% tip. What is the total?', '$23', ['$22', '$25', '$21'], '15% of $20 = $3'))
  // What percent?
  qs.push(mcq('You got 18 out of 20 correct. What percent?', '90%', ['80%', '85%', '95%'], '18/20 = 0.9 = 90%'))
  // Type-in
  qs.push(typein('What is 30% of 50?', '15', '30% = 0.30; 0.30 × 50 = 15'))
  return shuffle(qs)
}

// ─── 11. AREA & PERIMETER ─────────────────────────────────────
function genAreaPerimeter(): Question[] {
  const qs: Question[] = []
  // Rectangles
  for (let i = 0; i < 3; i++) {
    const l = rand(3, 15)
    const w = rand(3, 15)
    qs.push(mcq(
      `What is the area of a rectangle with length ${l} and width ${w}?`,
      `${l * w}`,
      [`${l + w}`, `${2 * (l + w)}`, `${l * w + l}`],
      `Area = length × width = ${l} × ${w}`
    ))
    qs.push(mcq(
      `What is the perimeter of a rectangle: length ${l}, width ${w}?`,
      `${2 * (l + w)}`,
      [`${l * w}`, `${l + w}`, `${2 * l + w}`],
      `Perimeter = 2(l + w) = 2(${l} + ${w})`
    ))
  }
  // Triangles
  for (let i = 0; i < 2; i++) {
    const b = rand(4, 12)
    const h = rand(3, 10)
    qs.push(mcq(
      `What is the area of a triangle with base ${b} and height ${h}?`,
      `${(b * h) / 2}`,
      [`${b * h}`, `${b + h}`, `${(b * h) / 2 + b}`],
      `Area = (1/2) × base × height`
    ))
  }
  // Circle (use π ≈ 3.14)
  qs.push(mcq('What is the area of a circle with radius 5? (use π ≈ 3.14)', '78.5', ['31.4', '15.7', '25'], 'A = πr² = 3.14 × 25'))
  qs.push(mcq('What is the circumference of a circle with radius 7? (use π ≈ 3.14)', '43.96', ['21.98', '153.86', '14'], 'C = 2πr = 2 × 3.14 × 7'))
  return shuffle(qs)
}

// ─── 12. VOLUME ───────────────────────────────────────────────
function genVolume(): Question[] {
  const qs: Question[] = []
  // Rectangular prism
  for (let i = 0; i < 4; i++) {
    const l = rand(2, 10)
    const w = rand(2, 10)
    const h = rand(2, 10)
    qs.push(mcq(
      `Volume of a rectangular box: length ${l}, width ${w}, height ${h}?`,
      `${l * w * h}`,
      [`${l * w + h}`, `${l + w + h}`, `${l * w * h + l}`],
      `V = l × w × h = ${l} × ${w} × ${h}`
    ))
  }
  // Cube
  for (let i = 0; i < 3; i++) {
    const s = rand(2, 8)
    qs.push(mcq(
      `What is the volume of a cube with side length ${s}?`,
      `${s ** 3}`,
      [`${s * s}`, `${s * 6}`, `${s ** 3 + s}`],
      `V = s³ = ${s} × ${s} × ${s}`
    ))
  }
  // Formulas
  qs.push(mcq('The formula for volume of a rectangular prism is:', 'V = l × w × h', ['V = l + w + h', 'V = 2(lw + lh + wh)', 'V = l × w']))
  qs.push(mcq('The formula for volume of a cube is:', 'V = s³', ['V = 6s²', 'V = s²', 'V = 4s']))
  // Word problems
  qs.push(mcq('A fish tank is 20 in long, 10 in wide, and 12 in tall. What is its volume?', '2,400 cubic in', ['420 cubic in', '1,200 cubic in', '240 cubic in']))
  qs.push(mcq('A cube has a volume of 64. What is the side length?', '4', ['8', '16', '32'], '4 × 4 × 4 = 64'))
  return shuffle(qs)
}

// ─── 13. ANGLES & TRIANGLES ──────────────────────────────────
function genAngles(): Question[] {
  const qs: Question[] = []
  // Angle types
  qs.push(mcq('An angle of 90° is called:', 'Right angle', ['Acute angle', 'Obtuse angle', 'Straight angle']))
  qs.push(mcq('An angle less than 90° is called:', 'Acute angle', ['Right angle', 'Obtuse angle', 'Reflex angle']))
  qs.push(mcq('An angle between 90° and 180° is called:', 'Obtuse angle', ['Acute angle', 'Right angle', 'Straight angle']))
  qs.push(mcq('A straight angle measures:', '180°', ['90°', '360°', '270°']))
  // Triangle angles
  qs.push(mcq('The three angles of a triangle always add up to:', '180°', ['360°', '90°', '270°']))
  for (let i = 0; i < 3; i++) {
    const a = rand(30, 80)
    const b = rand(30, 80)
    const c = 180 - a - b
    if (c <= 0 || c >= 180) continue
    qs.push(mcq(
      `A triangle has angles of ${a}° and ${b}°. What is the third angle?`,
      `${c}°`,
      [`${c + 10}°`, `${c - 10}°`, `${180 - a}°`],
      `180 - ${a} - ${b} = ${c}`
    ))
  }
  // Triangle types
  qs.push(mcq('A triangle with all sides equal is called:', 'Equilateral', ['Isosceles', 'Scalene', 'Right']))
  qs.push(mcq('A triangle with exactly two equal sides is called:', 'Isosceles', ['Equilateral', 'Scalene', 'Obtuse']))
  // Supplementary & complementary
  qs.push(mcq('Two angles that add to 90° are called:', 'Complementary', ['Supplementary', 'Adjacent', 'Vertical']))
  qs.push(mcq('Two angles that add to 180° are called:', 'Supplementary', ['Complementary', 'Adjacent', 'Congruent']))
  qs.push(typein('What is the supplement of a 65° angle?', '115', '180 - 65 = 115'))
  qs.push(typein('What is the complement of a 35° angle?', '55', '90 - 35 = 55'))
  return shuffle(qs)
}

// ─── 14. MEAN, MEDIAN, MODE ──────────────────────────────────
function genMeanMedianMode(): Question[] {
  const qs: Question[] = []
  for (let i = 0; i < 3; i++) {
    const nums = Array.from({ length: 5 }, () => rand(1, 20)).sort((a, b) => a - b)
    const sum = nums.reduce((a, b) => a + b, 0)
    const mean = sum / nums.length
    const meanStr = Number.isInteger(mean) ? `${mean}` : mean.toFixed(1)
    qs.push(mcq(
      `Find the mean (average) of: ${nums.join(', ')}`,
      meanStr,
      [`${Number.parseFloat(meanStr) + 1}`, `${nums[2]}`, `${Number.parseFloat(meanStr) - 2}`],
      `Add all numbers (${sum}) and divide by ${nums.length}`
    ))
    qs.push(mcq(
      `Find the median of: ${nums.join(', ')}`,
      `${nums[2]}`,
      [`${nums[1]}`, `${nums[3]}`, meanStr],
      'The median is the middle value when sorted'
    ))
  }
  // Mode
  qs.push(mcq('Find the mode of: 3, 5, 3, 7, 3, 8, 5', '3', ['5', '7', '8'], 'The mode is the value that appears most often'))
  qs.push(mcq('Find the mode of: 2, 4, 4, 6, 6, 8', '4 and 6', ['4', '6', '2'], 'Both 4 and 6 appear twice'))
  // Range
  for (let i = 0; i < 2; i++) {
    const nums = Array.from({ length: 5 }, () => rand(1, 30)).sort((a, b) => a - b)
    const range = nums[nums.length - 1] - nums[0]
    qs.push(mcq(
      `Find the range of: ${nums.join(', ')}`,
      `${range}`,
      [`${range + 2}`, `${range - 1}`, `${nums[2]}`],
      'Range = biggest number - smallest number'
    ))
  }
  return shuffle(qs)
}

// ─── 15. PROBABILITY ──────────────────────────────────────────
function genProbability(): Question[] {
  const qs: Question[] = []
  qs.push(mcq('What is the probability of rolling a 3 on a regular die?', '1/6', ['1/3', '1/2', '3/6']))
  qs.push(mcq('What is the probability of flipping heads on a coin?', '1/2', ['1/4', '1/3', '2/3']))
  qs.push(mcq('What is the probability of rolling an even number on a die?', '1/2', ['1/3', '1/6', '2/3'], 'Even numbers: 2, 4, 6 = 3 out of 6'))
  qs.push(mcq('A bag has 3 red and 5 blue marbles. What is the probability of picking red?', '3/8', ['5/8', '3/5', '1/3']))
  qs.push(mcq('A bag has 4 red, 2 blue, and 4 green marbles. Probability of picking blue?', '1/5', ['2/4', '2/8', '1/10'], '2 out of 10 = 1/5'))
  qs.push(mcq('If probability of rain is 30%, what is the probability of no rain?', '70%', ['30%', '50%', '60%']))
  // Spinners
  qs.push(mcq('A spinner has 4 equal sections: red, blue, green, yellow. P(green)?', '1/4', ['1/2', '1/3', '1/6']))
  // Certain/impossible
  qs.push(mcq('What is the probability of an impossible event?', '0', ['1', '1/2', 'undefined']))
  qs.push(mcq('What is the probability of a certain event?', '1', ['0', '1/2', '2']))
  // Word problem
  qs.push(mcq('You flip a coin twice. What is P(two heads)?', '1/4', ['1/2', '1/3', '1/8'], 'P(H) × P(H) = 1/2 × 1/2'))
  qs.push(typein('A bag has 6 red and 4 blue. How many marbles total?', '10', 'Just add them up!'))
  return shuffle(qs)
}

// ─── 16. COORDINATE PLANE ─────────────────────────────────────
function genCoordinatePlane(): Question[] {
  const qs: Question[] = []
  qs.push(mcq('In an ordered pair (x, y), which number comes first?', 'x (horizontal)', ['y (vertical)', 'Either one', 'The larger number']))
  qs.push(mcq('The point (0, 0) is called the:', 'Origin', ['Center', 'Axis', 'Vertex']))
  qs.push(mcq('Which quadrant is the point (3, -2) in?', 'Quadrant IV', ['Quadrant I', 'Quadrant II', 'Quadrant III'], 'Positive x, negative y = Quadrant IV'))
  qs.push(mcq('Which quadrant is (-4, 5) in?', 'Quadrant II', ['Quadrant I', 'Quadrant III', 'Quadrant IV']))
  qs.push(mcq('The point (5, 0) is on which axis?', 'x-axis', ['y-axis', 'Both axes', 'Neither axis']))
  qs.push(mcq('The point (0, -3) is on which axis?', 'y-axis', ['x-axis', 'Both axes', 'Neither axis']))
  // Distance
  qs.push(mcq('What is the distance between (1, 2) and (4, 2)?', '3', ['5', '2', '6'], 'Same y, so just subtract x values: 4 - 1 = 3'))
  qs.push(mcq('What is the distance between (3, 1) and (3, 7)?', '6', ['4', '10', '3'], 'Same x, so subtract y values: 7 - 1 = 6'))
  // Reflections
  qs.push(mcq('If you reflect (2, 5) across the x-axis, you get:', '(2, -5)', ['(-2, 5)', '(-2, -5)', '(5, 2)']))
  qs.push(mcq('If you reflect (3, -1) across the y-axis, you get:', '(-3, -1)', ['(3, 1)', '(-3, 1)', '(1, -3)']))
  // Type-in
  qs.push(typein('What quadrant is (-2, -7) in? (Answer: 1, 2, 3, or 4)', '3', 'Both negative = Quadrant III'))
  return shuffle(qs)
}

// ─── 17. INTEGERS ─────────────────────────────────────────────
function genIntegers(): Question[] {
  const qs: Question[] = []
  // Adding
  for (let i = 0; i < 3; i++) {
    const a = rand(-15, 15)
    const b = rand(-15, 15)
    qs.push(mcq(
      `${a} + ${b < 0 ? `(${b})` : b} = ?`,
      `${a + b}`,
      [`${a + b + 2}`, `${a + b - 2}`, `${Math.abs(a + b)}`],
    ))
  }
  // Subtracting
  for (let i = 0; i < 3; i++) {
    const a = rand(-15, 15)
    const b = rand(-15, 15)
    qs.push(mcq(
      `${a} - ${b < 0 ? `(${b})` : b} = ?`,
      `${a - b}`,
      [`${a - b + 2}`, `${a - b - 2}`, `${-(a - b)}`],
      `Subtracting ${b} is the same as adding ${-b}`
    ))
  }
  // Multiplying
  qs.push(mcq('(-3) × (-4) = ?', '12', ['-12', '-7', '7'], 'Negative × negative = positive'))
  qs.push(mcq('(-5) × 6 = ?', '-30', ['30', '-11', '11'], 'Negative × positive = negative'))
  qs.push(mcq('7 × (-3) = ?', '-21', ['21', '-10', '10']))
  // Ordering
  qs.push(mcq('Which is greater: -3 or -7?', '-3', ['-7', 'They are equal'], '-3 is closer to 0'))
  // Absolute value
  qs.push(mcq('What is |-8|?', '8', ['-8', '0', '1'], 'Absolute value is the distance from 0'))
  qs.push(mcq('What is |5|?', '5', ['-5', '0', '1']))
  return shuffle(qs)
}

// ─── 18. ORDER OF OPERATIONS ──────────────────────────────────
function genOrderOfOperations(): Question[] {
  const qs: Question[] = []
  qs.push(mcq('3 + 4 × 2 = ?', '11', ['14', '10', '12'], 'Multiply first: 3 + 8 = 11'))
  qs.push(mcq('(3 + 4) × 2 = ?', '14', ['11', '10', '12'], 'Parentheses first: 7 × 2 = 14'))
  qs.push(mcq('10 - 2 × 3 = ?', '4', ['24', '8', '16'], 'Multiply first: 10 - 6 = 4'))
  qs.push(mcq('(10 - 2) × 3 = ?', '24', ['4', '8', '16']))
  qs.push(mcq('2 + 3² = ?', '11', ['25', '10', '7'], 'Exponents first: 2 + 9 = 11'))
  qs.push(mcq('(2 + 3)² = ?', '25', ['11', '10', '7']))
  qs.push(mcq('12 ÷ 4 + 2 × 3 = ?', '9', ['3', '15', '12'], 'Left to right: 3 + 6 = 9'))
  qs.push(mcq('8 + 16 ÷ 4 × 2 = ?', '16', ['12', '6', '48'], '8 + (16÷4)×2 = 8 + 4×2 = 8 + 8'))
  qs.push(mcq('What does PEMDAS stand for?', 'Parentheses, Exponents, Multiply/Divide, Add/Subtract', ['Please Excuse My Dear Aunt Sally', 'Both of these are correct'], 'PEMDAS is the order of operations'))
  // Type-in
  qs.push(typein('5 × (2 + 6) = ?', '40', 'Parentheses first: 5 × 8 = 40'))
  qs.push(typein('4² - 2 × 3 = ?', '10', '16 - 6 = 10'))
  qs.push(typein('(8 + 2) ÷ 5 = ?', '2', 'Parentheses first: 10 ÷ 5 = 2'))
  return shuffle(qs)
}

// ─── 19. SIMPLE EQUATIONS ─────────────────────────────────────
function genSimpleEquations(): Question[] {
  const qs: Question[] = []
  // x + a = b
  for (let i = 0; i < 3; i++) {
    const x = rand(1, 20)
    const a = rand(1, 15)
    const b = x + a
    qs.push(mcq(
      `Solve for x: x + ${a} = ${b}`,
      `${x}`,
      [`${x + 1}`, `${x - 1}`, `${b}`],
      `Subtract ${a} from both sides`
    ))
  }
  // ax = b
  for (let i = 0; i < 3; i++) {
    const x = rand(2, 12)
    const a = rand(2, 8)
    const b = a * x
    qs.push(mcq(
      `Solve for x: ${a}x = ${b}`,
      `${x}`,
      [`${x + 1}`, `${b}`, `${a}`],
      `Divide both sides by ${a}`
    ))
  }
  // x - a = b
  for (let i = 0; i < 2; i++) {
    const x = rand(5, 25)
    const a = rand(1, x - 1)
    const b = x - a
    qs.push(mcq(
      `Solve for x: x - ${a} = ${b}`,
      `${x}`,
      [`${b}`, `${x - 1}`, `${a + b + 1}`],
      `Add ${a} to both sides`
    ))
  }
  // Two-step
  for (let i = 0; i < 2; i++) {
    const x = rand(2, 10)
    const a = rand(2, 5)
    const b = rand(1, 10)
    const c = a * x + b
    qs.push(mcq(
      `Solve for x: ${a}x + ${b} = ${c}`,
      `${x}`,
      [`${x + 1}`, `${x - 1}`, `${c}`],
      `Subtract ${b}, then divide by ${a}`
    ))
  }
  // Type-in
  qs.push(typein('Solve: x + 7 = 15', '8', 'Subtract 7 from both sides'))
  qs.push(typein('Solve: 3x = 21', '7', 'Divide both sides by 3'))
  return shuffle(qs)
}

// ─── 20. EXPONENTS & SQUARE ROOTS ─────────────────────────────
function genExponents(): Question[] {
  const qs: Question[] = []
  // Basic exponents
  const bases = [2, 3, 4, 5, 6, 7, 8, 9, 10]
  for (let i = 0; i < 5; i++) {
    const b = bases[rand(0, bases.length - 1)]
    const exp = rand(2, 4)
    const result = b ** exp
    qs.push(mcq(
      `What is ${b}^${exp}?`,
      `${result}`,
      [`${result + b}`, `${b * exp}`, `${result - 1}`],
      `${b}^${exp} means ${Array(exp).fill(b).join(' × ')}`
    ))
  }
  // Square roots
  for (const sq of [4, 9, 25, 36, 64, 100, 144]) {
    const root = Math.sqrt(sq)
    qs.push(mcq(
      `What is √${sq}?`,
      `${root}`,
      [`${root + 1}`, `${root - 1}`, `${sq / 2}`],
      `${root} × ${root} = ${sq}`
    ))
  }
  // Rules
  qs.push(mcq('Any number raised to the power of 0 equals:', '1', ['0', 'The number itself', 'undefined']))
  qs.push(mcq('Any number raised to the power of 1 equals:', 'The number itself', ['0', '1', '2']))
  // Type-in
  qs.push(typein('What is 2^5?', '32', '2 × 2 × 2 × 2 × 2 = 32'))
  qs.push(typein('What is √49?', '7', '7 × 7 = 49'))
  return shuffle(qs)
}

// ─── MASTER GENERATOR ─────────────────────────────────────────
const generators: Record<string, () => Question[]> = {
  'multiplication': genMultiplication,
  'division': genDivision,
  'factors-multiples': genFactorsMultiples,
  'fraction-basics': genFractionBasics,
  'add-sub-fractions': genAddSubFractions,
  'multiply-divide-fractions': genMultDivFractions,
  'decimals': genDecimals,
  'ratios': genRatios,
  'proportions': genProportions,
  'percentages': genPercentages,
  'area-perimeter': genAreaPerimeter,
  'volume': genVolume,
  'angles': genAngles,
  'mean-median-mode': genMeanMedianMode,
  'probability': genProbability,
  'coordinate-plane': genCoordinatePlane,
  'integers': genIntegers,
  'order-of-operations': genOrderOfOperations,
  'simple-equations': genSimpleEquations,
  'exponents': genExponents,
}

export function generateQuestions(topicId: string, count = 10): Question[] {
  const gen = generators[topicId]
  if (!gen) return []
  const all = gen()
  return shuffle(all).slice(0, count)
}
