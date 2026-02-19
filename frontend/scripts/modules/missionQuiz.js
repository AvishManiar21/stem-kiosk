import { MassiveQuestionLoader } from './massiveQuestionLoader.js';
import { saveScore, updateStatistics } from '../storage.js';

const QUESTIONS_PER_MISSION = 10;

const QUESTIONS = [
  {
    prompt: "Which scientist described gravity as a universal force?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Niels Bohr"],
    answer: 0,
    fact: "Isaac Newton published the law of universal gravitation in 1687.",
  },
  {
    prompt: "What is the approximate acceleration due to gravity on Earth at sea level?",
    options: ["1.6 m/s^2", "3.7 m/s^2", "9.8 m/s^2", "24.8 m/s^2"],
    answer: 2,
    fact: "Earth's gravitational acceleration averages 9.8 meters per second squared.",
  },
  {
    prompt: "Which subatomic particle carries a negative electric charge?",
    options: ["Proton", "Electron", "Neutron", "Photon"],
    answer: 1,
    fact: "Electrons orbit atomic nuclei and hold a negative charge.",
  },
  {
    prompt: "What wave phenomenon causes a siren's pitch to change as it passes?",
    options: ["Interference", "Doppler effect", "Polarization", "Diffraction"],
    answer: 1,
    fact: "The Doppler effect shifts frequency because the source and observer move relative to each other.",
  },
  {
    prompt: "Which energy source is considered nonrenewable?",
    options: ["Solar", "Wind", "Coal", "Hydroelectric"],
    answer: 2,
    fact: "Coal forms over millions of years and cannot be replenished on human timescales.",
  },
  {
    prompt: "What does LED stand for?",
    options: ["Light Emitting Diode", "Low Energy Device", "Linear Emission Display", "Light Energy Driver"],
    answer: 0,
    fact: "Light emitting diodes produce light when current flows in the forward direction.",
  },
  {
    prompt: "Which chemical bond involves sharing electron pairs?",
    options: ["Ionic", "Metallic", "Covalent", "Hydrogen"],
    answer: 2,
    fact: "Covalent bonds share electrons so atoms can complete their valence shells.",
  },
  {
    prompt: "Which gas do plants release during photosynthesis?",
    options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Methane"],
    answer: 1,
    fact: "Plants convert carbon dioxide into oxygen using sunlight in their chloroplasts.",
  },
  {
    prompt: "What organ pumps blood throughout the human body?",
    options: ["Lungs", "Heart", "Kidneys", "Liver"],
    answer: 1,
    fact: "The heart's muscular chambers push oxygenated blood to every tissue.",
  },
  {
    prompt: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    answer: 1,
    fact: "Iron oxide on Mars gives its soil and sky a reddish appearance.",
  },
  {
    prompt: "What unit measures electrical resistance?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    answer: 2,
    fact: "The ohm measures how strongly a material resists electrical current.",
  },
  {
    prompt: "Which scientist formulated the laws of planetary motion?",
    options: ["Nicolaus Copernicus", "Johannes Kepler", "Tycho Brahe", "Henrietta Leavitt"],
    answer: 1,
    fact: "Johannes Kepler described elliptical orbits in the early 1600s.",
  },
  {
    prompt: "What is the chemical symbol for gold?",
    options: ["Au", "Ag", "Fe", "Pt"],
    answer: 0,
    fact: "Gold's symbol Au comes from its Latin name aurum.",
  },
  {
    prompt: "Which process converts liquid water into vapor?",
    options: ["Condensation", "Sublimation", "Evaporation", "Deposition"],
    answer: 2,
    fact: "Evaporation occurs when water molecules gain enough energy to escape into the air.",
  },
  {
    prompt: "Which organelle generates most ATP in eukaryotic cells?",
    options: ["Mitochondrion", "Nucleus", "Golgi apparatus", "Ribosome"],
    answer: 0,
    fact: "Mitochondria convert nutrients into ATP, the cell's main energy currency.",
  },
  {
    prompt: "What is the main gas found in Earth's atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Argon"],
    answer: 1,
    fact: "Nitrogen makes up about 78 percent of Earth's atmosphere.",
  },
  {
    prompt: "Which scientist developed the theory of special relativity?",
    options: ["Albert Einstein", "Max Planck", "Werner Heisenberg", "Erwin Schrodinger"],
    answer: 0,
    fact: "Albert Einstein published special relativity in 1905, redefining space and time.",
  },
  {
    prompt: "What type of simple machine is a seesaw?",
    options: ["Pulley", "Wheel and axle", "Lever", "Inclined plane"],
    answer: 2,
    fact: "A seesaw pivots around a fulcrum, making it a classic example of a lever.",
  },
  {
    prompt: "Which blood cells fight infections?",
    options: ["Red blood cells", "Platelets", "White blood cells", "Plasma cells"],
    answer: 2,
    fact: "White blood cells attack invading pathogens and coordinate immune responses.",
  },
  {
    prompt: "What is the boiling point of water at standard pressure?",
    options: ["0 C", "50 C", "100 C", "150 C"],
    answer: 2,
    fact: "Pure water boils at 100 degrees Celsius under standard atmospheric pressure.",
  },
  {
    prompt: "Which planet has the most extensive ring system?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    answer: 1,
    fact: "Saturn's icy rings span hundreds of thousands of kilometers.",
  },
  {
    prompt: "What is the chemical formula for table salt?",
    options: ["H2O", "NaCl", "CO2", "KCl"],
    answer: 1,
    fact: "Table salt is made of sodium and chlorine atoms joined in a crystal lattice.",
  },
  {
    prompt: "Which branch of engineering designs bridges and roads?",
    options: ["Civil engineering", "Chemical engineering", "Aerospace engineering", "Biomedical engineering"],
    answer: 0,
    fact: "Civil engineers plan and construct infrastructure such as highways and tunnels.",
  },
  {
    prompt: "What is the pH of a neutral solution at 25 C?",
    options: ["3", "5", "7", "9"],
    answer: 2,
    fact: "A pH of 7 is neutral, meaning hydrogen and hydroxide ions are balanced.",
  },
  {
    prompt: "What device converts mechanical energy into electrical energy?",
    options: ["Transformer", "Generator", "Capacitor", "Rectifier"],
    answer: 1,
    fact: "Generators spin coils through magnetic fields to induce electric current.",
  },
  {
    prompt: "Which vertebrate class do frogs belong to?",
    options: ["Reptiles", "Mammals", "Amphibians", "Fish"],
    answer: 2,
    fact: "Frogs are amphibians, living part of their life in water and part on land.",
  },
  {
    prompt: "What is the smallest unit of an element retaining its properties?",
    options: ["Molecule", "Atom", "Ion", "Crystal"],
    answer: 1,
    fact: "Atoms contain protons, neutrons, and electrons and keep an element's identity.",
  },
  {
    prompt: "Which scientist discovered penicillin?",
    options: ["Alexander Fleming", "Louis Pasteur", "Robert Koch", "Joseph Lister"],
    answer: 0,
    fact: "Alexander Fleming noticed penicillin mold killing bacteria in 1928.",
  },
  {
    prompt: "Which waves travel faster, letting you see lightning before thunder?",
    options: ["Sound waves", "Light waves", "Seismic waves", "Water waves"],
    answer: 1,
    fact: "Light travels far faster than sound, so we see lightning before we hear thunder.",
  },
  {
    prompt: "Which instrument measures atmospheric pressure?",
    options: ["Thermometer", "Barometer", "Hygrometer", "Altimeter"],
    answer: 1,
    fact: "Barometers monitor air pressure, helping meteorologists forecast weather.",
  },
  {
    prompt: "What is the basic unit of heredity?",
    options: ["Chromosome", "Gene", "Protein", "Allele"],
    answer: 1,
    fact: "Genes are DNA segments that code for specific traits or proteins.",
  },
  {
    prompt: "Who created the periodic table?",
    options: ["Antoine Lavoisier", "Dmitri Mendeleev", "Linus Pauling", "Glenn Seaborg"],
    answer: 1,
    fact: "Dmitri Mendeleev arranged elements by atomic mass and properties in 1869.",
  },
  {
    prompt: "What is the main purpose of a catalyst?",
    options: ["Slow reactions", "Speed reactions", "Change reactants", "Absorb energy"],
    answer: 1,
    fact: "Catalysts lower activation energy so reactions happen more quickly.",
  },
  {
    prompt: "Which organ removes carbon dioxide from blood?",
    options: ["Liver", "Kidneys", "Lungs", "Pancreas"],
    answer: 2,
    fact: "The lungs exchange carbon dioxide for oxygen during respiration.",
  },
  {
    prompt: "What is the approximate age of the universe?",
    options: ["4.5 billion years", "9 billion years", "13.8 billion years", "20 billion years"],
    answer: 2,
    fact: "Observations of cosmic background radiation show the universe is about 13.8 billion years old.",
  },
  {
    prompt: "Which process powers the Sun's core?",
    options: ["Nuclear fission", "Combustion", "Nuclear fusion", "Radioactive decay"],
    answer: 2,
    fact: "Hydrogen nuclei fuse into helium in the Sun, releasing vast amounts of energy.",
  },
  {
    prompt: "Which type of circuit has only one path for current?",
    options: ["Parallel circuit", "Series circuit", "Open circuit", "Digital circuit"],
    answer: 1,
    fact: "In a series circuit, all components share the same current path.",
  },
  {
    prompt: "What color of visible light has the shortest wavelength?",
    options: ["Red", "Green", "Blue", "Violet"],
    answer: 3,
    fact: "Violet light has the shortest wavelength and highest frequency in visible spectra.",
  },
  {
    prompt: "Which structures connect muscles to bones?",
    options: ["Ligaments", "Cartilage", "Tendons", "Fascia"],
    answer: 2,
    fact: "Tendons are strong connective tissues that anchor muscles to bones.",
  },
  {
    prompt: "What is the SI unit for force?",
    options: ["Joule", "Newton", "Pascal", "Watt"],
    answer: 1,
    fact: "One newton is the force needed to accelerate one kilogram by one meter per second squared.",
  },
  {
    prompt: "Which gas is primarily responsible for the greenhouse effect?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"],
    answer: 2,
    fact: "Rising carbon dioxide levels trap more infrared radiation in the atmosphere.",
  },
  {
    prompt: "What does DNA stand for?",
    options: ["Deoxyribonucleic acid", "Digital nucleic acid", "Dicarboxylic amino acid", "Double helix acid"],
    answer: 0,
    fact: "DNA stands for deoxyribonucleic acid, the molecule storing genetic instructions.",
  },
  {
    prompt: "Which planet rotates on its side, causing extreme seasons?",
    options: ["Mercury", "Earth", "Uranus", "Mars"],
    answer: 2,
    fact: "Uranus tilts about 98 degrees, making its poles point almost directly at the Sun.",
  },
  {
    prompt: "What is the primary function of red blood cells?",
    options: ["Fight infection", "Carry oxygen", "Digest nutrients", "Transmit nerves"],
    answer: 1,
    fact: "Hemoglobin in red blood cells binds oxygen for delivery throughout the body.",
  },
  {
    prompt: "Which instrument lets scientists view tiny organisms?",
    options: ["Barometer", "Microscope", "Telescope", "Periscope"],
    answer: 1,
    fact: "Microscopes magnify small samples so scientists can study cells and microbes.",
  },
  {
    prompt: "What phenomenon bends light as it passes from air into water?",
    options: ["Reflection", "Diffraction", "Refraction", "Absorption"],
    answer: 2,
    fact: "Refraction happens when light changes speed moving between materials.",
  },
  {
    prompt: "Which metal is liquid at room temperature?",
    options: ["Mercury", "Aluminum", "Copper", "Magnesium"],
    answer: 0,
    fact: "Mercury remains liquid at standard temperature and pressure, unlike most metals.",
  },
  {
    prompt: "What type of organism makes its own food using sunlight?",
    options: ["Herbivore", "Decomposer", "Autotroph", "Detritivore"],
    answer: 2,
    fact: "Autotrophs like plants use photosynthesis to create sugars from sunlight.",
  },
  {
    prompt: "Which programming language is widely used for data science?",
    options: ["Assembly", "Python", "COBOL", "Logo"],
    answer: 1,
    fact: "Python's large ecosystem of libraries makes it a favorite for data science tasks.",
  },
  {
    prompt: "What technology uses miniaturized circuits on semiconductor wafers?",
    options: ["Hydraulics", "Integrated circuits", "Analog gauges", "Solar shingles"],
    answer: 1,
    fact: "Integrated circuits pack millions of transistor switches into a tiny chip.",
  },
  {
    prompt: "Which energy transformation occurs in a hydroelectric dam?",
    options: ["Chemical to light", "Thermal to mechanical", "Kinetic to electrical", "Nuclear to thermal"],
    answer: 2,
    fact: "Falling water spins turbines, turning kinetic energy into electricity.",
  },
  {
    prompt: "What is the purpose of an insulator?",
    options: ["Conduct heat", "Resist electric current", "Store kinetic energy", "Emit radiation"],
    answer: 1,
    fact: "Insulators such as rubber prevent electric charge from flowing easily.",
  },
  {
    prompt: "Which science studies the ocean?",
    options: ["Meteorology", "Geology", "Oceanography", "Astronomy"],
    answer: 2,
    fact: "Oceanography explores marine ecosystems, currents, and ocean chemistry.",
  },
  {
    prompt: "What is the primary component of natural gas?",
    options: ["Propane", "Methane", "Ethane", "Butane"],
    answer: 1,
    fact: "Commercial natural gas is mostly methane, CH4.",
  },
  {
    prompt: "Which planet has the longest day relative to its year?",
    options: ["Venus", "Earth", "Mars", "Jupiter"],
    answer: 0,
    fact: "Venus rotates so slowly that one day is longer than its year.",
  },
  {
    prompt: "What do bees collect to make honey?",
    options: ["Pollen", "Nectar", "Sap", "Water"],
    answer: 1,
    fact: "Bees convert flower nectar into honey through digestion and evaporation.",
  },
  {
    prompt: "Which scientist is credited with the three laws of motion?",
    options: ["Isaac Newton", "James Clerk Maxwell", "Galileo Galilei", "Blaise Pascal"],
    answer: 0,
    fact: "Newton's laws describe inertia, force, and action-reaction pairs.",
  },
  {
    prompt: "What is the purpose of a firewall in computer networks?",
    options: ["Boost Wi-Fi speed", "Monitor printer ink", "Block unauthorized access", "Store passwords"],
    answer: 2,
    fact: "Firewalls filter network traffic to keep malicious connections out.",
  },
  {
    prompt: "Which vitamin is produced in skin when exposed to sunlight?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
    answer: 2,
    fact: "Ultraviolet light triggers skin cells to synthesize vitamin D.",
  },
  {
    prompt: "What term describes animals that maintain a constant internal temperature?",
    options: ["Ectotherms", "Endotherms", "Anamniotes", "Crustaceans"],
    answer: 1,
    fact: "Endotherms regulate body temperature through metabolism and insulation.",
  },
  {
    prompt: "Which layer of Earth lies directly below the crust?",
    options: ["Inner core", "Mantle", "Outer core", "Troposphere"],
    answer: 1,
    fact: "The mantle is a semi-solid layer of hot rock beneath Earth's crust.",
  },
  {
    prompt: "Which unit measures electric current?",
    options: ["Volt", "Ampere", "Ohm", "Tesla"],
    answer: 1,
    fact: "The ampere measures the rate of charge flow in a circuit.",
  },
  {
    prompt: "What is the chemical symbol for iron?",
    options: ["Ir", "In", "Fe", "I"],
    answer: 2,
    fact: "Iron's symbol Fe comes from the Latin word ferrum.",
  },
  {
    prompt: "Which planet experiences the strongest winds in the solar system?",
    options: ["Mars", "Neptune", "Saturn", "Mercury"],
    answer: 1,
    fact: "Neptune's jet streams can reach more than 2,000 kilometers per hour.",
  },
  {
    prompt: "What is the main function of chlorophyll?",
    options: ["Store starch", "Absorb light for photosynthesis", "Pump ions", "Carry water"],
    answer: 1,
    fact: "Chlorophyll captures light energy to power sugar production in plants.",
  },
  {
    prompt: "Which branch of mathematics studies change and motion?",
    options: ["Geometry", "Statistics", "Calculus", "Topology"],
    answer: 2,
    fact: "Calculus provides tools for analyzing rates of change and accumulation.",
  },
  {
    prompt: "What type of energy is stored in a compressed spring?",
    options: ["Chemical", "Nuclear", "Elastic potential", "Thermal"],
    answer: 2,
    fact: "Compressed or stretched springs store elastic potential energy.",
  },
  {
    prompt: "Who co-discovered the double helix structure of DNA?",
    options: ["Watson and Crick", "Darwin and Wallace", "Franklin and Hubble", "Bohr and Heisenberg"],
    answer: 0,
    fact: "James Watson and Francis Crick proposed the double helix based on X-ray data.",
  },
  {
    prompt: "Plate tectonics describes the movement of which structures?",
    options: ["Lithospheric plates", "Ocean tides", "Cloud layers", "Magnetic fields"],
    answer: 0,
    fact: "Plate tectonics explains how rigid lithospheric plates drift atop the mantle.",
  },
  {
    prompt: "What portable device stores chemical energy for later use?",
    options: ["Resistor", "Battery", "Microphone", "Oscilloscope"],
    answer: 1,
    fact: "Batteries convert stored chemical energy into electrical energy on demand.",
  },
  {
    prompt: "Which part of the brain coordinates balance and movement?",
    options: ["Cerebrum", "Cerebellum", "Medulla", "Hypothalamus"],
    answer: 1,
    fact: "The cerebellum fine-tunes muscle actions for smooth, balanced motion.",
  },
  {
    prompt: "What does HTTP stand for?",
    options: ["Hypertext Transfer Protocol", "High Traffic Transmission Path", "Host Terminal Transfer Program", "Hybrid Transport Technology"],
    answer: 0,
    fact: "HTTP defines how web browsers and servers exchange hypertext documents.",
  },
  {
    prompt: "Which element is most abundant in Earth's crust?",
    options: ["Silicon", "Oxygen", "Aluminum", "Carbon"],
    answer: 1,
    fact: "Oxygen accounts for nearly half of Earth's crust by mass.",
  },
  {
    prompt: "What is the freezing point of water in Fahrenheit?",
    options: ["0 F", "32 F", "50 F", "100 F"],
    answer: 1,
    fact: "Fresh water freezes at 32 degrees Fahrenheit at standard pressure.",
  },
  {
    prompt: "Which law states that current is proportional to voltage and inversely proportional to resistance?",
    options: ["Faraday's Law", "Coulomb's Law", "Ohm's Law", "Gauss's Law"],
    answer: 2,
    fact: "Ohm's law is expressed as V = IR, linking voltage, current, and resistance.",
  },
  {
    prompt: "Who pioneered research on radioactivity and discovered radium?",
    options: ["Lise Meitner", "Marie Curie", "Enrico Fermi", "Ernest Rutherford"],
    answer: 1,
    fact: "Marie Curie's work with polonium and radium earned two Nobel Prizes.",
  },
  {
    prompt: "What is the main structural molecule in plant cell walls?",
    options: ["Chitin", "Collagen", "Cellulose", "Keratin"],
    answer: 2,
    fact: "Cellulose fibers give plant cell walls their strength and rigidity.",
  },
  {
    prompt: "Which engineering field deals with circuits and power grids?",
    options: ["Mechanical engineering", "Electrical engineering", "Environmental engineering", "Industrial engineering"],
    answer: 1,
    fact: "Electrical engineers design everything from microchips to transmission networks.",
  },
  {
    prompt: "What is the longest bone in the human body?",
    options: ["Humerus", "Tibia", "Femur", "Ulna"],
    answer: 2,
    fact: "The femur extends from hip to knee and supports body weight.",
  },
  {
    prompt: "Which gas giant spins once in less than 10 hours?",
    options: ["Saturn", "Jupiter", "Uranus", "Neptune"],
    answer: 1,
    fact: "Jupiter rotates in about 9 hours 56 minutes, giving it a strong equatorial bulge.",
  },
  {
    prompt: "What type of blood vessels carry blood away from the heart?",
    options: ["Veins", "Capillaries", "Arteries", "Venules"],
    answer: 2,
    fact: "Arteries transport oxygen-rich blood from the heart to the body.",
  },
  {
    prompt: "What is the term for a material that readily conducts electricity?",
    options: ["Conductor", "Insulator", "Semiconductor", "Photovoltaic"],
    answer: 0,
    fact: "Conductors like copper allow charges to move freely through them.",
  },
  {
    prompt: "Which technology uses satellites to determine precise location?",
    options: ["Global Positioning System", "Virtual reality", "Blockchain", "3D printing"],
    answer: 0,
    fact: "GPS triangulates signals from multiple satellites to locate receivers on Earth.",
  },
  {
    prompt: "What state of matter has a definite volume but no fixed shape?",
    options: ["Solid", "Liquid", "Gas", "Plasma"],
    answer: 1,
    fact: "Liquids adapt to their container while maintaining constant volume.",
  },
  {
    prompt: "Which device magnifies distant objects using lenses or mirrors?",
    options: ["Microscope", "Periscope", "Telescope", "Endoscope"],
    answer: 2,
    fact: "Telescopes gather light to reveal distant stars, planets, and galaxies.",
  },
  {
    prompt: "What is the chemical symbol for sodium?",
    options: ["So", "Na", "Sn", "Nd"],
    answer: 1,
    fact: "Sodium's symbol Na comes from the Latin name natrium.",
  },
  {
    prompt: "Which organ system produces hormones?",
    options: ["Digestive system", "Endocrine system", "Respiratory system", "Skeletal system"],
    answer: 1,
    fact: "Endocrine glands secrete hormones that regulate metabolism, growth, and mood.",
  },
  {
    prompt: "What simple machine is a ramp?",
    options: ["Lever", "Wheel and axle", "Inclined plane", "Pulley"],
    answer: 2,
    fact: "Inclined planes reduce the force needed to raise objects by spreading work over distance.",
  },
  {
    prompt: "Which renewable energy source taps Earth's internal heat?",
    options: ["Solar", "Geothermal", "Biomass", "Tidal"],
    answer: 1,
    fact: "Geothermal plants use steam from underground reservoirs to power turbines.",
  },
  {
    prompt: "Which instrument measures electric potential difference?",
    options: ["Ammeter", "Voltmeter", "Galvanometer", "Manometer"],
    answer: 1,
    fact: "Voltmeters measure the voltage between two points in a circuit.",
  },
  {
    prompt: "Which atmospheric layer contains most of the ozone layer?",
    options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
    answer: 1,
    fact: "The stratosphere holds the ozone layer that shields Earth from UV radiation.",
  },
  {
    prompt: "What inert gas fills most incandescent light bulbs?",
    options: ["Neon", "Argon", "Helium", "Krypton"],
    answer: 1,
    fact: "Argon prevents the filament from oxidizing inside incandescent bulbs.",
  },
  {
    prompt: "Who proposed the heliocentric model of the solar system?",
    options: ["Claudius Ptolemy", "Nicolaus Copernicus", "Galileo Galilei", "Edwin Hubble"],
    answer: 1,
    fact: "Copernicus placed the Sun at the center of the solar system in the 1500s.",
  },
  {
    prompt: "What component forms the core of modern CPUs?",
    options: ["Vacuum tubes", "Transistors", "Relays", "Cathode ray tubes"],
    answer: 1,
    fact: "Billions of transistor switches execute instructions inside modern processors.",
  },
  {
    prompt: "Which branch of biology studies how organisms interact with their environment?",
    options: ["Genetics", "Ecology", "Anatomy", "Physiology"],
    answer: 1,
    fact: "Ecologists examine relationships among organisms and their surroundings.",
  },
  {
    prompt: "What is the SI base unit for temperature?",
    options: ["Celsius", "Fahrenheit", "Kelvin", "Rankine"],
    answer: 2,
    fact: "The kelvin scale starts at absolute zero, the coldest possible temperature.",
  },
  {
    prompt: "Which instrument measures relative humidity?",
    options: ["Barometer", "Anemometer", "Hygrometer", "Seismometer"],
    answer: 2,
    fact: "Hygrometers track the amount of water vapor in the air.",
  },
  {
    prompt: "What term describes the amount of matter in an object?",
    options: ["Weight", "Mass", "Density", "Inertia"],
    answer: 1,
    fact: "Mass measures how much matter an object contains and does not change with location.",
  },
  {
    prompt: "Which technology links household devices for automation?",
    options: ["Cloud rendering", "Internet of Things", "Quantum cryptography", "Analog switching"],
    answer: 1,
    fact: "The Internet of Things connects appliances and sensors so they can share data.",
  },
  {
    prompt: "What process allows plants to release water vapor through leaves?",
    options: ["Respiration", "Transpiration", "Fermentation", "Fixation"],
    answer: 1,
    fact: "Transpiration moves water from roots to leaves and helps cool the plant.",
  },
];




