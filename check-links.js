#!/usr/bin/env node

/**
 * Link Checker Script
 * Checks all links on https://www.virginiaopioidcostdata.org/ and saves results to a file
 * 
 * Usage:
 *   node check-links.js
 * 
 * Requires: npm install -g linkinator (or npx linkinator)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const siteUrl = 'https://www.virginiaopioidcostdata.org/';
const outputFile = path.join(__dirname, 'link-check-results.txt');
const jsonOutputFile = path.join(__dirname, 'link-check-results.json');

console.log(`🔍 Checking links on ${siteUrl}...`);
console.log(`📝 Results will be saved to:\n   - ${outputFile}\n   - ${jsonOutputFile}\n`);

try {
    // Run linkinator and capture output
    const command = `npx linkinator ${siteUrl} --recurse --silent --format json > ${jsonOutputFile} 2>&1 && npx linkinator ${siteUrl} --recurse --format text`;

    console.log('⏳ Running link check (this may take a few minutes)...\n');

    const output = execSync(command, {
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });

    // Save text output to file
    fs.writeFileSync(outputFile, output, 'utf8');

    // Parse and summarize JSON results
    if (fs.existsSync(jsonOutputFile)) {
        const jsonData = fs.readFileSync(jsonOutputFile, 'utf8');
        try {
            const results = JSON.parse(jsonData);

            // Count broken links
            const brokenLinks = results.links.filter(link => link.status >= 400 || link.status === 0);
            const workingLinks = results.links.filter(link => link.status < 400 && link.status > 0);

            const summary = `
═══════════════════════════════════════════════════════════
LINK CHECK SUMMARY
═══════════════════════════════════════════════════════════
Total Links Checked: ${results.links.length}
✅ Working Links: ${workingLinks.length}
❌ Broken Links: ${brokenLinks.length}

${brokenLinks.length > 0 ? `
BROKEN LINKS:
${brokenLinks.map(link => `  - [${link.status}] ${link.url}`).join('\n')}
` : '✅ No broken links found!'}
═══════════════════════════════════════════════════════════

Full results saved to:
  - ${outputFile}
  - ${jsonOutputFile}
`;

            console.log(summary);

            // Append summary to output file
            fs.appendFileSync(outputFile, summary, 'utf8');
        } catch (e) {
            console.log('⚠️  Could not parse JSON results, but text output saved.');
        }
    }

    console.log(`\n✅ Link check complete! Results saved.`);

} catch (error) {
    console.error('❌ Error running link checker:', error.message);

    // Try to save whatever output we got
    if (error.stdout) {
        fs.writeFileSync(outputFile, error.stdout, 'utf8');
        console.log(`📝 Partial results saved to ${outputFile}`);
    }

    // Check if linkinator is installed
    try {
        execSync('npx linkinator --version', { encoding: 'utf8', stdio: 'ignore' });
    } catch (e) {
        console.log('\n💡 Tip: Make sure you have Node.js installed. The script uses npx to run linkinator.');
    }

    process.exit(1);
}

