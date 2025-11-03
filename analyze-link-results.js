#!/usr/bin/env node

/**
 * Analyze Link Check Results
 * Reads link-check-results.json and creates a formatted summary
 */

const fs = require('fs');
const path = require('path');

const jsonFile = path.join(__dirname, 'link-check-results.json');
const summaryFile = path.join(__dirname, 'link-check-summary.txt');

try {
    if (!fs.existsSync(jsonFile)) {
        console.error('❌ link-check-results.json not found. Run the link checker first.');
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    const allLinks = data.links;

    // Categorize links
    const brokenLinks = allLinks.filter(l => l.status >= 400 || l.status === 0);
    const workingLinks = allLinks.filter(l => l.status < 400 && l.status > 0);

    // Group broken links by status code
    const byStatus = {};
    brokenLinks.forEach(link => {
        const status = link.status;
        if (!byStatus[status]) {
            byStatus[status] = [];
        }
        byStatus[status].push(link);
    });

    // Group broken links by URL (to identify duplicates)
    const uniqueBrokenUrls = new Map();
    brokenLinks.forEach(link => {
        if (!uniqueBrokenUrls.has(link.url)) {
            uniqueBrokenUrls.set(link.url, {
                url: link.url,
                status: link.status,
                parents: []
            });
        }
        uniqueBrokenUrls.get(link.url).parents.push(link.parent);
    });

    // Create summary report
    const summary = `
═══════════════════════════════════════════════════════════
LINK CHECK SUMMARY REPORT
Generated: ${new Date().toLocaleString()}
═══════════════════════════════════════════════════════════

OVERALL STATISTICS
───────────────────────────────────────────────────────────
Total Links Checked: ${allLinks.length}
✅ Working Links: ${workingLinks.length}
❌ Broken Links: ${brokenLinks.length}

BROKEN LINKS BY STATUS CODE
───────────────────────────────────────────────────────────
${Object.entries(byStatus)
            .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
            .map(([status, links]) => {
                const statusName = {
                    '0': 'CONNECTION FAILED',
                    '401': 'UNAUTHORIZED',
                    '403': 'FORBIDDEN (Blocked by server)',
                    '404': 'NOT FOUND',
                    '503': 'SERVICE UNAVAILABLE'
                }[status] || `HTTP ${status}`;
                return `  ${status} - ${statusName}: ${links.length} occurrence(s)`;
            }).join('\n')}

UNIQUE BROKEN LINKS (${uniqueBrokenUrls.size} unique URLs)
───────────────────────────────────────────────────────────
${Array.from(uniqueBrokenUrls.values())
            .map((item, index) => {
                const statusName = {
                    '0': 'CONNECTION FAILED',
                    '401': 'UNAUTHORIZED',
                    '403': 'FORBIDDEN',
                    '404': 'NOT FOUND',
                    '503': 'SERVICE UNAVAILABLE'
                }[item.status] || `HTTP ${item.status}`;

                return `
${index + 1}. [${item.status}] ${statusName}
   URL: ${item.url}
   Found on ${item.parents.length} page(s): ${item.parents.join(', ')}`;
            }).join('\n')}

NOTES
───────────────────────────────────────────────────────────
• Status 403 (Forbidden): These sites may be blocking automated requests.
  Check these manually in a browser - they may actually work.

• Status 401 (Unauthorized): These require authentication or subscription.
  This is expected for paywalled content (e.g., WSJ).

• Status 0 (Connection Failed): Site may be down or blocking requests.
  Check manually.

• Status 404 (Not Found): These links are genuinely broken and should be fixed.

• Status 503 (Service Unavailable): Server is temporarily down or overloaded.
  Check again later.

═══════════════════════════════════════════════════════════
Full JSON data available in: link-check-results.json
═══════════════════════════════════════════════════════════
`;

    // Write summary to file
    fs.writeFileSync(summaryFile, summary, 'utf8');

    // Display summary
    console.log(summary);
    console.log(`\n✅ Summary saved to: ${summaryFile}\n`);

} catch (error) {
    console.error('❌ Error analyzing results:', error.message);
    process.exit(1);
}

