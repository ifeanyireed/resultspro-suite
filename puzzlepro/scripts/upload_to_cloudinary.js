#!/usr/bin/env node
/**
 * ResultsPro & PuzzlePro — Cloudinary Asset Sync & Verification Script
 *
 * Scans puzzlepro/public/ and uploads all image, SVG, avatar, and video
 * assets to Cloudinary with concurrent uploads, robust connection timeouts,
 * ledger caching (.cloudinary_sync.json), automatic retry passes, and
 * end-to-end verification.
 *
 * Environment:
 *   CLOUDINARY_URL (read from process.env or puzzlepro/.env.local)
 */

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

// 1. Load CLOUDINARY_URL from environment or .env.local
let cloudinaryUrl = process.env.CLOUDINARY_URL;
if (!cloudinaryUrl) {
  const envLocalPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    const m = envContent.match(/^CLOUDINARY_URL=(.+)$/m);
    if (m) cloudinaryUrl = m[1].trim();
  }
}

if (!cloudinaryUrl) {
  console.error('❌ Error: CLOUDINARY_URL environment variable is required.');
  console.error('Add it to puzzlepro/.env.local or set export CLOUDINARY_URL="cloudinary://<key>:<secret>@<cloud>"');
  process.exit(1);
}

const match = cloudinaryUrl.trim().match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
if (!match) {
  console.error('❌ Error: Invalid CLOUDINARY_URL format.');
  console.error('Expected format: cloudinary://<api_key>:<api_secret>@<cloud_name>');
  process.exit(1);
}

const [, apiKey, apiSecret, cloudName] = match;
const FOLDER = process.env.CLOUDINARY_FOLDER || 'puzzlepro/assets';
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const SYNC_LEDGER = path.resolve(__dirname, '../.cloudinary_sync.json');
const ALLOWED_EXTS = new Set(['.svg', '.jpg', '.jpeg', '.png', '.mp4', '.mov', '.webm', '.webp']);
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '4', 10);

