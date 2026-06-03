// src/lib/curriculumData.ts
// CBSE-ONLY MVP: All 6 subjects for LKG-Class 8 with complete NCERT chapters.
// Board abstraction removed — this is a flat grade → subject → chapters map.

export type Subject = "MATH" | "SCIENCE" | "ENGLISH" | "EVS" | "HINDI" | "SST";

export interface ChapterOrTopic {
  id: string;
  name: string;
}

// Complete NCERT CBSE chapter data, flat structure (no board nesting)
// MATH:    NCERT Math textbooks (Math Magic / Mathematics)
// SCIENCE: Separate science topics for Classes 3-5 (school practice);
//          NCERT Science textbook for Classes 6-8
// ENGLISH: Grammar topics aligned with NCERT/CBSE syllabus
// EVS:     NCERT Looking Around (Classes 1-5); empty for 6-8
// HINDI:   NCERT Rimjhim (Classes 1-5), Vasant (Classes 6-8)
// SST:     NCERT History + Geography + Civics (Classes 6-8 only)
export const CURRICULUM_DATA: Record<string, Record<Subject, ChapterOrTopic[]>> = {

  // ────────────────────────────────────────────────────────
  //  LKG
  // ────────────────────────────────────────────────────────
  LKG: {
    MATH: [
      { id: "numbers-1-10", name: "Numbers (1 to 10)" },
      { id: "shapes-sizes", name: "Shapes & Sizes" },
      { id: "counting-objects", name: "Counting Objects" },
      { id: "more-less", name: "More and Less" },
      { id: "patterns-lkg", name: "Simple Patterns" }
    ],
    SCIENCE: [
      { id: "living-nonliving-lkg", name: "Living and Non-Living Things" },
      { id: "my-senses-lkg", name: "Our Five Senses" },
      { id: "plants-lkg", name: "Plants Around Us" },
      { id: "animals-lkg", name: "Animals Around Us" }
    ],
    ENGLISH: [
      { id: "alphabet-capital", name: "Capital Letters (A to Z)" },
      { id: "phonics-sounds", name: "Phonics Sounds" },
      { id: "matching-words", name: "Matching Letters & Objects" },
      { id: "simple-words", name: "Three-Letter Words (CVC)" }
    ],
    EVS: [
      { id: "my-body", name: "My Body Parts" },
      { id: "fruits-veggies", name: "Common Fruits & Vegetables" },
      { id: "animals-env", name: "Domestic & Wild Animals" },
      { id: "colours-shapes", name: "Colours & Shapes Around Us" }
    ],
    HINDI: [
      { id: "swar-lkg", name: "स्वर (अ से अः)" },
      { id: "vyanjan-lkg", name: "व्यंजन (क से ज्ञ)" },
      { id: "matra-lkg", name: "मात्राएँ (आ, इ, ई)" }
    ],
    SST: []
  },

  // ────────────────────────────────────────────────────────
  //  UKG
  // ────────────────────────────────────────────────────────
  UKG: {
    MATH: [
      { id: "numbers-1-50", name: "Numbers (1 to 50)" },
      { id: "addition-basic", name: "Simple Addition (Single Digit)" },
      { id: "subtraction-basic", name: "Simple Subtraction (Single Digit)" },
      { id: "before-after", name: "Before, After and Between" },
      { id: "measurement-basic", name: "Big and Small, Heavy and Light" }
    ],
    SCIENCE: [
      { id: "weather-ukg", name: "Weather Around Us" },
      { id: "food-ukg", name: "Food We Eat" },
      { id: "plants-grow-ukg", name: "How Plants Grow" },
      { id: "animals-habits-ukg", name: "Animal Habits and Homes" }
    ],
    ENGLISH: [
      { id: "small-letters", name: "Small Letters (a to z)" },
      { id: "vowels-consonants", name: "Vowels & Consonants (a, e, i, o, u)" },
      { id: "rhyming-words", name: "Simple Rhyming Words" },
      { id: "two-letter-words", name: "Two-Letter Words" },
      { id: "sight-words", name: "Sight Words (is, am, the, a)" }
    ],
    EVS: [
      { id: "seasons", name: "Seasons & Weather" },
      { id: "family", name: "My Family & Neighbours" },
      { id: "our-helpers", name: "Community Helpers" },
      { id: "transport", name: "Means of Transport" }
    ],
    HINDI: [
      { id: "matra-full-ukg", name: "सभी मात्राएँ (आ से औ)" },
      { id: "do-akshar-ukg", name: "दो अक्षर के शब्द" },
      { id: "teen-akshar-ukg", name: "तीन अक्षर के शब्द" },
      { id: "anuswar-ukg", name: "अनुस्वार और चन्द्रबिन्दु" }
    ],
    SST: []
  },

  // ────────────────────────────────────────────────────────
  //  CLASS 1
  // ────────────────────────────────────────────────────────
  "Class 1": {
    MATH: [
      { id: "shapes-space-c1", name: "Shapes and Space" },
      { id: "numbers-1-99-c1", name: "Numbers from One to Ninety-Nine" },
      { id: "addition-subtraction-c1", name: "Addition and Subtraction" },
      { id: "time-c1", name: "Time & Days" },
      { id: "measurement-c1", name: "Measurement (Long, Short, Tall)" },
      { id: "money-c1", name: "Money" },
      { id: "data-simple-c1", name: "Simple Data (Pictographs)" }
    ],
    SCIENCE: [
      { id: "living-nonliving-c1", name: "Living and Non-Living Things" },
      { id: "plants-c1", name: "Parts of a Plant" },
      { id: "animals-c1", name: "Animals and Their Sounds" },
      { id: "body-c1", name: "Our Body" },
      { id: "food-c1", name: "Healthy Food" },
      { id: "water-c1", name: "Uses of Water" }
    ],
    ENGLISH: [
      { id: "nouns-basic-c1", name: "Naming Words (Nouns)" },
      { id: "singular-plural-c1", name: "One and Many (Singular/Plural)" },
      { id: "pronouns-basic-c1", name: "I, You, He, She, It (Pronouns)" },
      { id: "action-words-c1", name: "Action Words (Verbs)" },
      { id: "describing-words-c1", name: "Describing Words (Adjectives)" },
      { id: "simple-sentences-c1", name: "Making Simple Sentences" }
    ],
    EVS: [
      { id: "about-myself-c1", name: "About Myself & My Body" },
      { id: "food-we-eat-c1", name: "The Food We Eat" },
      { id: "clothes-we-wear-c1", name: "Clothes We Wear" },
      { id: "our-shelter-c1", name: "Types of Houses" },
      { id: "plants-env-c1", name: "Plants Around Us" },
      { id: "animals-env-c1", name: "Animals Around Us" }
    ],
    HINDI: [
      { id: "rimjhim-1-ch1", name: "झूला" },
      { id: "rimjhim-1-ch2", name: "आम की कहानी" },
      { id: "rimjhim-1-ch3", name: "आम की टोकरी" },
      { id: "rimjhim-1-ch4", name: "पत्ते ही पत्ते" },
      { id: "rimjhim-1-ch5", name: "पकौड़ी" },
      { id: "hindi-vy-c1", name: "मात्राएँ और शब्द-ज्ञान" }
    ],
    SST: []
  },

  // ────────────────────────────────────────────────────────
  //  CLASS 2
  // ────────────────────────────────────────────────────────
  "Class 2": {
    MATH: [
      { id: "what-is-long-c2", name: "What is Long, What is Round" },
      { id: "counting-groups-c2", name: "Counting in Groups" },
      { id: "how-much-carry-c2", name: "How Much Can You Carry?" },
      { id: "addition-tens-c2", name: "Addition in Tens" },
      { id: "jugs-mugs-c2", name: "Jugs and Mugs (Measurement)" },
      { id: "time-c2", name: "Time — Days and Months" },
      { id: "money-c2", name: "Give and Take (Money)" }
    ],
    SCIENCE: [
      { id: "plants-types-c2", name: "Types of Plants" },
      { id: "animals-useful-c2", name: "Useful Animals" },
      { id: "air-water-c2", name: "Air and Water" },
      { id: "health-habits-c2", name: "Health and Hygiene" },
      { id: "materials-c2", name: "Materials Around Us" },
      { id: "light-dark-c2", name: "Light, Dark and Shadow" }
    ],
    ENGLISH: [
      { id: "verbs-basic-c2", name: "Action Words (Verbs)" },
      { id: "adjectives-basic-c2", name: "Describing Words (Adjectives)" },
      { id: "prepositions-basic-c2", name: "In, On, Under (Prepositions)" },
      { id: "articles-c2", name: "A, An, The (Articles)" },
      { id: "punctuation-basic-c2", name: "Capital Letters & Full Stop" },
      { id: "question-words-c2", name: "Question Words (What, Where, Who)" }
    ],
    EVS: [
      { id: "plant-life-c2", name: "Types of Plants" },
      { id: "animal-world-c2", name: "Useful Animals" },
      { id: "cleanliness-c2", name: "Cleanliness & Good Habits" },
      { id: "safety-rules-c2", name: "Safety First" },
      { id: "water-c2", name: "Water — Uses and Conservation" },
      { id: "festivals-c2", name: "Our Festivals" }
    ],
    HINDI: [
      { id: "rimjhim-2-ch1", name: "ऊँट चला" },
      { id: "rimjhim-2-ch2", name: "भालू ने खेली फुटबॉल" },
      { id: "rimjhim-2-ch3", name: "म्याऊँ, म्याऊँ!!" },
      { id: "rimjhim-2-ch4", name: "अधिक बलवान कौन?" },
      { id: "rimjhim-2-ch5", name: "दोस्त की मदद" },
      { id: "rimjhim-2-ch6", name: "बहुत हुआ" },
      { id: "hindi-vy-c2", name: "हिन्दी व्याकरण (वाक्य, शब्द)" }
    ],
    SST: []
  },

  // ────────────────────────────────────────────────────────
  //  CLASS 3
  // ────────────────────────────────────────────────────────
  "Class 3": {
    MATH: [
      { id: "where-to-look-c3", name: "Where to Look From" },
      { id: "fun-numbers-c3", name: "Fun with Numbers" },
      { id: "give-and-take-c3", name: "Give and Take" },
      { id: "long-short-c3", name: "Long and Short" },
      { id: "shapes-designs-c3", name: "Shapes and Designs" },
      { id: "fun-give-take-c3", name: "Fun with Give and Take" },
      { id: "time-goes-on-c3", name: "Time Goes On" },
      { id: "who-is-heavier-c3", name: "Who is Heavier?" },
      { id: "how-many-times-c3", name: "How Many Times?" },
      { id: "play-with-patterns-c3", name: "Play with Patterns" },
      { id: "jugs-mugs-c3", name: "Jugs and Mugs" },
      { id: "can-we-share-c3", name: "Can We Share?" },
      { id: "smart-charts-c3", name: "Smart Charts" },
      { id: "rupees-paise-c3", name: "Rupees and Paise" }
    ],
    SCIENCE: [
      { id: "living-nonliving-c3", name: "Living and Non-Living Things" },
      { id: "plants-parts-c3", name: "Plants: Parts and Functions" },
      { id: "animals-habitat-c3", name: "Animals: Habitat and Food" },
      { id: "human-body-c3", name: "Human Body: Organs and Senses" },
      { id: "food-nutrition-c3", name: "Food and Nutrition" },
      { id: "water-uses-c3", name: "Water: Properties and Uses" },
      { id: "air-weather-c3", name: "Air and Weather" },
      { id: "soil-rocks-c3", name: "Soil and Rocks" }
    ],
    ENGLISH: [
      { id: "nouns-proper-c3", name: "Common and Proper Nouns" },
      { id: "pronouns-gender-c3", name: "Pronouns & Gender" },
      { id: "conjunctions-c3", name: "And, But, Or (Conjunctions)" },
      { id: "sentences-c3", name: "Subject and Predicate" },
      { id: "tenses-c3", name: "Present, Past & Future Tense (Basic)" },
      { id: "punctuation-c3", name: "Punctuation — Comma, Question Mark" },
      { id: "comprehension-c3", name: "Reading Comprehension (Simple)" }
    ],
    EVS: [
      { id: "poonams-day-c3", name: "Poonam's Day Out" },
      { id: "plant-fairy-c3", name: "The Plant Fairy" },
      { id: "water-o-water-c3", name: "Water O' Water" },
      { id: "our-first-school-c3", name: "Our First School (Family)" },
      { id: "chhotus-house-c3", name: "Chhotu's House" },
      { id: "foods-eat-c3", name: "Foods We Eat" },
      { id: "saying-without-c3", name: "Saying without Speaking" },
      { id: "flying-high-c3", name: "Flying High (Birds)" },
      { id: "its-raining-c3", name: "It's Raining (Water Cycle)" },
      { id: "what-is-cooking-c3", name: "What is Cooking?" },
      { id: "from-here-there-c3", name: "From Here to There (Transport)" },
      { id: "work-we-do-c3", name: "Work We Do" },
      { id: "sharing-feelings-c3", name: "Sharing Our Feelings" },
      { id: "making-pots-c3", name: "Making Pots" },
      { id: "games-play-c3", name: "Games We Play" },
      { id: "drop-by-drop-c3", name: "Drop by Drop (Water Conservation)" },
      { id: "beautiful-cloth-c3", name: "A Beautiful Cloth (Textiles)" },
      { id: "web-of-life-c3", name: "Web of Life (Interdependence)" }
    ],
    HINDI: [
      { id: "rimjhim-3-ch1", name: "कक्कू" },
      { id: "rimjhim-3-ch2", name: "शेखीबाज़ मक्खी" },
      { id: "rimjhim-3-ch3", name: "चाँद वाली अम्मा" },
      { id: "rimjhim-3-ch4", name: "मन करता है" },
      { id: "rimjhim-3-ch5", name: "बहादुर बित्तो" },
      { id: "rimjhim-3-ch6", name: "हमसे सब कहते" },
      { id: "rimjhim-3-ch7", name: "टिपटिपवा" },
      { id: "rimjhim-3-ch8", name: "बंदर बाँट" },
      { id: "rimjhim-3-ch9", name: "अक्ल बड़ी या भैंस" },
      { id: "rimjhim-3-ch10", name: "क्योंकर मैं माऊँ" },
      { id: "hindi-vy-c3", name: "व्याकरण — संज्ञा, सर्वनाम, क्रिया" }
    ],
    SST: []
  },

  // ────────────────────────────────────────────────────────
  //  CLASS 4
  // ────────────────────────────────────────────────────────
  "Class 4": {
    MATH: [
      { id: "building-bricks-c4", name: "Building with Bricks" },
      { id: "long-short-c4", name: "Long and Short" },
      { id: "trip-bhopal-c4", name: "A Trip to Bhopal" },
      { id: "tick-tick-c4", name: "Tick-Tick-Tick (Time)" },
      { id: "the-way-world-c4", name: "The Way the World Looks" },
      { id: "junk-seller-c4", name: "The Junk Seller (Money)" },
      { id: "jugs-mugs-c4", name: "Jugs and Mugs" },
      { id: "carts-wheels-c4", name: "Carts and Wheels" },
      { id: "halves-quarters-c4", name: "Halves and Quarters" },
      { id: "play-patterns-c4", name: "Play with Patterns" },
      { id: "tables-shares-c4", name: "Tables and Shares" },
      { id: "how-heavy-c4", name: "How Heavy? How Light?" },
      { id: "fields-fences-c4", name: "Fields and Fences" },
      { id: "smart-charts-c4", name: "Smart Charts" }
    ],
    SCIENCE: [
      { id: "plant-life-c4", name: "Plant Life: Reproduction and Growth" },
      { id: "animal-adaptations-c4", name: "Animal Adaptations" },
      { id: "human-body-c4", name: "Human Body: Skeleton, Muscles and Joints" },
      { id: "food-digestion-c4", name: "Food and Digestion" },
      { id: "matter-materials-c4", name: "Matter and Materials (Solids, Liquids, Gases)" },
      { id: "force-work-c4", name: "Force, Work and Energy (Basic)" },
      { id: "simple-machines-c4", name: "Simple Machines" },
      { id: "natural-resources-c4", name: "Natural Resources and Conservation" }
    ],
    ENGLISH: [
      { id: "adverbs-c4", name: "How and When Words (Adverbs)" },
      { id: "prepositions-c4", name: "Prepositions of Place & Time" },
      { id: "tenses-present-past-c4", name: "Simple Present & Simple Past Tense" },
      { id: "future-tense-c4", name: "Simple Future Tense (Will/Shall)" },
      { id: "determiners-c4", name: "Determiners (This, That, These, Those)" },
      { id: "letter-writing-c4", name: "Letter Writing (Informal)" },
      { id: "comprehension-c4", name: "Reading Comprehension" }
    ],
    EVS: [
      { id: "going-school-c4", name: "Going to School" },
      { id: "ear-to-ear-c4", name: "Ear to Ear (Senses)" },
      { id: "day-with-nandu-c4", name: "A Day with Nandu" },
      { id: "amritas-story-c4", name: "The Story of Amrita" },
      { id: "anita-honeybees-c4", name: "Anita and the Honeybees" },
      { id: "omanas-journey-c4", name: "Omana's Journey" },
      { id: "from-the-window-c4", name: "From the Window (Plants)" },
      { id: "reaching-grandma-c4", name: "Reaching Grandmother's House" },
      { id: "changing-families-c4", name: "Changing Families" },
      { id: "valley-of-flowers-c4", name: "The Valley of Flowers" },
      { id: "basvas-farm-c4", name: "Basva's Farm" },
      { id: "market-to-home-c4", name: "From Market to Home (Food)" },
      { id: "busy-month-c4", name: "A Busy Month (Seasons)" },
      { id: "too-much-water-c4", name: "Too Much Water Too Little Water" },
      { id: "eating-together-c4", name: "Eating Together" },
      { id: "pochampalli-c4", name: "Pochampalli (Weaving)" }
    ],
    HINDI: [
      { id: "rimjhim-4-ch1", name: "मन के भोले-भाले बादल" },
      { id: "rimjhim-4-ch2", name: "जैसा सवाल वैसा जवाब" },
      { id: "rimjhim-4-ch3", name: "किरमिच की गेंद" },
      { id: "rimjhim-4-ch4", name: "पापा जब बच्चे थे" },
      { id: "rimjhim-4-ch5", name: "दोस्त की पोशाक" },
      { id: "rimjhim-4-ch6", name: "नाव बनाओ नाव बनाओ" },
      { id: "rimjhim-4-ch7", name: "दान का हिसाब" },
      { id: "rimjhim-4-ch8", name: "कौन?" },
      { id: "rimjhim-4-ch9", name: "स्वतंत्रता की ओर" },
      { id: "rimjhim-4-ch10", name: "थप्प रोटी थप्प दाल" },
      { id: "hindi-vy-c4", name: "व्याकरण — विशेषण, विलोम, पर्यायवाची" }
    ],
    SST: []
  },

  // ────────────────────────────────────────────────────────
  //  CLASS 5
  // ────────────────────────────────────────────────────────
  "Class 5": {
    MATH: [
      { id: "fish-tale-c5", name: "The Fish Tale" },
      { id: "shapes-angles-c5", name: "Shapes and Angles" },
      { id: "how-many-squares-c5", name: "How Many Squares?" },
      { id: "parts-wholes-c5", name: "Parts and Wholes (Fractions)" },
      { id: "does-look-same-c5", name: "Does it Look the Same? (Symmetry)" },
      { id: "be-my-multiple-c5", name: "Be My Multiple, I'll be Your Factor" },
      { id: "can-you-see-pattern-c5", name: "Can You See the Pattern?" },
      { id: "mapping-way-c5", name: "Mapping Your Way" },
      { id: "tenths-hundredths-c5", name: "Tenths and Hundredths (Decimals)" },
      { id: "area-boundary-c5", name: "Area and its Boundary" },
      { id: "smart-charts-c5", name: "Smart Charts" },
      { id: "ways-multiply-c5", name: "Ways to Multiply and Divide" },
      { id: "how-big-heavy-c5", name: "How Big? How Heavy?" }
    ],
    SCIENCE: [
      { id: "human-body-systems-c5", name: "Human Body: Circulatory and Respiratory Systems" },
      { id: "reproduction-c5", name: "Reproduction in Plants and Animals" },
      { id: "microorganisms-c5", name: "Microorganisms: Friend and Foe (Basic)" },
      { id: "adaptation-plants-c5", name: "Adaptation in Plants" },
      { id: "food-chains-c5", name: "Food Chains and Webs" },
      { id: "natural-disasters-c5", name: "Natural Disasters and Safety" },
      { id: "pollution-c5", name: "Pollution and Environment" },
      { id: "solar-system-c5", name: "Solar System and Space" }
    ],
    ENGLISH: [
      { id: "tenses-perfect-c5", name: "Present & Past Perfect Tense" },
      { id: "active-passive-c5", name: "Active and Passive Voice (Basic)" },
      { id: "conjunctions-c5", name: "Because, Although, If (Conjunctions)" },
      { id: "reported-speech-c5", name: "Reported Speech (Basic)" },
      { id: "paragraph-writing-c5", name: "Paragraph Writing" },
      { id: "story-writing-c5", name: "Story Writing" },
      { id: "comprehension-c5", name: "Reading Comprehension" }
    ],
    EVS: [
      { id: "super-senses-c5", name: "Super Senses" },
      { id: "snake-charmer-c5", name: "A Snake Charmer's Story" },
      { id: "tasting-digesting-c5", name: "From Tasting to Digesting" },
      { id: "mangoes-round-c5", name: "Mangoes Round the Year" },
      { id: "seeds-and-seeds-c5", name: "Seeds and Seeds" },
      { id: "every-drop-counts-c5", name: "Every Drop Counts" },
      { id: "experiments-water-c5", name: "Experiments with Water" },
      { id: "treat-mosquitoes-c5", name: "A Treat for Mosquitoes (Diseases)" },
      { id: "up-you-go-c5", name: "Up You Go! (Mountaineering)" },
      { id: "walls-tell-stories-c5", name: "Walls Tell Stories (Heritage)" },
      { id: "sunita-space-c5", name: "Sunita in Space" },
      { id: "what-if-finishes-c5", name: "What if it Finishes? (Resources)" },
      { id: "shelter-so-high-c5", name: "A Shelter so High (Adaptation)" },
      { id: "when-earth-shook-c5", name: "When the Earth Shook! (Earthquakes)" },
      { id: "blow-hot-cold-c5", name: "Blow Hot, Blow Cold (Air)" },
      { id: "across-the-wall-c5", name: "Across the Wall (Gender)" },
      { id: "whose-forests-c5", name: "Whose Forests? (Environment)" },
      { id: "on-the-move-c5", name: "On the Move Again (Migration)" }
    ],
    HINDI: [
      { id: "rimjhim-5-ch1", name: "राख की रस्सी" },
      { id: "rimjhim-5-ch2", name: "फसलों के त्योहार" },
      { id: "rimjhim-5-ch3", name: "खिलौनेवाला" },
      { id: "rimjhim-5-ch4", name: "नन्हा फनकार" },
      { id: "rimjhim-5-ch5", name: "जहाँ चाह वहाँ राह" },
      { id: "rimjhim-5-ch6", name: "चिट्ठी का सफर" },
      { id: "rimjhim-5-ch7", name: "डाकिए की कहानी, कंवरसिंह की जुबानी" },
      { id: "rimjhim-5-ch8", name: "वे दिन भी क्या दिन थे" },
      { id: "rimjhim-5-ch9", name: "एक माँ की बेबसी" },
      { id: "rimjhim-5-ch10", name: "एक दिन की बादशाहत" },
      { id: "hindi-vy-c5", name: "व्याकरण — मुहावरे, अनेकार्थी, अपठित गद्यांश" }
    ],
    SST: []
  },

  // ────────────────────────────────────────────────────────
  //  CLASS 6
  // ────────────────────────────────────────────────────────
  "Class 6": {
    MATH: [
      { id: "knowing-numbers-c6", name: "Knowing Our Numbers" },
      { id: "whole-numbers-c6", name: "Whole Numbers" },
      { id: "playing-numbers-c6", name: "Playing with Numbers (HCF, LCM)" },
      { id: "basic-geometry-c6", name: "Basic Geometrical Ideas" },
      { id: "elementary-shapes-c6", name: "Understanding Elementary Shapes" },
      { id: "integers-c6", name: "Integers" },
      { id: "fractions-c6", name: "Fractions" },
      { id: "decimals-c6", name: "Decimals" },
      { id: "data-handling-c6", name: "Data Handling" },
      { id: "mensuration-c6", name: "Mensuration" },
      { id: "algebra-c6", name: "Algebra (Introduction)" },
      { id: "ratio-proportion-c6", name: "Ratio and Proportion" },
      { id: "symmetry-c6", name: "Symmetry" },
      { id: "practical-geometry-c6", name: "Practical Geometry" }
    ],
    SCIENCE: [
      { id: "food-where-c6", name: "Food: Where Does It Come From?" },
      { id: "components-food-c6", name: "Components of Food" },
      { id: "fibre-fabric-c6", name: "Fibre to Fabric" },
      { id: "sorting-materials-c6", name: "Sorting Materials into Groups" },
      { id: "separation-substances-c6", name: "Separation of Substances" },
      { id: "changes-around-c6", name: "Changes Around Us" },
      { id: "getting-plants-c6", name: "Getting to Know Plants" },
      { id: "body-movements-c6", name: "Body Movements" },
      { id: "living-organisms-c6", name: "The Living Organisms & Their Surroundings" },
      { id: "motion-measurement-c6", name: "Motion and Measurement of Distances" },
      { id: "light-shadows-c6", name: "Light, Shadows and Reflections" },
      { id: "electricity-circuits-c6", name: "Electricity and Circuits" },
      { id: "fun-with-magnets-c6", name: "Fun with Magnets" },
      { id: "water-c6", name: "Water" },
      { id: "air-around-c6", name: "Air Around Us" },
      { id: "garbage-in-out-c6", name: "Garbage In, Garbage Out" }
    ],
    ENGLISH: [
      { id: "nouns-abstract-c6", name: "Abstract & Collective Nouns" },
      { id: "pronouns-relative-c6", name: "Relative Pronouns" },
      { id: "tenses-continuous-c6", name: "Continuous Tenses" },
      { id: "modals-c6", name: "Modal Auxiliaries (Can, Should, Must)" },
      { id: "active-passive-c6", name: "Active and Passive Voice" },
      { id: "reported-speech-c6", name: "Reported Speech" },
      { id: "formal-letter-c6", name: "Formal Letter Writing" },
      { id: "essay-writing-c6", name: "Essay Writing" },
      { id: "comprehension-c6", name: "Unseen Passage Comprehension" }
    ],
    EVS: [],
    HINDI: [
      { id: "vasant-6-ch1", name: "वह चिड़िया जो (Poem)" },
      { id: "vasant-6-ch2", name: "बचपन" },
      { id: "vasant-6-ch3", name: "नादान दोस्त" },
      { id: "vasant-6-ch4", name: "चाँद से थोड़ी सी गप्पें (Poem)" },
      { id: "vasant-6-ch5", name: "अक्षरों का महत्व" },
      { id: "vasant-6-ch6", name: "पार नज़र के" },
      { id: "vasant-6-ch7", name: "साथी हाथ बढ़ाना (Poem)" },
      { id: "vasant-6-ch8", name: "ऐसे–ऐसे" },
      { id: "vasant-6-ch9", name: "टिकट अलबम" },
      { id: "vasant-6-ch10", name: "झाँसी की रानी (Poem)" },
      { id: "vasant-6-ch11", name: "जो देखकर भी नहीं देखते" },
      { id: "vasant-6-ch12", name: "संसार पुस्तक है" },
      { id: "hindi-vy-c6", name: "व्याकरण — संधि, समास, मुहावरे, अलंकार" }
    ],
    SST: [
      { id: "hist-6-what-where", name: "History: What, Where, How and When?" },
      { id: "hist-6-earliest-people", name: "History: On the Trail of the Earliest People" },
      { id: "hist-6-gathering-growing", name: "History: From Gathering to Growing Food" },
      { id: "hist-6-earliest-cities", name: "History: In the Earliest Cities (Harappan)" },
      { id: "hist-6-books-burials", name: "History: What Books and Burials Tell Us (Vedic Age)" },
      { id: "hist-6-kingdoms-kings", name: "History: Kingdoms, Kings and an Early Republic" },
      { id: "hist-6-new-questions", name: "History: New Questions and Ideas (Buddhism, Jainism)" },
      { id: "hist-6-ashoka", name: "History: Ashoka, The Emperor Who Gave Up War" },
      { id: "hist-6-vital-villages", name: "History: Vital Villages, Thriving Towns" },
      { id: "hist-6-traders-kings", name: "History: Traders, Kings and Pilgrims" },
      { id: "hist-6-new-empires", name: "History: New Empires and Kingdoms (Guptas)" },
      { id: "hist-6-buildings", name: "History: Buildings, Paintings and Books" },
      { id: "geo-6-solar-system", name: "Geography: The Earth in the Solar System" },
      { id: "geo-6-globe-latitudes", name: "Geography: Globe — Latitudes and Longitudes" },
      { id: "geo-6-motions-earth", name: "Geography: Motions of the Earth" },
      { id: "geo-6-maps", name: "Geography: Maps" },
      { id: "geo-6-major-domains", name: "Geography: Major Domains of the Earth" },
      { id: "geo-6-major-landforms", name: "Geography: Major Landforms of the Earth" },
      { id: "geo-6-india", name: "Geography: Our Country — India" },
      { id: "geo-6-india-climate", name: "Geography: India — Climate, Vegetation and Wildlife" },
      { id: "civ-6-diversity", name: "Civics: Understanding Diversity" },
      { id: "civ-6-government", name: "Civics: What is Government?" },
      { id: "civ-6-democratic-govt", name: "Civics: Key Elements of a Democratic Government" },
      { id: "civ-6-panchayati-raj", name: "Civics: Panchayati Raj" },
      { id: "civ-6-rural-admin", name: "Civics: Rural Administration" },
      { id: "civ-6-urban-admin", name: "Civics: Urban Administration" },
      { id: "civ-6-livelihoods", name: "Civics: Rural & Urban Livelihoods" }
    ]
  },

  // ────────────────────────────────────────────────────────
  //  CLASS 7
  // ────────────────────────────────────────────────────────
  "Class 7": {
    MATH: [
      { id: "integers-c7", name: "Integers" },
      { id: "fractions-decimals-c7", name: "Fractions and Decimals" },
      { id: "data-handling-c7", name: "Data Handling" },
      { id: "simple-equations-c7", name: "Simple Equations" },
      { id: "lines-angles-c7", name: "Lines and Angles" },
      { id: "triangle-properties-c7", name: "The Triangle and its Properties" },
      { id: "congruence-triangles-c7", name: "Congruence of Triangles" },
      { id: "comparing-quantities-c7", name: "Comparing Quantities (%, Profit & Loss)" },
      { id: "rational-numbers-c7", name: "Rational Numbers" },
      { id: "practical-geometry-c7", name: "Practical Geometry" },
      { id: "perimeter-area-c7", name: "Perimeter and Area" },
      { id: "algebraic-expressions-c7", name: "Algebraic Expressions" },
      { id: "exponents-powers-c7", name: "Exponents and Powers" },
      { id: "symmetry-c7", name: "Symmetry" },
      { id: "visualising-solid-c7", name: "Visualising Solid Shapes" }
    ],
    SCIENCE: [
      { id: "nutrition-plants-c7", name: "Nutrition in Plants" },
      { id: "nutrition-animals-c7", name: "Nutrition in Animals" },
      { id: "fibre-fabric-c7", name: "Fibre to Fabric" },
      { id: "heat-c7", name: "Heat" },
      { id: "acids-bases-salts-c7", name: "Acids, Bases and Salts" },
      { id: "physical-chemical-c7", name: "Physical and Chemical Changes" },
      { id: "weather-climate-c7", name: "Weather, Climate and Adaptations of Animals" },
      { id: "winds-storms-c7", name: "Winds, Storms and Cyclones" },
      { id: "soil-c7", name: "Soil" },
      { id: "respiration-c7", name: "Respiration in Organisms" },
      { id: "transportation-c7", name: "Transportation in Animals and Plants" },
      { id: "reproduction-plants-c7", name: "Reproduction in Plants" },
      { id: "motion-time-c7", name: "Motion and Time" },
      { id: "electric-current-c7", name: "Electric Current and its Effects" },
      { id: "light-c7", name: "Light" },
      { id: "water-precious-c7", name: "Water: A Precious Resource" },
      { id: "forests-lifeline-c7", name: "Forests: Our Lifeline" },
      { id: "wastewater-c7", name: "Wastewater Story" }
    ],
    ENGLISH: [
      { id: "reported-speech-c7", name: "Direct and Indirect Speech" },
      { id: "transitive-c7", name: "Transitive and Intransitive Verbs" },
      { id: "conditionals-c7", name: "If Conditionals (Type 1 & 2)" },
      { id: "gerunds-c7", name: "Gerunds and Infinitives" },
      { id: "clauses-c7", name: "Clauses — Main and Subordinate" },
      { id: "essay-c7", name: "Essay & Paragraph Writing" },
      { id: "notice-writing-c7", name: "Notice Writing" },
      { id: "comprehension-c7", name: "Unseen Passage Comprehension" }
    ],
    EVS: [],
    HINDI: [
      { id: "vasant-7-ch1", name: "हम पंछी उन्मुक्त गगन के (Poem)" },
      { id: "vasant-7-ch2", name: "दादी माँ" },
      { id: "vasant-7-ch3", name: "हिमालय की बेटियाँ" },
      { id: "vasant-7-ch4", name: "कठपुतली (Poem)" },
      { id: "vasant-7-ch5", name: "मिठाईवाला" },
      { id: "vasant-7-ch6", name: "रक्त और हमारा शरीर" },
      { id: "vasant-7-ch7", name: "पापा खो गए (Play)" },
      { id: "vasant-7-ch8", name: "शाम — एक किसान (Poem)" },
      { id: "vasant-7-ch9", name: "चिड़िया की बच्ची" },
      { id: "vasant-7-ch10", name: "अपूर्व अनुभव" },
      { id: "vasant-7-ch11", name: "रहीम के दोहे (Poem)" },
      { id: "vasant-7-ch12", name: "कंचा" },
      { id: "vasant-7-ch13", name: "एक तिनका (Poem)" },
      { id: "vasant-7-ch14", name: "खानपान की बदलती तस्वीर" },
      { id: "vasant-7-ch15", name: "नींलकंठ" },
      { id: "hindi-vy-c7", name: "व्याकरण — उपसर्ग, प्रत्यय, वाक्य-रचना, अपठित" }
    ],
    SST: [
      { id: "hist-7-tracing-changes", name: "History: Tracing Changes Through a Thousand Years" },
      { id: "hist-7-new-kings", name: "History: New Kings and Kingdoms" },
      { id: "hist-7-delhi-sultans", name: "History: The Delhi Sultans" },
      { id: "hist-7-mughal-empire", name: "History: The Mughal Empire" },
      { id: "hist-7-rulers-buildings", name: "History: Rulers and Buildings (Architecture)" },
      { id: "hist-7-towns-traders", name: "History: Towns, Traders and Craftspersons" },
      { id: "hist-7-tribes-nomads", name: "History: Tribes, Nomads and Settled Communities" },
      { id: "hist-7-devotional-paths", name: "History: Devotional Paths — Bhakti & Sufi" },
      { id: "hist-7-regional-cultures", name: "History: The Making of Regional Cultures" },
      { id: "hist-7-eighteenth-century", name: "History: Eighteenth-Century Political Formations" },
      { id: "geo-7-environment", name: "Geography: Environment" },
      { id: "geo-7-inside-earth", name: "Geography: Inside Our Earth" },
      { id: "geo-7-changing-earth", name: "Geography: Our Changing Earth" },
      { id: "geo-7-air", name: "Geography: Air" },
      { id: "geo-7-water", name: "Geography: Water" },
      { id: "geo-7-natural-vegetation", name: "Geography: Natural Vegetation and Wildlife" },
      { id: "geo-7-human-settlement", name: "Geography: Human Environment — Settlement, Transport" },
      { id: "geo-7-human-interaction", name: "Geography: Human–Environment Interaction (Tropics)" },
      { id: "geo-7-temperate", name: "Geography: Life in Temperate Grasslands" },
      { id: "geo-7-deserts", name: "Geography: Life in Deserts" },
      { id: "civ-7-equality", name: "Civics: On Equality" },
      { id: "civ-7-health", name: "Civics: Role of the Government in Health" },
      { id: "civ-7-state-govt", name: "Civics: How the State Government Works" },
      { id: "civ-7-growing-up", name: "Civics: Growing Up as Boys and Girls" },
      { id: "civ-7-women-change", name: "Civics: Women Change the World" },
      { id: "civ-7-media", name: "Civics: Understanding Media" },
      { id: "civ-7-markets", name: "Civics: Markets Around Us" },
      { id: "civ-7-market-chain", name: "Civics: A Shirt in the Market" }
    ]
  },

  // ────────────────────────────────────────────────────────
  //  CLASS 8
  // ────────────────────────────────────────────────────────
  "Class 8": {
    MATH: [
      { id: "rational-numbers-c8", name: "Rational Numbers" },
      { id: "linear-equations-c8", name: "Linear Equations in One Variable" },
      { id: "understanding-quad-c8", name: "Understanding Quadrilaterals" },
      { id: "practical-geometry-c8", name: "Practical Geometry" },
      { id: "data-handling-c8", name: "Data Handling" },
      { id: "squares-roots-c8", name: "Squares and Square Roots" },
      { id: "cubes-roots-c8", name: "Cubes and Cube Roots" },
      { id: "comparing-quantities-c8", name: "Comparing Quantities (Interest, Discount)" },
      { id: "algebraic-expressions-c8", name: "Algebraic Expressions and Identities" },
      { id: "visualising-solid-c8", name: "Visualising Solid Shapes" },
      { id: "mensuration-c8", name: "Mensuration" },
      { id: "exponents-powers-c8", name: "Exponents and Powers" },
      { id: "direct-inverse-c8", name: "Direct and Inverse Proportions" },
      { id: "factorisation-c8", name: "Factorisation" },
      { id: "intro-graphs-c8", name: "Introduction to Graphs" },
      { id: "playing-numbers-c8", name: "Playing with Numbers" }
    ],
    SCIENCE: [
      { id: "crop-production-c8", name: "Crop Production and Management" },
      { id: "microorganisms-c8", name: "Microorganisms: Friend and Foe" },
      { id: "synthetic-fibres-c8", name: "Synthetic Fibres and Plastics" },
      { id: "metals-nonmetals-c8", name: "Materials: Metals and Non-Metals" },
      { id: "coal-petroleum-c8", name: "Coal and Petroleum" },
      { id: "combustion-flame-c8", name: "Combustion and Flame" },
      { id: "conservation-plants-c8", name: "Conservation of Plants and Animals" },
      { id: "cell-structure-c8", name: "Cell — Structure and Functions" },
      { id: "reproduction-animals-c8", name: "Reproduction in Animals" },
      { id: "adolescence-c8", name: "Reaching the Age of Adolescence" },
      { id: "force-pressure-c8", name: "Force and Pressure" },
      { id: "friction-c8", name: "Friction" },
      { id: "sound-c8", name: "Sound" },
      { id: "chemical-effects-c8", name: "Chemical Effects of Electric Current" },
      { id: "natural-phenomena-c8", name: "Some Natural Phenomena (Lightning, Earthquakes)" },
      { id: "light-c8", name: "Light" },
      { id: "stars-solar-c8", name: "Stars and the Solar System" },
      { id: "pollution-c8", name: "Pollution of Air and Water" }
    ],
    ENGLISH: [
      { id: "active-passive-c8", name: "Active and Passive Voice (Advanced)" },
      { id: "subject-verb-c8", name: "Subject-Verb Agreement" },
      { id: "prepositional-phrases-c8", name: "Prepositional Phrases & Idioms" },
      { id: "conditionals-c8", name: "Conditionals (All Types)" },
      { id: "clauses-c8", name: "Relative Clauses & Noun Clauses" },
      { id: "formal-letter-c8", name: "Formal Letter & Email Writing" },
      { id: "debate-speech-c8", name: "Debate & Speech Writing" },
      { id: "comprehension-c8", name: "Unseen Passage Comprehension" }
    ],
    EVS: [],
    HINDI: [
      { id: "vasant-8-ch1", name: "ध्वनि (Poem)" },
      { id: "vasant-8-ch2", name: "लाख की चूड़ियाँ" },
      { id: "vasant-8-ch3", name: "बस की यात्रा" },
      { id: "vasant-8-ch4", name: "दीवानों की हस्ती (Poem)" },
      { id: "vasant-8-ch5", name: "चिट्ठियों की अनूठी दुनिया" },
      { id: "vasant-8-ch6", name: "भगवान के डाकिए (Poem)" },
      { id: "vasant-8-ch7", name: "क्या निराश हुआ जाए" },
      { id: "vasant-8-ch8", name: "यह सबसे कठिन समय नहीं (Poem)" },
      { id: "vasant-8-ch9", name: "कबीर की साखियाँ (Poem)" },
      { id: "vasant-8-ch10", name: "कामचोर" },
      { id: "vasant-8-ch11", name: "जब सिनेमा ने बोलना सीखा" },
      { id: "vasant-8-ch12", name: "सुदामा चरित (Poem)" },
      { id: "vasant-8-ch13", name: "जहाँ पहिया है" },
      { id: "vasant-8-ch14", name: "अकबरी लोटा" },
      { id: "vasant-8-ch15", name: "सूरदास के पद (Poem)" },
      { id: "vasant-8-ch16", name: "पानी की कहानी" },
      { id: "vasant-8-ch17", name: "बाज और साँप" },
      { id: "vasant-8-ch18", name: "टोपी" },
      { id: "hindi-vy-c8", name: "व्याकरण — रस, छन्द, अलंकार, पत्र-लेखन, निबन्ध" }
    ],
    SST: [
      { id: "hist-8-how-when-where", name: "History: How, When and Where" },
      { id: "hist-8-trade-colonialism", name: "History: From Trade to Territory (Company Rule)" },
      { id: "hist-8-ruling-countryside", name: "History: Ruling the Countryside" },
      { id: "hist-8-tribals-dikus", name: "History: Tribals, Dikus and a Golden Age" },
      { id: "hist-8-people-rebel", name: "History: When People Rebel — 1857" },
      { id: "hist-8-weavers", name: "History: Weavers, Iron Smelters and Factory Owners" },
      { id: "hist-8-civilising", name: "History: Civilising the 'Native', Educating the Nation" },
      { id: "hist-8-women-caste", name: "History: Women, Caste and Reform" },
      { id: "hist-8-national-movement", name: "History: The Making of the National Movement" },
      { id: "hist-8-after-independence", name: "History: India After Independence" },
      { id: "geo-8-resources", name: "Geography: Resources" },
      { id: "geo-8-land-soil-water", name: "Geography: Land, Soil, Water, Natural Vegetation" },
      { id: "geo-8-mineral-power", name: "Geography: Mineral and Power Resources" },
      { id: "geo-8-agriculture", name: "Geography: Agriculture" },
      { id: "geo-8-industries", name: "Geography: Industries" },
      { id: "geo-8-human-resources", name: "Geography: Human Resources" },
      { id: "civ-8-constitution", name: "Civics: The Indian Constitution" },
      { id: "civ-8-secularism", name: "Civics: Understanding Secularism" },
      { id: "civ-8-parliament", name: "Civics: Why Do We Need a Parliament?" },
      { id: "civ-8-laws", name: "Civics: Understanding Laws" },
      { id: "civ-8-judiciary", name: "Civics: Judiciary" },
      { id: "civ-8-marginalisation", name: "Civics: Understanding Marginalisation" },
      { id: "civ-8-confronting", name: "Civics: Confronting Marginalisation" },
      { id: "civ-8-public-facilities", name: "Civics: Public Facilities" },
      { id: "civ-8-social-justice", name: "Civics: Law and Social Justice" }
    ]
  }
};
