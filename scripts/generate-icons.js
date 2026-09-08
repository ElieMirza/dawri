#!/usr/bin/env node

/**
 * Icon Generator for DAWRI App
 * 
 * This script generates app icons and splash screens.
 * Run: node scripts/generate-icons.js
 * 
 * Requires: sharp (npm install -D sharp)
 */

const fs = require('fs');
const path = require('path');

const ICON_SIZE = 1024;
const SPLASH_WIDTH = 1284;
const SPLASH_HEIGHT = 2778;
const ADAPTIVE_SIZE = 1024;

const BACKGROUND_COLOR = '#0a0a0f';
const PRIMARY_COLOR = '#00b36b';
const ACCENT_COLOR = '#ffd700';

async function generateIcons() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.log('Sharp not installed. Install with: npm install -D sharp');
    console.log('For now, using placeholder icons.');
    return;
  }

  const assetsDir = path.join(__dirname, '..', 'assets', 'images');

  const svgIcon = `
    <svg width="${ICON_SIZE}" height="${ICON_SIZE}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${BACKGROUND_COLOR}"/>
      <circle cx="512" cy="512" r="380" fill="none" stroke="${PRIMARY_COLOR}" stroke-width="40"/>
      <circle cx="512" cy="512" r="150" fill="${PRIMARY_COLOR}"/>
      <path d="M512 132 L512 892 M132 512 L892 512" stroke="${PRIMARY_COLOR}" stroke-width="20" opacity="0.3"/>
      <text x="512" y="540" font-family="Arial Black, sans-serif" font-size="180" font-weight="900" fill="${ACCENT_COLOR}" text-anchor="middle">الدوري</text>
    </svg>
  `;

  const svgSplash = `
    <svg width="${SPLASH_WIDTH}" height="${SPLASH_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${BACKGROUND_COLOR}"/>
      <circle cx="642" cy="1200" r="250" fill="none" stroke="${PRIMARY_COLOR}" stroke-width="30"/>
      <circle cx="642" cy="1200" r="100" fill="${PRIMARY_COLOR}"/>
      <text x="642" y="1500" font-family="Arial Black, sans-serif" font-size="120" font-weight="900" fill="white" text-anchor="middle">DAWRI</text>
      <text x="642" y="1620" font-family="Arial, sans-serif" font-size="40" fill="#a0a0b0" text-anchor="middle">Lebanese Basketball League</text>
    </svg>
  `;

  try {
    await sharp(Buffer.from(svgIcon))
      .resize(ICON_SIZE, ICON_SIZE)
      .png()
      .toFile(path.join(assetsDir, 'icon.png'));
    console.log('Generated icon.png');

    await sharp(Buffer.from(svgIcon))
      .resize(ADAPTIVE_SIZE, ADAPTIVE_SIZE)
      .png()
      .toFile(path.join(assetsDir, 'adaptive-icon.png'));
    console.log('Generated adaptive-icon.png');

    await sharp(Buffer.from(svgIcon))
      .resize(196, 196)
      .png()
      .toFile(path.join(assetsDir, 'splash-icon.png'));
    console.log('Generated splash-icon.png');

    await sharp(Buffer.from(svgIcon))
      .resize(48, 48)
      .png()
      .toFile(path.join(assetsDir, 'favicon.png'));
    console.log('Generated favicon.png');

    console.log('\\nAll icons generated successfully!');
  } catch (e) {
    console.error('Error generating icons:', e.message);
  }
}

generateIcons();
