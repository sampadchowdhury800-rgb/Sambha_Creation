/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Database Seed Script (Prisma v7)
   Seeds admin account + migrates existing articles
   Run: npx prisma db seed
   ══════════════════════════════════════════════════════════════ */

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, ArticleStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Load env manually
import fs from 'node:fs';
import path from 'node:path';

function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = val;
      }
      break;
    }
  }
}

loadEnv();

// Create Prisma client with adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ── Existing articles data ───────────────────────────────────
const existingArticles = [
  {
    id: '1',
    title: 'Jaipur Momo Vendor Suffers Severe Burns During CM Convoy Road Clearance, Investigation Underway',
    category: 'Crime',
    author: 'Sambha Creation',
    date: '2026-06-26',
    headline: 'A 27-year-old street vendor in Jaipur sustained serious burn injuries after boiling water reportedly spilled during a police road-clearance',
    description: 'A 27-year-old street vendor in Jaipur sustained serious burn injuries after boiling water reportedly spilled during a police road-clearance operation ahead of Rajasthan Chief Minister Bhajan Lal Sharma\'s convoy. Authorities have launched an investigation as the incident draws widespread public attention.',
    instagramVideo: 'https://www.instagram.com/reel/DaC0_6rvdmm/?igsh=MThlZ3ZsN2psMWZtMA==',
    tags: ['jaipur', 'streetvendor', 'rajesthan', 'momoseller', 'Reshu gupta', 'breakingnews'],
  },
  {
    id: '2',
    title: 'Bengaluru Triple Murder Case: Software Engineer and Live-in Partner Arrested Over Alleged Killing of Parents and Sister',
    category: 'Crime',
    author: 'Sambha Creation',
    date: '2026-06-28',
    headline: 'A triple murder in Bengaluru has shocked the nation after police arrested a software engineer and her live-in partner for allegedly killing her parents and younger sister.',
    description: 'A triple murder in Bengaluru has shocked the nation after police arrested a software engineer and her live-in partner for allegedly killing her parents and younger sister. Investigators believe the crime was preceded by long-standing family disputes and financial troubles, while the case remains under judicial investigation.',
    instagramVideo: 'https://www.instagram.com/reel/DaIFd2zRVcA/?igsh=MWN4b3lzZm1oOTlxYg==',
    tags: ['Bangaluru', 'karnataka', 'Triple murder', 'Family Dispute', 'Live in relationship', 'kr puram'],
  },
  {
    id: '3',
    title: 'Mumbai on Edge After Another Stabbing Near Mahim Station, Two Days After Local Train Murder',
    category: 'Crime',
    author: 'Cultural Affairs Desk',
    date: '2026-06-29',
    headline: 'A 35-year-old man was allegedly stabbed outside Mahim railway station following a minor altercation.',
    description: 'A 35-year-old man was allegedly stabbed outside Mahim railway station following a minor altercation, just 48 hours after the fatal stabbing of commuter Mayank Lohar inside a Mumbai local train. The latest incident has intensified concerns over public safety and rising knife-related violence in the city.',
    instagramVideo: 'https://www.instagram.com/reel/DaKnqC_tiF2/?igsh=ZTg2NTNhazc2NXgw',
    tags: ['Mumbai', 'stabbing', 'Navin Prasanna', 'police investigation', 'Knif Attack', 'local train'],
  },
  {
    id: '4',
    title: 'Government Probes BAT-BMS App After Alleged Remote Shutdowns Leave E-Rickshaw Drivers Stranded',
    category: 'Cybersecurity',
    author: 'Sambha Creation',
    date: '2026-07-01',
    headline: 'The Central Government has launched an investigation into the BAT-BMS mobile application after multiple reports alleged that it was being misused to remotely disable Bluetooth-enabled e-rickshaws.',
    description: 'The Centre has initiated an investigation after reports emerged that the BAT-BMS mobile application was allegedly being misused to remotely disable Bluetooth-enabled e-rickshaws. The incident has raised concerns over electric vehicle cybersecurity, driver safety, and the need for stricter regulations on connected battery management systems.',
    instagramVideo: 'https://www.instagram.com/reel/DaScJhDs62C/?igsh=NHgyY281b3N0anRq',
    tags: ['BAT-BMS', 'Cybersecurity', 'Battery Management System', 'EV'],
  },
  {
    id: '5',
    title: 'Scientists Discover a New Bioluminescent Deep-Sea Species in the Indian Ocean',
    category: 'Science',
    author: 'Science Correspondent',
    date: '2026-07-06',
    headline: 'Marine biologists from IISc identify a mesmerizing new species that produces complex living-light patterns in the Andaman Trench',
    description: 'In a discovery that reads like science fiction, researchers from the Indian Institute of Science have catalogued a previously unknown deep-sea species displaying extraordinary bioluminescent communication patterns — potentially unlocking new understanding of life at the ocean\'s darkest depths.',
    instagramVideo: 'https://www.instagram.com/_sambha_creation?igsh=OTZiYXdtazNyeTM0',
    tags: ['science', 'marine', 'discovery', 'bioluminescence', 'ocean', 'india', 'research'],
  },
  {
    id: '6',
    title: 'Monsoon Returns Early: Kerala\'s Tea Gardens Rejoice After Historic Drought',
    category: 'Nature',
    author: 'Bharti Shaw',
    date: '2026-07-05',
    headline: 'The southwest monsoon arrives ten days ahead of schedule, bringing life back to parched Munnar hillscapes',
    description: 'After a devastating dry spell that threatened one of India\'s most celebrated tea-growing regions, the early arrival of the southwest monsoon has brought relief, renewal, and an outpouring of joy to the farming communities of Munnar and the Wayanad highlands.',
    instagramVideo: '',
    tags: ['nature', 'monsoon', 'kerala', 'tea', 'environment', 'agriculture'],
  },
  {
    id: '7',
    title: 'Agra Cantt Railway Station: RPF Constable and Deputy Station Superintendent Clash Over Injured Passenger, Inquiry Ordered',
    category: 'India',
    author: 'Environment Desk',
    date: '2026-07-13',
    headline: 'A dispute between an RPF constable and a Deputy Station Superintendent (DSS) at Agra Cantt Railway Station allegedly escalated into a physical altercation.',
    description: 'Railway authorities have ordered an inquiry after an RPF constable and a Deputy Station Superintendent allegedly clashed at Agra Cantt Railway Station over the handling of an injured passenger.',
    instagramVideo: '',
    tags: ['Agra Cantt', 'Indian Railways', 'RPF', 'Deputy Station Superintendent', 'Uttar Pradesh', 'Railway Station', 'Inquiry', 'Injured Passenger', 'Railway News'],
  },
];

