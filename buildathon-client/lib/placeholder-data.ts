import { User, Campaign, Application, Message, Payment, Contract } from './types';

// Mock users
export const users: User[] = [
  {
    id: '1',
    name: 'Acme Brands',
    email: 'contact@acmebrands.com',
    image: 'https://images.pexels.com/photos/15013326/pexels-photo-15013326.jpeg?auto=compress&cs=tinysrgb&w=300',
    role: 'brand',
    bio: 'Leading consumer goods company with multiple product lines.',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Emma Johnson',
    email: 'emma@creators.net',
    image: 'https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&w=300',
    role: 'creator',
    bio: 'Lifestyle and wellness content creator with 500K+ followers across platforms.',
    socialLinks: {
      instagram: '@emmajlifestyle',
      youtube: '@emmajcreates',
      tiktok: '@emmaj',
    },
    createdAt: '2023-02-10T00:00:00Z',
    updatedAt: '2023-02-10T00:00:00Z',
  },
  {
    id: '3',
    name: 'Tech Innovations',
    email: 'marketing@techinnovations.com',
    image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=300',
    role: 'brand',
    bio: 'Cutting-edge technology company specializing in consumer electronics.',
    createdAt: '2023-01-20T00:00:00Z',
    updatedAt: '2023-01-20T00:00:00Z',
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    email: 'alex@fitcreators.com',
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300',
    role: 'creator',
    bio: 'Fitness expert and nutritionist sharing workout tips and healthy recipes.',
    socialLinks: {
      instagram: '@alexrfitness',
      youtube: '@alexrodriguezfitness',
      tiktok: '@alexfit',
    },
    createdAt: '2023-02-15T00:00:00Z',
    updatedAt: '2023-02-15T00:00:00Z',
  },
];

// Mock campaigns
export const campaigns: Campaign[] = [
  {
    id: '1',
    brandId: '1',
    name: 'Summer Collection Launch',
    description: 'Promote our new summer clothing collection targeting young adults.',
    goal: 'Increase brand awareness and drive sales for new collection.',
    budget: 5000,
    startDate: '2023-05-01T00:00:00Z',
    endDate: '2023-06-15T00:00:00Z',
    platforms: ['instagram', 'tiktok'],
    deliverables: [
      { type: 'post', count: 2, description: 'Showcase outfits from the collection' },
      { type: 'story', count: 3, description: 'Behind-the-scenes try-on' },
      { type: 'reel', count: 1, description: 'Creative outfit transitions' },
    ],
    targetAudience: {
      ageRange: [18, 34],
      demographics: ['fashion enthusiasts', 'trendsetters'],
      interests: ['fashion', 'lifestyle', 'summer trends'],
      locations: ['United States', 'Canada', 'United Kingdom'],
    },
    status: 'active',
    createdAt: '2023-04-10T00:00:00Z',
    updatedAt: '2023-04-10T00:00:00Z',
  },
  {
    id: '2',
    brandId: '3',
    name: 'New Smartphone Review Campaign',
    description: 'Looking for tech creators to review our latest smartphone model.',
    goal: 'Generate authentic reviews and highlight key features of our new smartphone.',
    budget: 8000,
    startDate: '2023-06-01T00:00:00Z',
    endDate: '2023-07-15T00:00:00Z',
    platforms: ['youtube', 'instagram'],
    deliverables: [
      { type: 'video', count: 1, description: 'In-depth review (10-15 min)' },
      { type: 'post', count: 2, description: 'Highlight key features with photos' },
      { type: 'story', count: 5, description: 'Daily usage experience' },
    ],
    targetAudience: {
      ageRange: [25, 45],
      demographics: ['tech enthusiasts', 'professionals'],
      interests: ['technology', 'gadgets', 'smartphones'],
      locations: ['Global'],
    },
    status: 'active',
    createdAt: '2023-05-15T00:00:00Z',
    updatedAt: '2023-05-15T00:00:00Z',
  },
  {
    id: '3',
    brandId: '1',
    name: 'Fitness Challenge Sponsorship',
    description: 'Sponsor fitness creators for a 30-day challenge using our products.',
    goal: 'Showcase how our products complement an active lifestyle.',
    budget: 6000,
    startDate: '2023-07-01T00:00:00Z',
    endDate: '2023-08-15T00:00:00Z',
    platforms: ['instagram', 'tiktok', 'youtube'],
    deliverables: [
      { type: 'video', count: 1, description: 'Challenge introduction' },
      { type: 'post', count: 4, description: 'Weekly progress updates' },
      { type: 'story', count: 15, description: 'Daily tips and product usage' },
    ],
    targetAudience: {
      ageRange: [18, 40],
      demographics: ['fitness enthusiasts', 'active lifestyle'],
      interests: ['fitness', 'health', 'wellness'],
      locations: ['United States', 'Australia', 'Germany'],
    },
    status: 'draft',
    createdAt: '2023-06-05T00:00:00Z',
    updatedAt: '2023-06-05T00:00:00Z',
  },
];

