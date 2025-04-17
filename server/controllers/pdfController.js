const pdfParse = require('pdf-parse');
const Transaction = require('../models/Transaction');
const alertController = require('./alertController');
const Budget = require('../models/Budget');

const KNOWN_CATEGORIES = [
  'Transportation',
  'Restaurants',
  'Retail and Grocery',
  'Personal and Household Expenses',
  'Professional and Financial Services',
  'Foreign Currency Transactions',

  // etc.
];

function cleanLine(line) {
  line = line.replace(/Ý/g, '');
  line = line.replace(
    /([A-Z][a-z]{2}\s*\d{1,2})([A-Z][a-z]{2}\s*\d{1,2})/g,
    '$1 $2'
  );
  line = line.replace(/(ON)(Restaurants|Transportation|Retail)/g, '$1 $2');
  line = line.replace(/(QC)(Personal)/g, '$1 $2');
  line = line.replace(/\s+/g, ' ');
  return line.trim();
}

function rejoinLinesUntilAmount(rawLines) {
  const joinedLines = [];
  let buffer = '';

  for (const rawLine of rawLines) {
    let line = rawLine.trim();
    if (!line) continue;
    line = cleanLine(line);
    if (!buffer) {
      buffer = line;
    } else {
      buffer += ' ' + line;
    }
    if (/\d+\.\d{2}$/.test(buffer)) {
      joinedLines.push(buffer);
      buffer = '';
    }
  }
  if (buffer) joinedLines.push(buffer);
  return joinedLines;
}

function parseSimpliiStatement(pdfText) {
  const rawLines = pdfText.split('\n');
  const lines = rejoinLinesUntilAmount(rawLines);

  const lineRegex = /^([A-Z][a-z]{2}\s*\d{1,2})\s+([A-Z][a-z]{2}\s*\d{1,2})(.+?)(-?\d+\.\d{2})$/;
  const transactions = [];

  lines.forEach((line) => {
    console.log('Merged line =>', line);
    let spacedLine = line.replace(/\s+/g, ' ');
    const match = spacedLine.match(lineRegex);
    if (match) {
      const [, transDate, postDate, middleChunk, amountStr] = match;
      const amount = parseFloat(amountStr);
      let lineTrim = middleChunk.trim();
      let foundCategory = null;
      for (const cat of KNOWN_CATEGORIES) {
        if (lineTrim.endsWith(cat)) {
          foundCategory = cat;
          break;
        }
      }
      let description;
      let category;
      if (foundCategory) {
        const catIndex = lineTrim.lastIndexOf(foundCategory);
        description = lineTrim.slice(0, catIndex).trim();
        category = foundCategory;
      } else {
        description = lineTrim;
        category = 'Uncategorized';
      }

     

      transactions.push({
        transDate,
      postDate,      // e.g. "Jan 03"
        description,
        category,
        amount,
        status: 'pending'
      });
    } else {
      console.log('No match =>', spacedLine);
    }
  });
  return transactions;
}

// NEW: Improved extraction of statement period.
// This regex allows optional colon/dash and extra spaces.
function extractStatementPeriod(pdfText) {
  const periodMatch = pdfText.match(/statement\s+period\s*[:\-]?\s*([A-Za-z]+\s+\d{1,2},?\s*\d{4})\s*to\s*([A-Za-z]+\s+\d{1,2},?\s*\d{4})/i);
  if (periodMatch) {
    return {
      startDate: periodMatch[1].trim(), // e.g., "December 4, 2024"
      endDate: periodMatch[2].trim()      // e.g., "January 3, 2025"
    };
  }
  return null;
}

exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file || req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Invalid file type. Please upload a PDF.' });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;
    console.log('PDF raw text:\n', text);

    // Extract the full statement period
    const period = extractStatementPeriod(text);
    console.log('Extracted period:', period);

    const extractedTransactions = parseSimpliiStatement(text);
    console.log('Number of transactions parsed:', extractedTransactions.length);

    // Return transactions and period data (if found)
    return res.json({ 
      transactions: extractedTransactions, 
      statementStartDate: period ? period.startDate : null,
      statementEndDate: period ? period.endDate : null
    });
  } catch (err) {
    console.error('Error parsing PDF:', err);
    return res.status(500).json({ error: 'Failed to parse PDF statement.' });
  }
};

const updateBudgetSpent = async (userId, txs) => {
  for (const tx of txs) {
    const budgets = await Budget.find({
      userId,
      categories: { $in: [tx.category] },
      ...(tx.date && { startDate: { $lte: tx.date }, endDate: { $gte: tx.date } })
    });

    for (const budget of budgets) {
      budget.spent = (budget.spent || 0) + tx.amount;
      await budget.save();
    }
  }
};

exports.finalizeTransactions = async (req, res) => {
  try {
    const { transactions, statementStartDate, statementEndDate } = req.body;
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: 'No transactions provided or invalid format.' });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'No user found in token' });
    }

    const userId = req.user.id;
    let startDateObj, endDateObj;
    if (statementStartDate && statementEndDate) {
      startDateObj = new Date(statementStartDate);
      endDateObj = new Date(statementEndDate);
    }

    const startMonthNum = startDateObj ? (startDateObj.getMonth() + 1) : 1;
    const startYear = startDateObj ? startDateObj.getFullYear() : 2025;
    const endYear = endDateObj ? endDateObj.getFullYear() : 2025;

    console.log('📅 Statement Period:', startYear, 'to', endYear);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const docsToInsert = transactions.map((tx) => {
      const parts = tx.transDate.trim().split(' ');
      const txMonthAbbrev = parts[0];
      const txMonthNum = monthNames.findIndex(m => m.toLowerCase() === txMonthAbbrev.toLowerCase()) + 1;

      // 👇 Force all transactions to use the startYear for now (2025)
      const finalYear = startYear;
      const fullDateString = `${finalYear} ${tx.transDate}`;
      console.log('🧾 Transaction:', tx.transDate, '→ Full date:', fullDateString);

      return {
        userId,
        date: new Date(fullDateString),
        description: tx.description,
        amount: tx.amount,
        category: tx.category || 'Uncategorized',
        status: 'approved'
      };
    });

    await Transaction.insertMany(docsToInsert);
    await alertController.checkUserAlerts(userId);
    await updateBudgetSpent(userId, docsToInsert);

    return res.json({
      message: 'Transactions finalized',
      insertedCount: docsToInsert.length,
    });

    
  } catch (err) {
    console.error('Error finalizing transactions:', err);
    return res.status(500).json({ error: 'Could not finalize transactions' });
  }

  
};


