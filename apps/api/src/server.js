import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT ?? 4000);
const JWT_SECRET = process.env.JWT_SECRET ?? 'domesta-dev-secret';

const users = [];
const jobs = [];

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'domesta-api' });
});

app.post('/auth/register', async (req, res) => {
  const schema = z.object({
    role: z.enum(['client', 'worker']),
    fullName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    city: z.string().min(2),
    hourlyRate: z.number().positive().optional(),
    experienceYears: z.number().int().nonnegative().optional(),
    availability: z.array(z.string()).optional()
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const existing = users.find((u) => u.email === parsed.data.email);
  if (existing) {
    return res.status(409).json({ error: 'Email ya registrado' });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = {
    id: randomUUID(),
    role: parsed.data.role,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    passwordHash,
    city: parsed.data.city,
    hourlyRate: parsed.data.hourlyRate,
    experienceYears: parsed.data.experienceYears,
    availability: parsed.data.availability
  };

  users.push(user);
  return res.status(201).json({
    id: user.id,
    role: user.role,
    fullName: user.fullName,
    email: user.email
  });
});

app.post('/auth/login', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const user = users.find((u) => u.email === parsed.data.email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, user: { id: user.id, fullName: user.fullName, role: user.role } });
});

app.get('/workers/search', (req, res) => {
  const city = req.query.city?.toLowerCase();
  const minExp = Number(req.query.minExp ?? 0);
  const maxRate = Number(req.query.maxRate ?? Number.POSITIVE_INFINITY);
  const availability = req.query.availability?.toLowerCase();

  const result = users
    .filter((u) => u.role === 'worker')
    .filter((u) => (city ? u.city.toLowerCase().includes(city) : true))
    .filter((u) => (u.experienceYears ?? 0) >= minExp)
    .filter((u) => (u.hourlyRate ?? Number.POSITIVE_INFINITY) <= maxRate)
    .filter((u) =>
      availability
        ? (u.availability ?? []).some((slot) => slot.toLowerCase().includes(availability))
        : true
    )
    .map((u) => ({
      id: u.id,
      fullName: u.fullName,
      city: u.city,
      hourlyRate: u.hourlyRate,
      experienceYears: u.experienceYears,
      availability: u.availability
    }));

  return res.json(result);
});

app.post('/jobs', (req, res) => {
  const schema = z.object({
    clientId: z.string().uuid(),
    workerId: z.string().uuid(),
    date: z.string(),
    hours: z.number().positive(),
    city: z.string().min(2),
    notes: z.string().optional()
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const job = {
    id: randomUUID(),
    ...parsed.data,
    status: 'pending'
  };

  jobs.push(job);
  return res.status(201).json(job);
});

app.patch('/jobs/:id/status', (req, res) => {
  const schema = z.object({
    status: z.enum(['accepted', 'rejected', 'done'])
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const job = jobs.find((j) => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Trabajo no encontrado' });
  }

  job.status = parsed.data.status;
  return res.json(job);
});

app.listen(PORT, () => {
  console.log(`Domesta API running on http://localhost:${PORT}`);
});
