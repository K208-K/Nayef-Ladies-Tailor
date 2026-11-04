import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { INITIAL_BOUTIQUE_DB } from './src/data/seedData';
import {
  BoutiqueDatabase,
  Design,
  Category,
  BoutiqueHotspot,
  Order,
  OrderStatus,
  GalleryItem,
} from './src/types/boutique';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'owner@abdulaziznayef.sa').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'tailor2026';

// Persistent JSON storage with automatic fallback to in-memory store
const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'boutique-db.json');

let memoryDb: BoutiqueDatabase = structuredClone(INITIAL_BOUTIQUE_DB);
if (process.env.WHATSAPP_NUMBER && process.env.WHATSAPP_NUMBER !== '+966500000000') {
  memoryDb.settings.whatsappNumber = process.env.WHATSAPP_NUMBER;
}

function loadDatabase(): BoutiqueDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as BoutiqueDatabase;
      parsed.settings.socialLinks = normalizeSocialLinks(parsed.settings.socialLinks);
      memoryDb = parsed;
      return memoryDb;
    }
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch {
    // Read-only container fallback uses memoryDb seamlessly
  }
  return memoryDb;
}

function saveDatabase(db: BoutiqueDatabase): void {
  memoryDb = db;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch {
    // Keep updated in memory if filesystem is read-only
  }
}

// Active admin sessions (in-memory secure random tokens)
const activeAdminTokens = new Map<string, { email: string; expiresAt: number }>();

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing admin session token.' });
    return;
  }
  const token = authHeader.slice(7).trim();
  const session = activeAdminTokens.get(token);
  if (!session || session.expiresAt < Date.now()) {
    activeAdminTokens.delete(token);
    res.status(401).json({ error: 'Unauthorized: Session expired or invalid.' });
    return;
  }
  next();
}

function sanitizeText(value: unknown, maxLen = 1000): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

function normalizeSocialLinks(value: unknown): BoutiqueDatabase['settings']['socialLinks'] {
  const links = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  return {
    instagram: sanitizeText(links.instagram, 240),
    facebook: sanitizeText(links.facebook, 240),
    tiktok: sanitizeText(links.tiktok, 240),
    youtube: sanitizeText(links.youtube, 240),
    snapchat: sanitizeText(links.snapchat, 240),
  };
}

const VALID_STATUSES: OrderStatus[] = [
  'New',
  'Contacted',
  'Confirmed',
  'In Production',
  'Ready',
  'Completed',
  'Cancelled',
];