const articleContents: Record<string, string> = {
  '1': `<p>A roadside clearance operation ahead of Rajasthan Chief Minister Bhajan Lal Sharma's convoy has sparked widespread public concern after 27-year-old momo vendor Reshu Gupta suffered severe burn injuries in Jaipur. The incident occurred near Mahal Road in Jagatpura, where the vendor was preparing for business when police asked roadside vendors to vacate the area.</p><p>According to Reshu Gupta's complaint, she informed police officers that the steamer on her cart contained boiling water and requested a few moments to move it safely. She alleges that despite her warning, the cart was pushed during the clearance operation, causing the hot water to spill over her body and leave her with serious burns.</p><p>The injured vendor was rushed to a nearby hospital, where she continues to receive treatment. Her family says she suffered burns on multiple parts of her body and faces a lengthy recovery. They also allege that the officers involved failed to immediately assist her following the incident.</p><p>Police officials have confirmed that an investigation is underway. Authorities are reviewing CCTV footage, recording witness statements, and examining all available evidence to determine exactly how the incident unfolded. Officials have stated that appropriate action will be taken if negligence is established.</p><p>The Rajasthan government has announced that it will cover the cost of the victim's medical treatment and provide financial assistance to support her family. Reports also indicate that disciplinary action has been initiated against the police personnel involved while the inquiry continues.</p><p>The incident has triggered widespread debate over the implementation of VIP security protocols and their impact on ordinary citizens. Many have called for greater accountability and improved safety measures during convoy-related road clearance operations.</p><p>As the investigation continues, officials have urged the public to await the final findings before drawing conclusions. The case remains under official review, and further developments are expected once the inquiry is completed.</p>`,
  '2': `<p>A shocking triple murder case in Bengaluru has taken a new turn after police arrested a 25-year-old software engineer, Shwetha, and her live-in partner, Kenneth, in connection with the alleged killing of her parents and younger sister.</p><p>According to investigators, the victims have been identified as Somasundar, Muthulakshmi, and Shwetha's younger sister, Supriya. Police allege that the three were found dead inside an apartment in Seegehalli after suffering multiple stab injuries.</p><p>Police claim the accused fled Bengaluru shortly after the incident in an apparent attempt to avoid arrest. Investigators tracked their movements through CCTV footage and other evidence before locating Shwetha in Puducherry.</p><p>According to the police, the alleged motive appears to be linked to long-standing family tensions surrounding Shwetha's live-in relationship with Kenneth and mounting financial difficulties.</p><p>During the investigation, police recovered electronic devices, CCTV footage, and other material that they believe could help establish the sequence of events.</p><p>The murders have sparked widespread public discussion across Karnataka and the rest of the country.</p><p>Legal experts note that the allegations against the accused have not yet been tested in court. Under Indian law, every accused person is presumed innocent until proven guilty.</p>`,
  '3': `<p>A 35-year-old man was allegedly stabbed outside Mahim railway station following a minor altercation, just 48 hours after the fatal stabbing of commuter Mayank Lohar inside a Mumbai local train.</p><p>The latest incident has intensified concerns over public safety and rising knife-related violence in the city.</p>`,
  '4': `<p>The Central Government has launched an investigation into the BAT-BMS mobile application after multiple reports alleged that it was being misused to remotely disable Bluetooth-enabled e-rickshaws.</p><p>The controversy has raised serious concerns over electric vehicle cybersecurity and the livelihoods of thousands of drivers across India.</p>`,
  '5': `<p>Marine biologists from IISc identify a mesmerizing new species that produces complex living-light patterns in the Andaman Trench.</p>`,
  '6': `<p>After a devastating dry spell that threatened one of India's most celebrated tea-growing regions, the early arrival of the southwest monsoon has brought relief, renewal, and an outpouring of joy to the farming communities of Munnar and the Wayanad highlands.</p>`,
  '7': `<p>A dispute between an RPF constable and a Deputy Station Superintendent (DSS) at Agra Cantt Railway Station allegedly escalated into a physical altercation after a disagreement over assisting an injured passenger. Railway authorities have initiated an inquiry to determine the sequence of events and fix responsibility.</p>`,
};

