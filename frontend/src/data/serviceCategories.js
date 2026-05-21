// Curated Unsplash image URLs for each service category and sub-service
const IMAGES = {
    // Categories
    electrical: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    plumbing: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    ac: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
    appliances: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
    cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    carpentry: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    painting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    pest: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    installations: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80',
    outdoor: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',

    // Sub-services
    electrician: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
    switchRepair: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80',
    fanInstall: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=600&q=80',
    lightInstall: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=600&q=80',
    wiring: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    inverter: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    solar: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    doorbell: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',

    plumber: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    pipeLeak: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    tapInstall: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    toilet: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    bathroom: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80',
    drain: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    waterTank: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80',
    waterPurifier: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80',

    acRepair: 'https://images.unsplash.com/photo-1631545806609-3c480b3cf951?auto=format&fit=crop&w=600&q=80',
    acInstall: 'https://images.unsplash.com/photo-1631545806609-3c480b3cf951?auto=format&fit=crop&w=600&q=80',
    acGas: 'https://images.unsplash.com/photo-1631545806609-3c480b3cf951?auto=format&fit=crop&w=600&q=80',
    acMaintenance: 'https://images.unsplash.com/photo-1631545806609-3c480b3cf951?auto=format&fit=crop&w=600&q=80',
    cooler: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80',
    ventilation: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80',

    fridge: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80',
    washingMachine: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
    microwave: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80',
    dishwasher: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80',
    waterHeater: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80',
    induction: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80',

    houseCleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    deepCleaning: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=600&q=80',
    sofaCleaning: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=600&q=80',
    carpetCleaning: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=600&q=80',
    bathroomCleaning: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    kitchenCleaning: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80',
    moveIn: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    moveOut: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',

    carpenter: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
    furnitureRepair: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    furnitureAssembly: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    wardrobe: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=600&q=80',
    doorRepair: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    lockInstall: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    kitchenCabinet: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80',

    interiorPainting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80',
    exteriorPainting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80',
    wallPutty: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80',
    wallpaper: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=600&q=80',
    tileInstall: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80',
    falseCeiling: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80',

    pestGeneral: 'https://images.unsplash.com/photo-1559060032-5e19e7878549?auto=format&fit=crop&w=600&q=80',
    termite: 'https://images.unsplash.com/photo-1559060032-5e19e7878549?auto=format&fit=crop&w=600&q=80',
    cockroach: 'https://images.unsplash.com/photo-1559060032-5e19e7878549?auto=format&fit=crop&w=600&q=80',
    bedBug: 'https://images.unsplash.com/photo-1559060032-5e19e7878549?auto=format&fit=crop&w=600&q=80',
    rodent: 'https://images.unsplash.com/photo-1559060032-5e19e7878549?auto=format&fit=crop&w=600&q=80',
    mosquito: 'https://images.unsplash.com/photo-1559060032-5e19e7878549?auto=format&fit=crop&w=600&q=80',

    tvInstall: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
    cctv: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    homeTheater: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
    wifi: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80',
    smartHome: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    doorCamera: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',

    gardening: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
    lawn: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
    fence: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
    gate: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    pool: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80',

    // Hero & misc
    hero: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
    provider1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    provider2: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
};

