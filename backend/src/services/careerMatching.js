import Career from '../models/Career.js';

/**
 * Calculate match score between user personality traits and career requirements
 * Uses Euclidean distance formula to find similarity
 * Lower distance = Higher match (inverted to 0-100 scale)
 */
export const calculateCareerMatch = (userTraits, careerTraits) => {
  // Calculate Euclidean distance
  let sumSquaredDifferences = 0;
  const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];

  traits.forEach((trait) => {
    const userValue = userTraits[trait] || 50;
    const careerValue = careerTraits[trait] || 50;
    sumSquaredDifferences += Math.pow(userValue - careerValue, 2);
  });

  const distance = Math.sqrt(sumSquaredDifferences / traits.length);
  // Convert distance to match score (0-100)
  // Max possible distance is ~70, so we normalize it
  const matchScore = Math.max(0, Math.min(100, 100 - (distance / 100) * 100));

  return Math.round(matchScore);
};

/**
 * Get career recommendations for a user based on assessment scores
 * Returns careers sorted by match score
 */
export const getCareerRecommendations = async (userAssessment, limit = 10) => {
  try {
    // Get all active careers
    const careers = await Career.find({ is_active: true }).lean();

    if (!careers.length) {
      return [];
    }

    // Calculate match scores
    const matchedCareers = careers.map((career) => {
      const matchScore = calculateCareerMatch(
        userAssessment.scores,
        career.trait_requirements
      );

      return {
        _id: career._id,
        title: career.title,
        domain: career.domain,
        match_score: matchScore,
        short_description: career.short_description,
        salary: career.salary,
        job_outlook: career.job_outlook,
      };
    });

    // Sort by match score (descending) and return top matches
    return matchedCareers
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, limit);
  } catch (error) {
    console.error('Error calculating career recommendations:', error);
    throw error;
  }
};

/**
 * Filter careers by domain
 */
export const filterCareersByDomain = async (domains, limit = 20) => {
  try {
    const careers = await Career.find({
      domain: { $in: domains },
      is_active: true,
    })
      .select('title domain description short_description salary job_outlook trait_requirements')
      .limit(limit)
      .lean();

    return careers;
  } catch (error) {
    console.error('Error filtering careers by domain:', error);
    throw error;
  }
};

/**
 * Search careers by keyword
 */
export const searchCareers = async (query, limit = 20) => {
  try {
    const careers = await Career.find(
      {
        $text: { $search: query },
        is_active: true,
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean();

    return careers;
  } catch (error) {
    console.error('Error searching careers:', error);
    throw error;
  }
};

/**
 * Get career details with related careers
 */
export const getCareerDetails = async (careerId) => {
  try {
    const career = await Career.findById(careerId)
      .populate('related_careers', 'title domain match_score')
      .lean();

    return career;
  } catch (error) {
    console.error('Error fetching career details:', error);
    throw error;
  }
};

/**
 * Suggest similar careers based on traits
 */
export const getSimilarCareers = async (careerId, limit = 5) => {
  try {
    const career = await Career.findById(careerId).lean();

    if (!career) {
      return [];
    }

    // Find careers in same domain or with similar trait requirements
    const similarCareers = await Career.find({
      _id: { $ne: careerId },
      $or: [
        { domain: career.domain },
        {
          trait_requirements: {
            $near: career.trait_requirements,
          },
        },
      ],
      is_active: true,
    })
      .limit(limit)
      .lean();

    return similarCareers;
  } catch (error) {
    console.error('Error finding similar careers:', error);
    throw error;
  }
};
