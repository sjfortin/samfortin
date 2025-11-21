interface Project {
    name: string;
    description: string;
    technologies: string[];
    links: { name: string; url: string }[];
    image?: string;
    video?: string;
}

export const projects: Project[] = [
    {
        name: 'Estee Lauder Companies',
        description: 'React/Typescript microfrontend applocation for Estee Lauder Companies loyalty program that launched on brands such as Clinique and MAC Cosmetics.',
        technologies: ['React', 'TypeScript', 'MobX', 'Perl', 'Elixir', 'Phoenix Framework'],
        links: [
            { name: 'Estee Lauder Companies', url: 'https://www.elcompanies.com/en/our-brands' },
            { name: 'Clinique', url: 'https://www.clinique.com/smartrewards' },
            { name: 'MAC Cosmetics', url: 'https://www.maccosmetics.com/mac-lover' },
        ],
        image: '/images/experience/estee.png',
    },
    {
        name: 'TC Farm',
        description: 'Custom React/Next.js application built with BigCommerce as the ecommerce platform to power the ordering, payment, and delivery process.',
        technologies: ['React', 'Next.js', 'BigCommerce', 'AWS DynamoDB', 'Stripe', 'AWS Amplify', 'Tanstack Query', 'Tailwind CSS', 'Zustand'],
        links: [
            { name: 'TC Farm', url: 'https://tc.farm/' },
        ],
        image: '/images/experience/tcfarm.png',
    },
    {
        name: 'Darn Tough Socks',
        description: 'Shopify re-theme and development. PIM integration.',
        technologies: ['Shopify', 'JavaScript', 'CSS', 'HTML'],
        links: [
            { name: 'Darn Tough Socks', url: 'https://darntough.com/' },
        ],
        image: '/images/experience/darntough.png',
    },
    {
        name: 'GED.com',
        description: 'WordPress multi-site development.',
        technologies: ['WordPress', 'JavaScript', 'CSS', 'HTML', 'FlyntWP', 'ACF'],
        links: [
            { name: 'GED.com', url: 'https://ged.com/' },
        ],
        image: '/images/experience/ged.svg',
    },
    {
        name: '2DSemiConductors',
        description: 'Periodic table of elements React product search widget for 2DSemiConductors.',
        technologies: ['React', 'Laravel', 'BigCommerce', 'Context API', 'Styled Components'],
        links: [
            { name: '2DSemiConductors', url: 'https://2dsemiconductors.com/' },
        ],
        image: '/images/experience/2dsemi.png',
    },
    {
        name: 'WindowParts.com',
        description: 'Ecommerce platform migration from Volusion to Shopify with full ecommerce site build. Built an ETL pipeline to migrate data from Volusion to Shopify in Node.js.',
        technologies: ['Shopify', 'JavaScript', 'CSS', 'HTML', 'Liquid', 'Node.js', 'Alpine.js'],
        links: [
            { name: 'WindowParts.com', url: 'https://windowparts.com/' },
        ],
        image: '/images/experience/windowparts.png',
    },
    {
        name: 'Random Whiteboarding Video',
        description: 'Random Whiteboarding Video.',
        technologies: [],
        links: [],
        video: '/videos/whiteboarding.mp4',
    },
    {
        name: 'CFMoto',
        description: 'CFMoto custom built Create React App admin for part inventory built with NetSuite ERP APIs powerig backend.',
        technologies: ['React', 'TypeScript', 'ChakraUI', 'Tanstack Query', 'Tailwind CSS', 'Redux Toolkit', 'NetSuite'],
        links: [
            { name: 'CFMoto', url: 'https://cfmoto.com/' },
        ],
        image: '/images/experience/cfmoto.png',
    },
    {
        name: 'FastSigns',
        description: 'B2B Ecommerce platform for FastSigns products and custom signage. Built with React/Next.js using OrderCloud backend APIs for product catalog and headless content. I contributed to the development of the OrderCloud Next.js starter theme.',
        technologies: ['React', 'Next.js', 'Tanstack Query', 'Material UI', 'Redux Toolkit', 'TypeScript', 'Sitecore OrderCloud'],
        links: [
            { name: 'FastSigns', url: 'https://fastsigns.com/' },
            { name: 'OrderCloud Next.js Starter', url: 'https://github.com/ordercloud-api/headstart-nextjs' },
        ],
        image: '/images/experience/fastsigns.png',
    },
    {
        name: 'Irish Titan',
        description: 'Marketing website for Irish Titan built with React and Gatsby.',
        technologies: ['React', 'Gatsby', 'SCSS', 'AWS Amplify', 'Contentful CMS'],
        links: [
            { name: 'Irish Titan', url: 'https://irishtitan.com/' },
        ],
        image: '/images/experience/irishtitan.png',
    },
    {
        name: 'Tradehome Shoes',
        description: 'Ecommerce website for Tradehome Shoes built with Shopify.',
        technologies: ['Shopify', 'JavaScript', 'CSS', 'HTML', 'Liquid'],
        links: [
            { name: 'Tradehome Shoes', url: 'https://tradehome.com/' },
        ],
        image: '/images/experience/tradehome.png',
    },
    {
        name: 'Nordicware',
        description: 'Headless ecommerce website for Nordicware built with BigCommerce and WordPress.',
        technologies: ['BigCommerce', 'WordPress', 'JavaScript', 'CSS', 'HTML', 'PHP'],
        links: [
            { name: 'Nordicware', url: 'https://nordicware.com/' },
        ],
        image: '/images/experience/nordicware.png',
    },
    {
        name: 'LaCrosse Technology',
        description: 'Ecommerce website for LaCrosse Technology built with Shopify. Custom integration with LaCrosse Technology mobile app product registration.',
        technologies: ['Shopify', 'JavaScript', 'CSS', 'HTML', 'Liquid', 'Laravel'],
        links: [
            { name: 'LaCrosse Technology', url: 'https://lacrossetechnology.com/' },
        ],
        image: '/images/experience/lacrosse.png',
    },
    {
        name: 'Liberty Safe',
        description: 'Ecommerce website for Liberty Safe built with Shopify.',
        technologies: ['Shopify', 'JavaScript', 'CSS', 'HTML', 'Liquid', 'Alpine.js', 'ThreeKit 3D Modeling'],
        links: [
            { name: 'Liberty Safe', url: 'https://libertysafe.com/' },
        ],
        image: '/images/experience/libertysafe.png',
    },
    {
        name: 'Optum',
        description: 'Software feature development work with the Optum User Experience Design Studio (UXDS).',
        technologies: ['JavaScript', 'AEM', 'CSS', 'HTML', 'SCSS'],
        links: [
            { name: 'Optum', url: 'https://optum.com/' },
        ],
        image: '/images/experience/optum.svg',
    },
    {
        name: 'OneOme',
        description: 'Pharmacogenomics software development for OneOme.',
        technologies: ['Grav CMS', 'JavaScript', 'CSS', 'HTML', 'Python', 'Flask', 'Braintree'],
        links: [
            { name: 'OneOme', url: 'https://oneome.com/' },
        ],
        image: '/images/experience/oneome.png',
    },
];