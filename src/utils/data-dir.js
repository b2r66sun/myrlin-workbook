/**
 * Resolve the Myrlin data directory (~/.myrlin) and handle
 * one-time migration from the legacy project-local state/ folder.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_DIR = path.join(os.homedir(), '.myrlin');

/**
 * Return the path to the shared data directory, creating it if needed.
 * @returns {string}
 */
function getDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  return DATA_DIR;
}

/**
 * Migrate state files from a legacy project-local directory to ~/.myrlin.
 * Only copies files that don't already exist in the target.
 * @param {string} legacyDir - Absolute path to the old state/ folder
 */
function migrateFromLegacy(legacyDir) {
  if (!legacyDir || !fs.existsSync(legacyDir)) {
    return;
  }
  const targetDir = getDataDir();
  const files = fs.readdirSync(legacyDir);
  for (const file of files) {
    const src = path.join(legacyDir, file);
    const dest = path.join(targetDir, file);
    if (!fs.existsSync(dest) && fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  }
}

module.exports = { getDataDir, migrateFromLegacy };
