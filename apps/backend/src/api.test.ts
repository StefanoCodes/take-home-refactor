import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock prisma before importing app
vi.mock('./db.js', () => ({
  prisma: {
    sponsor: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}));

// Mock auth to bypass session validation
vi.mock('./auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

import app from './index.js';
import { prisma } from './db.js';
import { auth } from './auth';

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  image: null,
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSession = {
  id: 'session-1',
  userId: 'user-1',
  token: 'test-token',
  expiresAt: new Date(Date.now() + 86400000),
  createdAt: new Date(),
  updatedAt: new Date(),
};

function authenticateAs(user = mockUser, session = mockSession) {
  vi.mocked(auth.api.getSession).mockResolvedValue({
    user,
    session,
  } as ReturnType<typeof auth.api.getSession> extends Promise<infer T> ? T : never);
}

function unauthenticate() {
  vi.mocked(auth.api.getSession).mockResolvedValue(null as never);
}

const mockSponsor = {
  id: 'sponsor-1',
  userId: 'user-1',
  name: 'Test Sponsor',
  email: 'sponsor@example.com',
  website: 'https://example.com',
  logo: null,
  description: 'A test sponsor',
  industry: 'Tech',
  subscriptionTier: 'FREE',
  subscriptionEndsAt: null,
  isVerified: false,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Sponsors API', () => {
  describe('GET /api/sponsors', () => {
    it('returns an array of sponsors', async () => {
      authenticateAs();
      vi.mocked(prisma.sponsor.findMany).mockResolvedValue([
        { ...mockSponsor, _count: { campaigns: 2 } },
      ] as never);

      const response = await request(app).get('/api/sponsors');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
    });

    it('sponsors have required fields', async () => {
      authenticateAs();
      vi.mocked(prisma.sponsor.findMany).mockResolvedValue([
        { ...mockSponsor, _count: { campaigns: 0 } },
      ] as never);

      const response = await request(app).get('/api/sponsors');

      expect(response.status).toBe(200);
      const sponsor = response.body[0];
      expect(sponsor).toHaveProperty('id');
      expect(sponsor).toHaveProperty('name');
      expect(sponsor).toHaveProperty('email');
      expect(sponsor).toHaveProperty('userId');
    });

    it('returns 401 when not authenticated', async () => {
      unauthenticate();

      const response = await request(app).get('/api/sponsors');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Not authenticated');
    });
  });

  describe('GET /api/sponsors/:id', () => {
    it('returns a single sponsor by ID', async () => {
      authenticateAs();
      vi.mocked(prisma.sponsor.findUnique).mockResolvedValue({
        ...mockSponsor,
        campaigns: [],
        payments: [],
      } as never);

      const response = await request(app).get('/api/sponsors/sponsor-1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('sponsor-1');
      expect(response.body.name).toBe('Test Sponsor');
    });

    it('returns 404 for non-existent sponsor', async () => {
      authenticateAs();
      vi.mocked(prisma.sponsor.findUnique).mockResolvedValue(null);

      const response = await request(app).get('/api/sponsors/non-existent');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Sponsor not found');
    });

    it("returns 403 when accessing another user's sponsor", async () => {
      authenticateAs();
      vi.mocked(prisma.sponsor.findUnique).mockResolvedValue({
        ...mockSponsor,
        userId: 'other-user',
        campaigns: [],
        payments: [],
      } as never);

      const response = await request(app).get('/api/sponsors/sponsor-1');

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Forbidden');
    });
  });

  describe('POST /api/sponsors', () => {
    it('creates a new sponsor', async () => {
      authenticateAs();
      const newSponsor = {
        name: 'New Sponsor',
        email: 'new@example.com',
        website: 'https://new.com',
        description: 'A new sponsor',
        industry: 'Finance',
      };
      vi.mocked(prisma.sponsor.create).mockResolvedValue({
        ...mockSponsor,
        ...newSponsor,
        id: 'sponsor-2',
      } as never);

      const response = await request(app).post('/api/sponsors').send(newSponsor);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('New Sponsor');
      expect(response.body.email).toBe('new@example.com');
    });

    it('returns 400 for missing required fields', async () => {
      authenticateAs();

      const response = await request(app).post('/api/sponsors').send({});

      expect(response.status).toBe(400);
    });

    it('returns 401 when not authenticated', async () => {
      unauthenticate();

      const response = await request(app)
        .post('/api/sponsors')
        .send({ name: 'Test', email: 't@t.com' });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/sponsors/:id', () => {
    it('updates an existing sponsor', async () => {
      authenticateAs();
      vi.mocked(prisma.sponsor.findUnique).mockResolvedValue(mockSponsor as never);
      vi.mocked(prisma.sponsor.update).mockResolvedValue({
        ...mockSponsor,
        name: 'Updated Sponsor',
      } as never);

      const response = await request(app)
        .put('/api/sponsors/sponsor-1')
        .send({ name: 'Updated Sponsor' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Sponsor');
    });

    it('returns 404 for non-existent sponsor', async () => {
      authenticateAs();
      vi.mocked(prisma.sponsor.findUnique).mockResolvedValue(null);

      const response = await request(app)
        .put('/api/sponsors/non-existent')
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Sponsor not found');
    });

    it("returns 403 when updating another user's sponsor", async () => {
      authenticateAs();
      vi.mocked(prisma.sponsor.findUnique).mockResolvedValue({
        ...mockSponsor,
        userId: 'other-user',
      } as never);

      const response = await request(app).put('/api/sponsors/sponsor-1').send({ name: 'Hacked' });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Forbidden');
    });
  });
});

describe('Health API', () => {
  describe('GET /api/health', () => {
    it('returns health status when database is connected', async () => {
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '?column?': 1 }]);

      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.database).toBe('connected');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('returns 503 when database is disconnected', async () => {
      vi.mocked(prisma.$queryRaw).mockRejectedValue(new Error('Connection refused'));

      const response = await request(app).get('/api/health');

      expect(response.status).toBe(503);
      expect(response.body.error).toBe('Database disconnected');
    });
  });
});
