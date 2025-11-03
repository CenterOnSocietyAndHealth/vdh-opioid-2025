# Link Checker - Quick Guide

This project includes a script to check all links on the Virginia Opioid Cost Data website and save results to files.

## Quick Start

### Option 1: Using the Script (Recommended)
```bash
npm run check-links
```

### Option 2: Direct Command
```bash
node check-links.js
```

### Option 3: Simple Manual Command
```bash
# Save results to a text file
npx linkinator https://www.virginiaopioidcostdata.org/ --recurse > link-results.txt

# Save results to JSON file
npx linkinator https://www.virginiaopioidcostdata.org/ --recurse --format json > link-results.json

# Save both formats
npx linkinator https://www.virginiaopioidcostdata.org/ --recurse --format text > link-results.txt && \
npx linkinator https://www.virginiaopioidcostdata.org/ --recurse --format json > link-results.json
```

## Output Files

After running the checker, you'll get:

1. **link-check-results.txt** - Human-readable text report
2. **link-check-results.json** - Machine-readable JSON data

## What Gets Checked

- ✅ All internal page links
- ✅ All external URLs (http/https)
- ✅ Email links (mailto:)
- ✅ Anchor links (hash links like #section-id)
- ⚠️ Note: Anchor links require JavaScript to work, so they may show as broken even if they work in the browser

## Understanding Results

- **Status 200-399**: ✅ Working link
- **Status 400-499**: ❌ Client error (broken link)
- **Status 500-599**: ❌ Server error
- **Status 0**: ❌ Connection failed or blocked

## Tips

1. **Check anchor links manually** - Links like `#section-id` require JavaScript and may appear broken
2. **Some sites block link checkers** - External sites may block automated requests
3. **Review JSON output** - Use it for automated analysis or reporting

## Alternatives

If the script doesn't work, try these online tools:

- [Dead Link Checker](https://www.deadlinkchecker.com/)
- [W3C Link Checker](https://validator.w3.org/checklink)
- Browser extensions like "Check My Links" (Chrome)