// Initialize massive question loader
const questionLoader = new MassiveQuestionLoader();

async function loadMissionQuestions() {
  try {
    console.log(`Loading mission questions from database of ${questionLoader.getStats().total} questions`);
    const questions = questionLoader.getMissionQuestions(QUESTIONS_PER_MISSION);
    console.log(`Loaded ${questions.length} questions for mission`);
    return questions;
  } catch (error) {
    console.warn('Failed to load questions from massive database:', error);
    // Fallback to local questions
    const copy = [...QUESTIONS];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, QUESTIONS_PER_MISSION);
  }
}

export function mount(root) {
  root.innerHTML = `
    <section class="mission-quiz">
      <div class="mission-quiz__panel" id="missionPanel">
        <div class="mission-quiz__hud">
        <div class="mission-quiz__hud-item">
          <span>Stage</span>
          <strong id="missionStage">1 / ${QUESTIONS_PER_MISSION}</strong>
        </div>
          <div class="mission-quiz__hud-item">
            <span>Score</span>
            <strong id="missionScore">0</strong>
          </div>
          <div class="mission-quiz__hud-item">
            <span>Best</span>
            <strong id="missionBest">0</strong>
          </div>
          <div class="mission-quiz__hud-item">
            <span>Time</span>
            <strong id="missionTimer">30s</strong>
          </div>
          <div class="mission-quiz__hud-item">
            <span>Database</span>
            <strong id="missionDatabase">${questionLoader.getStats().total}+</strong>
          </div>
        </div>
        <div class="mission-quiz__question">
          <div class="mission-quiz__question-info">
            <span id="missionCategory" class="mission-quiz__category"></span>
            <span id="missionDifficulty" class="mission-quiz__difficulty"></span>
          </div>
          <div class="mission-quiz__prompt" id="missionPrompt"></div>
          <div class="mission-quiz__options" id="missionOptions"></div>
        </div>
        <div class="mission-quiz__controls">
          <button class="mission-quiz__btn" id="missionSkip">Skip</button>
          <span class="mission-quiz__timer" id="missionFeedback"></span>
        </div>
        <div class="mission-quiz__overlay" id="missionOverlay">
          <div>
            <h3>Mission Complete!</h3>
            <p id="missionSummary"></p>
            <button class="mission-quiz__btn" id="missionReplay">Run Mission Again</button>
          </div>
        </div>
      </div>
      <aside class="mission-quiz__telemetry">
        <h4>Mission Telemetry</h4>
        <div class="mission-quiz__log" id="missionLog"></div>
        <button class="mission-quiz__btn" id="missionReset">Start New Mission</button>
      </aside>
    </section>
  `;

  const stageEl = root.querySelector("#missionStage");
  const scoreEl = root.querySelector("#missionScore");
  const bestEl = root.querySelector("#missionBest");
  const timerEl = root.querySelector("#missionTimer");
  const categoryEl = root.querySelector("#missionCategory");
  const difficultyEl = root.querySelector("#missionDifficulty");
  const promptEl = root.querySelector("#missionPrompt");
  const optionsEl = root.querySelector("#missionOptions");
  const feedbackEl = root.querySelector("#missionFeedback");
  const skipButton = root.querySelector("#missionSkip");
  const logEl = root.querySelector("#missionLog");
  const resetButton = root.querySelector("#missionReset");
  const overlay = root.querySelector("#missionOverlay");
  const summaryEl = root.querySelector("#missionSummary");
  const replayButton = root.querySelector("#missionReplay");
  const panel = root.querySelector("#missionPanel");

  let pool = [];
  let index = 0;
  let score = 0;
  let best = Number(localStorage.getItem("mission-quiz-best") || 0);
  let timer = 30;
  let ticking = null;
  let acceptingAnswers = true;
  let questionsLoaded = false;

  if (best > 0) bestEl.textContent = best;

  // Load questions asynchronously
  loadMissionQuestions().then(questions => {
    pool = questions;
    questionsLoaded = true;
    if (!ticking) { // Only start if not already running
      renderQuestion();
    }
  }).catch(error => {
    console.error('Failed to load questions:', error);
    // Use local questions as fallback
    const copy = [...QUESTIONS];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    pool = copy.slice(0, QUESTIONS_PER_MISSION);
    questionsLoaded = true;
    if (!ticking) {
      renderQuestion();
    }
  });

  function logFact(question, correct) {
    const entry = document.createElement("div");
    entry.className = "mission-quiz__log-entry";
    entry.innerHTML = `
      <strong>[${correct ? "OK" : "X"}] ${question.prompt}</strong>
      <span>${question.fact}</span>
    `;
    logEl.prepend(entry);
    if (logEl.children.length > 6) {
      logEl.removeChild(logEl.lastChild);
    }
  }

  function updateHud() {
    stageEl.textContent = `${index + 1} / ${pool.length}`;
    scoreEl.textContent = score;
    timerEl.textContent = `${timer}s`;
  }

  async function endMission() {
    acceptingAnswers = false;
    clearInterval(ticking);
    ticking = null;
    overlay.classList.add("active");
    summaryEl.textContent = `You scored ${score} mission points across ${pool.length} stages.`;

    // Save score and statistics
    playTime = Math.floor((Date.now() - gameStartTime) / 1000);
    if (score > 0) {
      await saveScore('missionQuiz', score);
      await updateStatistics('missionQuiz', {
        score,
        playTime,
        result: score > 0 ? 'win' : 'loss'
      });
    }

    if (!best || score > best) {
      best = score;
      localStorage.setItem("mission-quiz-best", best);
      bestEl.textContent = best;
    }
  }

  function tick() {
    timer -= 1;
    if (timer <= 0) {
      feedbackEl.textContent = "Time is up. Auto skipping to the next stage.";
      logFact(pool[index], false);
      if (index === pool.length - 1) {
        endMission();
      } else {
        index += 1;
        renderQuestion();
      }
      return;
    }
    timerEl.textContent = `${timer}s`;
  }

  function startTimer() {
    clearInterval(ticking);
    ticking = setInterval(tick, 1000);
  }

  function renderQuestion() {
    if (!questionsLoaded || pool.length === 0) {
      // Show loading state
      promptEl.textContent = "Loading mission questions...";
      optionsEl.innerHTML = "<div style='text-align: center; color: #94a3b8;'>Please wait while we prepare your mission.</div>";
      return;
    }

    acceptingAnswers = true;
    timer = 30;
    feedbackEl.textContent = "";
    updateHud();
    startTimer();
    const question = pool[index];
    
    // Display category and difficulty
    if (question.category) {
      categoryEl.textContent = question.category.replace('_', ' ').toUpperCase();
    }
    if (question.difficulty) {
      difficultyEl.textContent = question.difficulty.toUpperCase();
      difficultyEl.className = `mission-quiz__difficulty ${question.difficulty}`;
    }
    
    promptEl.textContent = question.prompt;
    optionsEl.innerHTML = "";
    question.options.forEach((optionText, optionIdx) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mission-quiz__option";
      button.textContent = optionText;
      button.addEventListener("click", () => handleAnswer(optionIdx));
      optionsEl.appendChild(button);
    });
  }

  function handleAnswer(choice) {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    clearInterval(ticking);
    ticking = null;
    const question = pool[index];
    const buttons = Array.from(optionsEl.children);
    buttons.forEach((button, idx) => {
      if (idx === question.answer) {
        button.dataset.state = "correct";
      } else if (idx === choice) {
        button.dataset.state = "wrong";
      }
      button.disabled = true;
    });
    const correct = choice === question.answer;
    if (correct) {
      const reward = Math.max(50, timer * 3);
      score += reward;
      feedbackEl.textContent = `Correct! +${reward} points`;
      logFact(question, true);
      scoreEl.textContent = score;
    } else {
      feedbackEl.textContent = "Not quite - review the telemetry.";
      logFact(question, false);
    }

    setTimeout(() => {
      if (index === pool.length - 1) {
        endMission();
      } else {
        index += 1;
        renderQuestion();
      }
    }, 1400);
  }

  function skipQuestion() {
    if (!acceptingAnswers) return;
    clearInterval(ticking);
    ticking = null;
    logFact(pool[index], false);
    feedbackEl.textContent = "Stage skipped. No score change.";
    if (index === pool.length - 1) {
      endMission();
    } else {
      index += 1;
      renderQuestion();
    }
  }

  async function resetMission() {
    questionsLoaded = false;
    pool = [];
    index = 0;
    score = 0;
    timer = 30;
    gameStartTime = Date.now();
    playTime = 0;
    feedbackEl.textContent = "";
    logEl.innerHTML = "";
    overlay.classList.remove("active");
    acceptingAnswers = true;
    
    // Show loading state
    renderQuestion();
    
    try {
      const questions = await loadMissionQuestions();
      pool = questions;
      questionsLoaded = true;
      renderQuestion();
    } catch (error) {
      console.error('Failed to reload questions:', error);
      // Use local questions as fallback
      const copy = [...QUESTIONS];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      pool = copy.slice(0, QUESTIONS_PER_MISSION);
      questionsLoaded = true;
      renderQuestion();
    }
  }

  skipButton.addEventListener("click", skipQuestion);
  resetButton.addEventListener("click", resetMission);
  replayButton.addEventListener("click", resetMission);

  renderQuestion();

  return {
    destroy() {
      skipButton.removeEventListener("click", skipQuestion);
      resetButton.removeEventListener("click", resetMission);
      replayButton.removeEventListener("click", resetMission);
      clearInterval(ticking);
      ticking = null;
    },
  };
}