// Mock applications
export const applications: Application[] = [
  {
    id: '1',
    campaignId: '1',
    creatorId: '2',
    proposal: 'I would love to showcase your summer collection to my audience. My followers are mostly young adults interested in fashion and trends.',
    status: 'approved',
    deliverables: [
      {
        type: 'post',
        content: 'https://example.com/content1.jpg',
        submittedAt: '2023-05-15T00:00:00Z',
        status: 'approved',
      },
      {
        type: 'story',
        content: 'https://example.com/content2.jpg',
        submittedAt: '2023-05-20T00:00:00Z',
        status: 'approved',
      },
    ],
    createdAt: '2023-04-15T00:00:00Z',
    updatedAt: '2023-05-20T00:00:00Z',
  },
  {
    id: '2',
    campaignId: '2',
    creatorId: '4',
    proposal: 'As a tech enthusiast with experience reviewing smartphones, I can provide an honest and detailed review of your new model.',
    status: 'pending',
    createdAt: '2023-05-20T00:00:00Z',
    updatedAt: '2023-05-20T00:00:00Z',
  },
];

// Mock messages
export const messages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    campaignId: '1',
    content: 'Hi Emma, thanks for applying to our campaign! Do you have any questions about the deliverables?',
    read: true,
    createdAt: '2023-04-16T10:00:00Z',
  },
  {
    id: '2',
    senderId: '2',
    receiverId: '1',
    campaignId: '1',
    content: 'Hi Acme Brands! Yes, I was wondering if you have specific colors or themes you want me to focus on?',
    read: true,
    createdAt: '2023-04-16T10:15:00Z',
  },
  {
    id: '3',
    senderId: '1',
    receiverId: '2',
    campaignId: '1',
    content: 'We\'d like to highlight our pastel collection, especially the blue and pink items. We\'ll send you a style guide shortly.',
    read: true,
    createdAt: '2023-04-16T10:30:00Z',
  },
  {
    id: '4',
    senderId: '3',
    receiverId: '4',
    campaignId: '2',
    content: 'Hello Alex, we\'re reviewing your application and are interested in working with you. Can we schedule a call?',
    read: false,
    createdAt: '2023-05-22T14:00:00Z',
  },
];

// Mock payments
export const payments: Payment[] = [
  {
    id: '1',
    campaignId: '1',
    brandId: '1',
    creatorId: '2',
    amount: 2500,
    status: 'completed',
    transactionId: 'txn_123456789',
    createdAt: '2023-05-25T00:00:00Z',
  },
  {
    id: '2',
    campaignId: '1',
    brandId: '1',
    creatorId: '2',
    amount: 2500,
    status: 'pending',
    createdAt: '2023-06-10T00:00:00Z',
  },
];

// Mock contracts
export const contracts: Contract[] = [
  {
    id: '1',
    campaignId: '1',
    brandId: '1',
    creatorId: '2',
    fileUrl: 'https://example.com/contracts/contract1.pdf',
    signed: {
      brand: true,
      creator: true,
    },
    createdAt: '2023-04-17T00:00:00Z',
    updatedAt: '2023-04-19T00:00:00Z',
  },
  {
    id: '2',
    campaignId: '2',
    brandId: '3',
    creatorId: '4',
    fileUrl: 'https://example.com/contracts/contract2.pdf',
    signed: {
      brand: true,
      creator: false,
    },
    createdAt: '2023-05-23T00:00:00Z',
    updatedAt: '2023-05-23T00:00:00Z',
  },
];