const categoryConfig: Record<string, { emoji: string; cssClass: string }> = {
  Crime: { emoji: '🚨', cssClass: 'cat-default' },
  Cybersecurity: { emoji: '🔒', cssClass: 'cat-technology' },
  Science: { emoji: '🔬', cssClass: 'cat-science' },
  Nature: { emoji: '🌿', cssClass: 'cat-nature' },
  India: { emoji: '🇮🇳', cssClass: 'cat-default' },
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

function countWords(text: string): number {
  return text.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
}

async function main() {
  console.log('🌱 Seeding database...');

  // ── 1. Seed Admin ──────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'sampadchowdhury777@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Wb240929@bhartichowdhury321';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Sambha Admin',
    },
  });
  console.log(`✅ Admin created: ${adminEmail}`);

  // ── 2. Seed Categories ─────────────────────────────────────
  const categories: Record<string, string> = {};
  for (const [name, config] of Object.entries(categoryConfig)) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug: name.toLowerCase(),
        emoji: config.emoji,
        cssClass: config.cssClass,
      },
    });
    categories[name] = cat.id;
  }
  console.log(`✅ Categories created: ${Object.keys(categories).join(', ')}`);

  // ── 3. Seed Articles ───────────────────────────────────────
  for (const article of existingArticles) {
    const slug = generateSlug(article.title);
    const content = articleContents[article.id] || `<p>${article.description}</p>`;
    const words = countWords(content);
    const readingTime = Math.max(1, Math.ceil(words / 200));

    // Create or connect tags
    const tagRecords = [];
    for (const tagName of article.tags) {
      const tagSlug = generateSlug(tagName);
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName, slug: tagSlug },
      });
      tagRecords.push({ id: tag.id });
    }

    await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        title: article.title,
        slug,
        headline: article.headline,
        description: article.description,
        content,
        author: article.author,
        categoryId: categories[article.category],
        instagramVideo: article.instagramVideo || null,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(article.date),
        readingTime,
        wordCount: words,
        seoTitle: `${article.title} — Sambha Creation`,
        seoDescription: article.description.slice(0, 160),
        tags: {
          connect: tagRecords,
        },
      },
    });

    console.log(`  📰 Article seeded: ${article.title.slice(0, 60)}...`);
  }

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
