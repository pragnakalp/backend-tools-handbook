// @ts-check

/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Home',
    },

    {
      type: 'category',
      label: 'cURL',
      items: [
        {
          type: 'doc',
          id: 'CURL_GUIDE',
          label: 'Guide',
        },
      ],
    },

    {
      type: 'category',
      label: 'Postman',
      items: [
        {
          type: 'doc',
          id: 'POSTMAN_GUIDE_PART1_BASICS',
          label: 'Basics',
        },
        {
          type: 'doc',
          id: 'POSTMAN_GUIDE_PART2_ADVANCED',
          label: 'Advanced',
        },
      ],
    },

    {
      type: 'category',
      label: 'Git',
      items: [
        {
          type: 'doc',
          id: 'Git_Guide',
          label: 'Guide',
        },
      ],
    },

    {
      type: 'category',
      label: 'SQL',
      items: [
        {
          type: 'doc',
          id: 'Introduction',
          label: '00 Introduction',
        },
        {
          type: 'doc',
          id: 'Getting-Started',
          label: '01 Getting Started',
        },
        {
          type: 'doc',
          id: 'Querying-Data',
          label: '02 Querying Data',
        },
        {
          type: 'doc',
          id: 'Filtering-Data',
          label: '03 Filtering Data',
        },
        {
          type: 'doc',
          id: 'Joining-Tables',
          label: '04 Joining Tables',
        },
        {
          type: 'doc',
          id: 'Grouping-Data',
          label: '05 Grouping Data',
        },
        {
          type: 'doc',
          id: 'Set-Operations',
          label: '06 Set Operations',
        },
        {
          type: 'doc',
          id: 'Modifying-Data',
          label: '07 Modifying Data',
        },
        {
          type: 'doc',
          id: 'Subqueries',
          label: '08 Subqueries',
        },
        {
          type: 'doc',
          id: 'Data-Types',
          label: '09 Data Types',
        },
        {
          type: 'doc',
          id: 'Managing-Tables',
          label: '10 Managing Tables',
        },
        {
          type: 'doc',
          id: 'Constraints',
          label: '11 Constraints',
        },
      ],
    },
  ],
};

export default sidebars;