export const serviceCategories = [
    {
        id: 'electrical',
        title: 'Electrical',
        path: '/category/electrical',
        icon: '⚡',
        image: IMAGES.electrical,
        description: 'Expert electricians for repairing and installing electrical appliances and wiring.',
        services: [
            { id: '1-1', name: 'Electrician', icon: '⚡', image: IMAGES.electrician, description: 'General electrical repair and installation work.' },
            { id: '1-2', name: 'Switch Repair', icon: '🔌', image: IMAGES.switchRepair, description: 'Fix or replace damaged electrical switches.' },
            { id: '1-3', name: 'Fan Installation', icon: '💨', image: IMAGES.fanInstall, description: 'Ceiling and exhaust fan installation.' },
            { id: '1-4', name: 'Light Installation', icon: '💡', image: IMAGES.lightInstall, description: 'Install tube lights, bulbs, and decorative lighting.' },
            { id: '1-5', name: 'Electrical Wiring', icon: '🧵', image: IMAGES.wiring, description: 'Complete or partial house wiring solutions.' },
            { id: '1-6', name: 'Inverter Installation', icon: '🔋', image: IMAGES.inverter, description: 'Setup inverters and battery connections.' },
            { id: '1-7', name: 'Solar Panel Installation', icon: '☀️', image: IMAGES.solar, description: 'Rooftop solar panel setup and maintenance.' },
            { id: '1-8', name: 'Doorbell Installation', icon: '🔔', image: IMAGES.doorbell, description: 'Wired and wireless doorbell installation.' }
        ]
    },
    {
        id: 'plumbing',
        title: 'Plumbing',
        path: '/category/plumbing',
        icon: '🔧',
        image: IMAGES.plumbing,
        description: 'Professional plumbing services for leaks, fittings, and cleaning.',
        services: [
            { id: '2-1', name: 'Plumber', icon: '🔧', image: IMAGES.plumber, description: 'General plumbing repairs and services.' },
            { id: '2-2', name: 'Pipe Leak Repair', icon: '💧', image: IMAGES.pipeLeak, description: 'Fix leaking pipes and seal joints.' },
            { id: '2-3', name: 'Tap Installation', icon: '🚰', image: IMAGES.tapInstall, description: 'Install or repair bathroom and kitchen taps.' },
            { id: '2-4', name: 'Toilet Repair', icon: '🚽', image: IMAGES.toilet, description: 'Fix flushes, blockages, and leaks in toilets.' },
            { id: '2-5', name: 'Bathroom Fitting', icon: '🛁', image: IMAGES.bathroom, description: 'Install sanitary ware and bathroom fixtures.' },
            { id: '2-6', name: 'Drain Cleaning', icon: '🌀', image: IMAGES.drain, description: 'Unclog choked drains and pipes.' },
            { id: '2-7', name: 'Water Tank Cleaning', icon: '🏢', image: IMAGES.waterTank, description: 'Deep cleaning of overhead and underground tanks.' },
            { id: '2-8', name: 'RO / Water Purifier Service', icon: '🚰', image: IMAGES.waterPurifier, description: 'Filter replacement and servicing.' }
        ]
    },
    {
        id: 'ac-services',
        title: 'AC Services',
        path: '/category/ac-services',
        icon: '❄️',
        image: IMAGES.ac,
        description: 'AC repair, installation, and gas refilling services.',
        services: [
            { id: '3-1', name: 'AC Repair', icon: '❄️', image: IMAGES.acRepair, description: 'Fix cooling issues and compressor problems.' },
            { id: '3-2', name: 'AC Installation', icon: '🔧', image: IMAGES.acInstall, description: 'Split and window AC installation/uninstallation.' },
            { id: '3-3', name: 'AC Gas Refill', icon: '⛽', image: IMAGES.acGas, description: 'Refill refrigerant gas for better cooling.' },
            { id: '3-4', name: 'AC Maintenance', icon: '🧹', image: IMAGES.acMaintenance, description: 'General servicing and cleaning of AC units.' },
            { id: '3-5', name: 'Air Cooler Repair', icon: '🌬️', image: IMAGES.cooler, description: 'Servicing of desert and room air coolers.' },
            { id: '3-6', name: 'Ventilation System Service', icon: '🌪️', image: IMAGES.ventilation, description: 'Exhaust and ventilation repair.' }
        ]
    },
    {
        id: 'appliances',
        title: 'Appliance Repair',
        path: '/category/appliances',
        icon: '📺',
        image: IMAGES.appliances,
        description: 'Expert repair for major home appliances.',
        services: [
            { id: '4-1', name: 'Refrigerator Repair', icon: '🧊', image: IMAGES.fridge, description: 'Fix cooling, compressor, and gas issues.' },
            { id: '4-2', name: 'Washing Machine Repair', icon: '👕', image: IMAGES.washingMachine, description: 'Repair drum, motor, and drainage problems.' },
            { id: '4-3', name: 'Microwave Repair', icon: '🍕', image: IMAGES.microwave, description: 'Fix heating issues and panel replacements.' },
            { id: '4-4', name: 'Dishwasher Repair', icon: '🍽️', image: IMAGES.dishwasher, description: 'Resolve water flow and cleaning issues.' },
            { id: '4-5', name: 'Water Heater Repair', icon: '♨️', image: IMAGES.waterHeater, description: 'Geyser installation and heating repair.' },
            { id: '4-6', name: 'Induction Cooktop Repair', icon: '🍳', image: IMAGES.induction, description: 'Panel and coil repair for induction stoves.' }
        ]
    },
    {
        id: 'cleaning',
        title: 'Cleaning',
        path: '/category/cleaning',
        icon: '🧹',
        image: IMAGES.cleaning,
        description: 'Deep cleaning services for homes, bathrooms, and furniture.',
        services: [
            { id: '5-1', name: 'House Cleaning', icon: '🧹', image: IMAGES.houseCleaning, description: 'General household cleaning service.' },
            { id: '5-2', name: 'Deep Cleaning', icon: '✨', image: IMAGES.deepCleaning, description: 'Intensive full home deep cleaning.' },
            { id: '5-3', name: 'Sofa Cleaning', icon: '🛋️', image: IMAGES.sofaCleaning, description: 'Dry and wet cleaning of fabric sofas.' },
            { id: '5-4', name: 'Carpet Cleaning', icon: '🎛️', image: IMAGES.carpetCleaning, description: 'Shampoo and vacuum cleaning of carpets.' },
            { id: '5-5', name: 'Bathroom Cleaning', icon: '🚿', image: IMAGES.bathroomCleaning, description: 'Deep cleaning of tiles and bathroom fixtures.' },
            { id: '5-6', name: 'Kitchen Cleaning', icon: '🍽️', image: IMAGES.kitchenCleaning, description: 'Grease and stain removal for kitchens.' },
            { id: '5-7', name: 'Move-In Cleaning', icon: '📦', image: IMAGES.moveIn, description: 'Cleaning before moving to a new house.' },
            { id: '5-8', name: 'Move-Out Cleaning', icon: '🚪', image: IMAGES.moveOut, description: 'Thorough checkout cleaning service.' }
        ]
    },
    {
        id: 'carpentry',
        title: 'Carpentry',
        path: '/category/carpentry',
        icon: '🔨',
        image: IMAGES.carpentry,
        description: 'Furniture repair, assembly, and custom woodwork.',
        services: [
            { id: '6-1', name: 'Carpenter', icon: '🔨', image: IMAGES.carpenter, description: 'General woodwork and carpentry service.' },
            { id: '6-2', name: 'Furniture Repair', icon: '🪑', image: IMAGES.furnitureRepair, description: 'Fix broken chairs, tables, and cabinets.' },
            { id: '6-3', name: 'Furniture Assembly', icon: '🧰', image: IMAGES.furnitureAssembly, description: 'Assemble ready-to-use furniture (IKEA, etc).' },
            { id: '6-4', name: 'Wardrobe Installation', icon: '🚪', image: IMAGES.wardrobe, description: 'Fix sliding and hinged wardrobe doors.' },
            { id: '6-5', name: 'Door Repair', icon: '🚪', image: IMAGES.doorRepair, description: 'Fix hinges, handles, and door alignments.' },
            { id: '6-6', name: 'Lock Installation', icon: '🔑', image: IMAGES.lockInstall, description: 'Install and repair door and digital locks.' },
            { id: '6-7', name: 'Kitchen Cabinet Repair', icon: '🗄️', image: IMAGES.kitchenCabinet, description: 'Fix cabinet hinges and channels.' }
        ]
    },
    {
        id: 'painting',
        title: 'Painting & Renovation',
        path: '/category/painting',
        icon: '🖌️',
        image: IMAGES.painting,
        description: 'Interior and exterior painting, tile, and renovation work.',
        services: [
            { id: '7-1', name: 'Interior Painting', icon: '🎨', image: IMAGES.interiorPainting, description: 'Paint rooms, walls, and ceilings.' },
            { id: '7-2', name: 'Exterior Painting', icon: '🏢', image: IMAGES.exteriorPainting, description: 'Weatherproof painting for home exteriors.' },
            { id: '7-3', name: 'Wall Putty', icon: '🧱', image: IMAGES.wallPutty, description: 'Wall smoothing and putty application.' },
            { id: '7-4', name: 'Wallpaper Installation', icon: '🖼️', image: IMAGES.wallpaper, description: 'Apply customized and standard wallpapers.' },
            { id: '7-5', name: 'Tile Installation', icon: '⬜', image: IMAGES.tileInstall, description: 'Lay floor and wall tiles.' },
            { id: '7-6', name: 'False Ceiling Installation', icon: '🏛️', image: IMAGES.falseCeiling, description: 'POP and gypsum false ceiling work.' }
        ]
    },
    {
        id: 'pest-control',
        title: 'Pest Control',
        path: '/category/pest-control',
        icon: '🪳',
        image: IMAGES.pest,
        description: 'Termite, cockroach, and general pest elimination.',
        services: [
            { id: '8-1', name: 'General Pest Control', icon: '🕷️', image: IMAGES.pestGeneral, description: 'Complete home pest elimination.' },
            { id: '8-2', name: 'Termite Treatment', icon: '🪵', image: IMAGES.termite, description: 'Pre and post-construction termite control.' },
            { id: '8-3', name: 'Cockroach Control', icon: '🪳', image: IMAGES.cockroach, description: 'Gel-based cockroach treatments.' },
            { id: '8-4', name: 'Bed Bug Treatment', icon: '🛏️', image: IMAGES.bedBug, description: 'Eradicate bed bugs completely.' },
            { id: '8-5', name: 'Rodent Control', icon: '🐁', image: IMAGES.rodent, description: 'Rat and mice trapping and elimination.' },
            { id: '8-6', name: 'Mosquito Treatment', icon: '🦟', image: IMAGES.mosquito, description: 'Fogging and spraying for mosquitoes.' }
        ]
    },
    {
        id: 'installations',
        title: 'Installations',
        path: '/category/installations',
        icon: '🛠️',
        image: IMAGES.installations,
        description: 'Installation of TVs, cameras, networks, and smart devices.',
        services: [
            { id: '9-1', name: 'TV Installation', icon: '📺', image: IMAGES.tvInstall, description: 'Wall mounting and setup for TVs.' },
            { id: '9-2', name: 'CCTV Installation', icon: '📹', image: IMAGES.cctv, description: 'Setup security cameras and DVRs.' },
            { id: '9-3', name: 'Home Theater Setup', icon: '🔊', image: IMAGES.homeTheater, description: 'Install speakers and audio systems.' },
            { id: '9-4', name: 'WiFi Router Setup', icon: '📶', image: IMAGES.wifi, description: 'Configure routers and network extenders.' },
            { id: '9-5', name: 'Smart Home Installation', icon: '📱', image: IMAGES.smartHome, description: 'Install smart bulbs, plugs, and hubs.' },
            { id: '9-6', name: 'Door Camera Installation', icon: '🚪', image: IMAGES.doorCamera, description: 'Setup video doorbells and intercoms.' }
        ]
    },
    {
        id: 'outdoor',
        title: 'Outdoor Services',
        path: '/category/outdoor',
        icon: '🌳',
        image: IMAGES.outdoor,
        description: 'Gardening, lawn maintenance, and pool cleaning.',
        services: [
            { id: '10-1', name: 'Gardening', icon: '🌿', image: IMAGES.gardening, description: 'Planting and taking care of home gardens.' },
            { id: '10-2', name: 'Lawn Maintenance', icon: '✂️', image: IMAGES.lawn, description: 'Mowing and fertilizing lawns.' },
            { id: '10-3', name: 'Fence Repair', icon: '🚧', image: IMAGES.fence, description: 'Fix wooden and metal fences.' },
            { id: '10-4', name: 'Gate Installation', icon: '⛩️', image: IMAGES.gate, description: 'Install and repair entryway gates.' },
            { id: '10-5', name: 'Swimming Pool Cleaning', icon: '🏊‍♂️', image: IMAGES.pool, description: 'Vacuuming and chemical balancing.' }
        ]
    }
];

export const getCategoryById = (id) => {
    return serviceCategories.find(cat => cat.id === id);
};

export { IMAGES };