async function startServer() {
  loadDatabase();
  const app = express();
  app.use(express.json({ limit: '8mb' }));

  // Public bootstrap endpoint for initial hydration
  app.get('/api/bootstrap', (_req: Request, res: Response) => {
    const db = loadDatabase();
    res.json({
      categories: db.categories,
      designs: db.designs,
      hotspots: db.hotspots,
      gallery: db.gallery,
      testimonials: db.testimonials,
      settings: db.settings,
    });
  });

  // Public Order Creation (WhatsApp Bespoke Ordering System)
  app.post('/api/orders', (req: Request, res: Response) => {
    const db = loadDatabase();
    const body = req.body || {};

    const customerName = sanitizeText(body.customerName, 120);
    const customerPhone = sanitizeText(body.customerPhone, 32);
    const customerCity = sanitizeText(body.customerCity, 80) || 'Riyadh';
    const designId = sanitizeText(body.designId, 80);

    if (!customerName || !customerPhone || !designId) {
      res.status(400).json({
        error: 'Customer name, phone number, and selected design are required.',
      });
      return;
    }

    const design = db.designs.find((d) => d.id === designId);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    const reference = `ANT-${year}-${randomDigits}`;

    const newOrder: Order = {
      id: `ord-${crypto.randomUUID().slice(0, 8)}`,
      reference,
      createdAt: new Date().toISOString(),
      designId,
      designName: design
        ? design.name
        : {
            en: sanitizeText(body.designName?.en, 140) || 'Custom Couture Commission',
            ar: sanitizeText(body.designName?.ar, 140) || 'تصميم خاص حسب الطلب',
          },
      selectedColor: {
        en: sanitizeText(body.selectedColor?.en, 80) || 'Signature Palette',
        ar: sanitizeText(body.selectedColor?.ar, 80) || 'اللون الأساسي',
      },
      selectedFabric: {
        en: sanitizeText(body.selectedFabric?.en, 100) || 'Atelier Silk Crepe',
        ar: sanitizeText(body.selectedFabric?.ar, 100) || 'كريب حريري فاخر',
      },
      customizationInstructions: sanitizeText(body.customizationInstructions, 1200),
      measurementMethod: body.measurementMethod === 'in-store' ? 'in-store' : 'custom',
      measurements:
        body.measurementMethod === 'custom' && body.measurements
          ? {
              unit: body.measurements.unit === 'in' ? 'in' : 'cm',
              length: sanitizeText(body.measurements.length, 16),
              bust: sanitizeText(body.measurements.bust, 16),
              waist: sanitizeText(body.measurements.waist, 16),
              hips: sanitizeText(body.measurements.hips, 16),
              shoulder: sanitizeText(body.measurements.shoulder, 16),
              sleeve: sanitizeText(body.measurements.sleeve, 16),
            }
          : undefined,
      preferredFittingDate: sanitizeText(body.preferredFittingDate, 30) || undefined,
      preferredFittingTime: sanitizeText(body.preferredFittingTime, 30) || undefined,
      customerName,
      customerPhone,
      customerEmail: sanitizeText(body.customerEmail, 120) || undefined,
      customerCity,
      locale: body.locale === 'ar' ? 'ar' : 'en',
      status: 'New',
      estimatedPriceSar: design?.priceSar,
    };

    db.orders.unshift(newOrder);
    saveDatabase(db);

    res.status(201).json({ order: newOrder });
  });

  // Public Contact / Private Fitting Inquiry
  app.post('/api/inquiries', (req: Request, res: Response) => {
    const db = loadDatabase();
    const body = req.body || {};
    const name = sanitizeText(body.name, 120);
    const phone = sanitizeText(body.phone, 32);
    const message = sanitizeText(body.message, 1200);

    if (!name || !phone || !message) {
      res.status(400).json({ error: 'Name, phone, and message are required.' });
      return;
    }

    const inquiry = {
      id: `inq-${crypto.randomUUID().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      name,
      phone,
      email: sanitizeText(body.email, 120),
      serviceType: sanitizeText(body.serviceType, 80) || 'Private Salon Consultation',
      message,
    };

    db.inquiries.unshift(inquiry);
    saveDatabase(db);
    res.status(201).json({ inquiry });
  });

  // Admin Authentication Endpoints
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const email = sanitizeText(req.body?.email, 120).toLowerCase();
    const password = sanitizeText(req.body?.password, 120);

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: 'Invalid atelier owner credentials.' });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    activeAdminTokens.set(token, {
      email,
      expiresAt: Date.now() + 1000 * 60 * 60 * 12, // 12 hours
    });

    res.json({ token, email });
  });

  app.get('/api/auth/verify', requireAdmin, (_req: Request, res: Response) => {
    res.json({ authenticated: true, email: ADMIN_EMAIL });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      activeAdminTokens.delete(authHeader.slice(7).trim());
    }
    res.json({ ok: true });
  });

  // Protected Admin Dashboard Data
  app.get('/api/admin/overview', requireAdmin, (_req: Request, res: Response) => {
    const db = loadDatabase();
    res.json({
      orders: db.orders,
      inquiries: db.inquiries,
      categories: db.categories,
      designs: db.designs,
      hotspots: db.hotspots,
      gallery: db.gallery,
      settings: db.settings,
    });
  });

  // Admin Order Status Updates & Deletion
  app.patch('/api/admin/orders/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }
    const nextStatus = req.body?.status as OrderStatus;
    if (!VALID_STATUSES.includes(nextStatus)) {
      res.status(400).json({ error: 'Invalid order status.' });
      return;
    }
    order.status = nextStatus;
    saveDatabase(db);
    res.json({ order });
  });

  // Admin Designs CRUD
  app.post('/api/admin/designs', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const body = req.body || {};
    const nameEn = sanitizeText(body.name?.en, 140);
    const nameAr = sanitizeText(body.name?.ar, 140);

    if (!nameEn || !nameAr) {
      res.status(400).json({ error: 'Both English and Arabic design names are required.' });
      return;
    }

    const slugBase = nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = `des-${crypto.randomUUID().slice(0, 6)}`;

    const design: Design = {
      id,
      slug: `${slugBase}-${id.slice(-4)}`,
      name: { en: nameEn, ar: nameAr },
      categorySlug: sanitizeText(body.categorySlug, 60) || 'abayas',
      shortDescription: {
        en: sanitizeText(body.shortDescription?.en, 260) || nameEn,
        ar: sanitizeText(body.shortDescription?.ar, 260) || nameAr,
      },
      description: {
        en: sanitizeText(body.description?.en, 1500) || nameEn,
        ar: sanitizeText(body.description?.ar, 1500) || nameAr,
      },
      priceSar: body.priceSar ? Number(body.priceSar) : undefined,
      fabric: {
        en: sanitizeText(body.fabric?.en, 140) || 'Japanese Silk Crepe',
        ar: sanitizeText(body.fabric?.ar, 140) || 'كريب حريري ياباني',
      },
      embroideryDetails: {
        en: sanitizeText(body.embroideryDetails?.en, 240) || 'Hand-embroidered champagne gold detailing.',
        ar: sanitizeText(body.embroideryDetails?.ar, 240) || 'تطريز يدوي بخيوط الذهب الشامبين.',
      },
      customizationNotes: {
        en: sanitizeText(body.customizationNotes?.en, 240) || 'Tailored to custom measurements.',
        ar: sanitizeText(body.customizationNotes?.ar, 240) || 'تفصيل خاص حسب المقاس.',
      },
      leadTimeDays: Number(body.leadTimeDays) || 12,
      colors:
        Array.isArray(body.colors) && body.colors.length > 0
          ? body.colors
          : [
              {
                id: 'col-default',
                name: { en: 'Midnight Black & Gold', ar: 'أسود ملكي وذهبي' },
                hex: '#171512',
              },
            ],
      availableFabrics:
        Array.isArray(body.availableFabrics) && body.availableFabrics.length > 0
          ? body.availableFabrics
          : [{ en: 'Japanese Silk Crepe', ar: 'كريب حريري ياباني' }],
      mainImageKey: sanitizeText(body.mainImageKey, 800000) || 'black_gold_abaya',
      galleryImageKeys: Array.isArray(body.galleryImageKeys)
        ? body.galleryImageKeys
        : [sanitizeText(body.mainImageKey, 800000) || 'black_gold_abaya'],
      featured: Boolean(body.featured),
      isNewArrival: Boolean(body.isNewArrival),
    };

    db.designs.unshift(design);
    saveDatabase(db);
    res.status(201).json({ design });
  });

  app.put('/api/admin/designs/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const idx = db.designs.findIndex((d) => d.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Design not found.' });
      return;
    }
    const existing = db.designs[idx];
    const body = req.body || {};

    const updated: Design = {
      ...existing,
      name: {
        en: sanitizeText(body.name?.en, 140) || existing.name.en,
        ar: sanitizeText(body.name?.ar, 140) || existing.name.ar,
      },
      categorySlug: sanitizeText(body.categorySlug, 60) || existing.categorySlug,
      shortDescription: {
        en: sanitizeText(body.shortDescription?.en, 260) || existing.shortDescription.en,
        ar: sanitizeText(body.shortDescription?.ar, 260) || existing.shortDescription.ar,
      },
      description: {
        en: sanitizeText(body.description?.en, 1500) || existing.description.en,
        ar: sanitizeText(body.description?.ar, 1500) || existing.description.ar,
      },
      priceSar: body.priceSar !== undefined && body.priceSar !== '' ? Number(body.priceSar) : undefined,
      fabric: {
        en: sanitizeText(body.fabric?.en, 140) || existing.fabric.en,
        ar: sanitizeText(body.fabric?.ar, 140) || existing.fabric.ar,
      },
      embroideryDetails: {
        en: sanitizeText(body.embroideryDetails?.en, 240) || existing.embroideryDetails.en,
        ar: sanitizeText(body.embroideryDetails?.ar, 240) || existing.embroideryDetails.ar,
      },
      customizationNotes: {
        en: sanitizeText(body.customizationNotes?.en, 240) || existing.customizationNotes.en,
        ar: sanitizeText(body.customizationNotes?.ar, 240) || existing.customizationNotes.ar,
      },
      leadTimeDays: Number(body.leadTimeDays) || existing.leadTimeDays,
      mainImageKey: sanitizeText(body.mainImageKey, 800000) || existing.mainImageKey,
      featured: body.featured !== undefined ? Boolean(body.featured) : existing.featured,
      isNewArrival: body.isNewArrival !== undefined ? Boolean(body.isNewArrival) : existing.isNewArrival,
    };

    db.designs[idx] = updated;
    saveDatabase(db);
    res.json({ design: updated });
  });

  app.delete('/api/admin/designs/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    db.designs = db.designs.filter((d) => d.id !== req.params.id);
    db.hotspots = db.hotspots.filter((h) => h.designId !== req.params.id);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Admin Categories CRUD
  app.post('/api/admin/categories', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const nameEn = sanitizeText(req.body?.name?.en, 80);
    const nameAr = sanitizeText(req.body?.name?.ar, 80);
    if (!nameEn || !nameAr) {
      res.status(400).json({ error: 'Category names in English and Arabic are required.' });
      return;
    }
    const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category: Category = {
      id: `cat-${crypto.randomUUID().slice(0, 6)}`,
      slug,
      name: { en: nameEn, ar: nameAr },
      description: {
        en: sanitizeText(req.body?.description?.en, 240) || nameEn,
        ar: sanitizeText(req.body?.description?.ar, 240) || nameAr,
      },
      featured: Boolean(req.body?.featured),
      coverImageKey: sanitizeText(req.body?.coverImageKey, 800000) || 'black_gold_abaya',
    };
    db.categories.push(category);
    saveDatabase(db);
    res.status(201).json({ category });
  });

  app.delete('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    db.categories = db.categories.filter((c) => c.id !== req.params.id);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Admin Virtual Boutique Hotspots Management
  app.post('/api/admin/hotspots', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const body = req.body || {};
    const sceneId =
      body.sceneId === 'exterior' || body.sceneId === 'interior-right'
        ? body.sceneId
        : 'interior-left';

    const hotspot: BoutiqueHotspot = {
      id: `hs-${crypto.randomUUID().slice(0, 6)}`,
      sceneId,
      xPercent: Math.max(4, Math.min(96, Number(body.xPercent) || 50)),
      yPercent: Math.max(8, Math.min(92, Number(body.yPercent) || 55)),
      label: {
        en: sanitizeText(body.label?.en, 100) || 'Couture Display',
        ar: sanitizeText(body.label?.ar, 100) || 'تصميم راقٍ',
      },
      subtitle: {
        en: sanitizeText(body.subtitle?.en, 120) || 'Showroom Display',
        ar: sanitizeText(body.subtitle?.ar, 120) || 'منصة العرض',
      },
      designId: sanitizeText(body.designId, 80) || db.designs[0]?.id || '',
      active: body.active !== undefined ? Boolean(body.active) : true,
    };

    db.hotspots.push(hotspot);
    saveDatabase(db);
    res.status(201).json({ hotspot });
  });

  app.put('/api/admin/hotspots/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const idx = db.hotspots.findIndex((h) => h.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Hotspot not found.' });
      return;
    }
    const existing = db.hotspots[idx];
    const body = req.body || {};
    db.hotspots[idx] = {
      ...existing,
      xPercent: body.xPercent !== undefined ? Math.max(4, Math.min(96, Number(body.xPercent))) : existing.xPercent,
      yPercent: body.yPercent !== undefined ? Math.max(8, Math.min(92, Number(body.yPercent))) : existing.yPercent,
      label: {
        en: sanitizeText(body.label?.en, 100) || existing.label.en,
        ar: sanitizeText(body.label?.ar, 100) || existing.label.ar,
      },
      subtitle: {
        en: sanitizeText(body.subtitle?.en, 120) || existing.subtitle.en,
        ar: sanitizeText(body.subtitle?.ar, 120) || existing.subtitle.ar,
      },
      designId: sanitizeText(body.designId, 80) || existing.designId,
      active: body.active !== undefined ? Boolean(body.active) : existing.active,
    };
    saveDatabase(db);
    res.json({ hotspot: db.hotspots[idx] });
  });

  app.delete('/api/admin/hotspots/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    db.hotspots = db.hotspots.filter((h) => h.id !== req.params.id);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Admin Gallery Management
  app.post('/api/admin/gallery', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const body = req.body || {};
    const item: GalleryItem = {
      id: `gal-${crypto.randomUUID().slice(0, 6)}`,
      title: {
        en: sanitizeText(body.title?.en, 120) || 'Atelier Editorial',
        ar: sanitizeText(body.title?.ar, 120) || 'لقطة من الأتيليه',
      },
      caption: {
        en: sanitizeText(body.caption?.en, 240) || '',
        ar: sanitizeText(body.caption?.ar, 240) || '',
      },
      category: ['architecture', 'craftsmanship', 'bridal', 'evening'].includes(body.category)
        ? body.category
        : 'evening',
      imageKey: sanitizeText(body.imageKey, 800000) || 'black_gold_abaya',
      aspect: body.aspect === 'landscape' ? 'landscape' : 'portrait',
    };
    db.gallery.unshift(item);
    saveDatabase(db);
    res.status(201).json({ item });
  });

  app.delete('/api/admin/gallery/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    db.gallery = db.gallery.filter((g) => g.id !== req.params.id);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Admin Website Content & WhatsApp Configuration
  app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const body = req.body || {};
    const rawWa = sanitizeText(body.whatsappNumber, 24);
    if (rawWa && !/^\+966[0-9]{8,10}$/.test(rawWa.replace(/\s+/g, ''))) {
      res.status(400).json({
        error: 'WhatsApp number must be a valid Saudi format starting with +966 (e.g. +966500000000).',
      });
      return;
    }

    db.settings = {
      boutiqueName: {
        en: sanitizeText(body.boutiqueName?.en, 80) || db.settings.boutiqueName.en,
        ar: sanitizeText(body.boutiqueName?.ar, 80) || db.settings.boutiqueName.ar,
      },
      tagline: {
        en: sanitizeText(body.tagline?.en, 160) || db.settings.tagline.en,
        ar: sanitizeText(body.tagline?.ar, 160) || db.settings.tagline.ar,
      },
      heroHeadline: {
        en: sanitizeText(body.heroHeadline?.en, 200) || db.settings.heroHeadline.en,
        ar: sanitizeText(body.heroHeadline?.ar, 200) || db.settings.heroHeadline.ar,
      },
      heroSubheadline: {
        en: sanitizeText(body.heroSubheadline?.en, 360) || db.settings.heroSubheadline.en,
        ar: sanitizeText(body.heroSubheadline?.ar, 360) || db.settings.heroSubheadline.ar,
      },
      whatsappNumber: rawWa ? rawWa.replace(/\s+/g, '') : db.settings.whatsappNumber,
      salonAddress: {
        en: sanitizeText(body.salonAddress?.en, 240) || db.settings.salonAddress.en,
        ar: sanitizeText(body.salonAddress?.ar, 240) || db.settings.salonAddress.ar,
      },
      salonHours: {
        en: sanitizeText(body.salonHours?.en, 240) || db.settings.salonHours.en,
        ar: sanitizeText(body.salonHours?.ar, 240) || db.settings.salonHours.ar,
      },
      contactEmail: sanitizeText(body.contactEmail, 120) || db.settings.contactEmail,
      instagramHandle: sanitizeText(body.instagramHandle, 80) || db.settings.instagramHandle,
      socialLinks: {
        ...normalizeSocialLinks(body.socialLinks ?? db.settings.socialLinks),
      },
    };

    saveDatabase(db);
    res.json({ settings: db.settings });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Amani Couture server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
