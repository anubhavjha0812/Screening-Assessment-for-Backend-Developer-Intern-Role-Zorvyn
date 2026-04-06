const prisma = require('../lib/prisma');

class DashboardService {
  async getSummary(filters = {}) {
    const where = { deletedAt: null };
    if (filters.startDate) where.date = { gte: new Date(filters.startDate) };
    if (filters.endDate) where.date = { ...where.date, lte: new Date(filters.endDate) };
    const records = await prisma.financialRecord.findMany({ where });
    const totalIncome = records.filter(r => r.type === 'income').reduce((s, r) => s + Number(r.amount), 0);
    const totalExpenses = records.filter(r => r.type === 'expense').reduce((s, r) => s + Number(r.amount), 0);
    return { totalIncome, totalExpenses, netBalance: totalIncome - totalExpenses, transactionCount: records.length };
  }

  async getByCategory(typeFilter = null) {
    const where = { deletedAt: null };
    if (typeFilter) where.type = typeFilter;
    const records = await prisma.financialRecord.findMany({ where });
    const map = new Map();
    for (const r of records) {
      const key = `${r.category}|${r.type}`;
      if (!map.has(key)) map.set(key, { category: r.category, type: r.type, total: 0, count: 0 });
      const entry = map.get(key);
      entry.total += Number(r.amount);
      entry.count++;
    }
    return Array.from(map.values());
  }

  async getTrends(months = 6) {
    const startDate = new Date(); startDate.setMonth(startDate.getMonth() - months);
    const records = await prisma.financialRecord.findMany({
      where: { deletedAt: null, date: { gte: startDate } }
    });
    const map = new Map();
    records.forEach(r => {
      const key = r.date.toISOString().slice(0, 7);
      if (!map.has(key)) map.set(key, { period: key, income: 0, expenses: 0 });
      const entry = map.get(key);
      if (r.type === 'income') entry.income += Number(r.amount);
      else entry.expenses += Number(r.amount);
    });
    return Array.from(map.values()).map(t => ({ ...t, balance: t.income - t.expenses })).sort((a,b) => a.period.localeCompare(b.period));
  }

  async getRecent(limit = 10) {
    return await prisma.financialRecord.findMany({
      where: { deletedAt: null },
      orderBy: { date: 'desc' },
      take: limit
    });
  }
}
module.exports = new DashboardService();