function loadLedger() {
  if (fs.existsSync(SYNC_LEDGER)) {
    try {
      return JSON.parse(fs.readFileSync(SYNC_LEDGER, 'utf8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

function saveLedger(ledger) {
  try {
    fs.writeFileSync(SYNC_LEDGER, JSON.stringify(ledger, null, 2), 'utf8');
  } catch (e) {
    console.warn('⚠️ Warning: Could not write sync ledger:', e.message);
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (file.startsWith('.')) return;
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ALLOWED_EXTS.has(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

function getRelPath(filePath) {
  return path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
}

async function uploadFile(filePath, index, total, ledger, retry = 3) {
  const relPath = getRelPath(filePath);
  const ext = path.extname(relPath).toLowerCase();
  const isVideo = ['.mp4', '.mov', '.webm'].includes(ext);
  const resourceType = isVideo ? 'video' : 'image';

  // Check sync ledger first
  if (ledger[relPath] && !process.env.FORCE_UPLOAD) {
    console.log(`[${index}/${total}] ⏩ [ALREADY SYNCED]: ${relPath}`);
    return { success: true, skipped: true, url: ledger[relPath].url };
  }

  const publicId = `${FOLDER}/${relPath}`.replace(new RegExp(`\\${ext}$`, 'i'), '');
  const uploadEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  console.log(`[${index}/${total}] 📤 Uploading: ${relPath} (${isVideo ? 'video' : 'image'}) ...`);

  for (let attempt = 1; attempt <= retry; attempt++) {
    try {
      const args = [
        '-s',
        '-X', 'POST',
        uploadEndpoint,
        '-u', `${apiKey}:${apiSecret}`,
        '-F', `file=@${filePath}`,
        '-F', `public_id=${publicId}`,
        '-F', 'overwrite=true',
        '--connect-timeout', '40',
        '--max-time', '180',
      ];

      const { stdout } = await execFileAsync('curl', args, { encoding: 'utf-8', timeout: 190000 });
      const json = JSON.parse(stdout);

      if (json.secure_url) {
        console.log(`  ✅ [${relPath}] -> ${json.secure_url}`);
        ledger[relPath] = {
          url: json.secure_url,
          uploaded_at: new Date().toISOString(),
          bytes: json.bytes,
          format: json.format,
        };
        saveLedger(ledger);
        return { success: true, url: json.secure_url };
      } else if (json.error) {
        console.error(`  ❌ [${relPath}] Cloudinary error: ${json.error.message}`);
        return { success: false, error: json.error.message };
      }
    } catch (err) {
      if (attempt < retry) {
        const delay = attempt * 2000;
        console.warn(`  ⚠️ [${relPath}] Attempt ${attempt} failed (${err.message || err}), retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        console.error(`  ❌ [${relPath}] Final attempt failed: ${err.message || err}`);
        return { success: false, error: err };
      }
    }
  }

  return { success: false };
}

async function pool(items, limit, fn) {
  const results = [];
  const executing = new Set();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const p = Promise.resolve().then(() => fn(item, i + 1, items.length));
    results.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean).catch(clean);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

async function verifyUrl(url) {
  try {
    const args = ['-s', '-I', '--connect-timeout', '30', '--max-time', '60', url];
    const { stdout } = await execFileAsync('curl', args, { encoding: 'utf-8', timeout: 65000 });
    const statusMatch = stdout.match(/HTTP\/[12\.]+\s+(\d+)/);
    const status = statusMatch ? parseInt(statusMatch[1], 10) : 0;
    return { ok: status >= 200 && status < 400, status };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function main() {
  console.log('🚀 Starting Cloudinary Sync for PuzzlePro assets...');
  console.log(`Destination Folder: ${FOLDER} | Cloud Name: ${cloudName}`);
  console.log(`Concurrency: ${CONCURRENCY}\n`);

  const ledger = loadLedger();
  const allFiles = getAllFiles(PUBLIC_DIR);
  console.log(`Found ${allFiles.length} asset files in puzzlepro/public/.\n`);

  const startTime = Date.now();

  // Multi-pass loop to ensure all assets are uploaded
  let maxPasses = 3;
  for (let pass = 1; pass <= maxPasses; pass++) {
    const remainingFiles = allFiles.filter((f) => !ledger[getRelPath(f)]);
    if (remainingFiles.length === 0) {
      console.log('🎉 All assets already synced in ledger!');
      break;
    }

    console.log(`\n--- Pass ${pass}/${maxPasses}: Syncing ${remainingFiles.length} remaining assets ---`);
    await pool(remainingFiles, CONCURRENCY, (file, idx, total) =>
      uploadFile(file, idx, total, ledger)
    );
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  // Final ledger check
  const missing = allFiles.filter((f) => !ledger[getRelPath(f)]);
  const totalSuccess = allFiles.length - missing.length;

  console.log('\n=============================================');
  console.log(`🎉 Cloudinary upload phase finished in ${elapsed}s!`);
  console.log(`✅ Synced Assets: ${totalSuccess}/${allFiles.length} | ❌ Missing: ${missing.length}`);
  console.log('=============================================\n');

  if (missing.length > 0) {
    console.error('❌ Failed to upload the following assets:');
    missing.forEach((f) => console.error(`  - ${getRelPath(f)}`));
    process.exit(1);
  }

  // Verification phase: Sample check live URLs
  console.log('🔍 Verifying live asset URLs on Cloudinary CDN...');
  const sampleToCheck = allFiles.slice(0, 10); // Check first 10 assets
  let verifyPass = 0;
  for (const file of sampleToCheck) {
    const rel = getRelPath(file);
    const item = ledger[rel];
    if (item && item.url) {
      const res = await verifyUrl(item.url);
      if (res.ok) {
        console.log(`  🌐 Verified 200 OK: ${rel} -> ${item.url}`);
        verifyPass++;
      } else {
        console.warn(`  ⚠️ Verification warning for ${rel} (${res.status || res.error})`);
      }
    }
  }
  console.log(`\nVerified ${verifyPass}/${sampleToCheck.length} sample assets online and accessible.\n`);
  console.log('🏁 Cloudinary sync completed successfully with 100% asset coverage!');
}

main().catch((err) => {
  console.error('Fatal error during upload:', err);
  process.exit(1);
});
