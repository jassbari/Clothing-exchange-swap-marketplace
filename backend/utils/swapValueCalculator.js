/**
 * Calculates a basic swap value score for a clothing item.
 * Higher score means higher value.
 */
const calculateSwapValue = (brand, condition, category) => {
  let score = 0;

  // Base score by category
  const categoryScores = {
    'Outerwear': 30,
    'Dresses': 25,
    'Pants': 20,
    'Shirts': 15,
    'Accessories': 10,
    'Shoes': 25,
  };
  score += categoryScores[category] || 15;

  // Condition multiplier
  const conditionMultipliers = {
    'New': 1.5,
    'Like New': 1.2,
    'Good': 1.0,
    'Fair': 0.7,
  };
  score *= (conditionMultipliers[condition] || 1.0);

  // Brand tier bonus (simplified example)
  const premiumBrands = ['Gucci', 'Prada', 'Louis Vuitton', 'Chanel'];
  const midTierBrands = ['Nike', 'Adidas', 'Zara', 'H&M', 'Levi\'s'];

  if (premiumBrands.includes(brand)) {
    score += 50;
  } else if (midTierBrands.includes(brand)) {
    score += 15;
  } else {
    score += 5;
  }

  return Math.round(score);
};

export default calculateSwapValue;
