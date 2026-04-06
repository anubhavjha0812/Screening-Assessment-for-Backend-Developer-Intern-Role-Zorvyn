const prisma = require('../lib/prisma');
const PaginationUtils = require('../utils/paginationUtils');

class RecordService {
  async createRecord(data) {
    if (data.amount <= 0) throw new Error('Amount must be positive');
    if (!['income', 'expense'].includes(data.type)) throw new Error('Invalid type');
    return await prisma.financialRecord.create({ data });
  }

  async getRecords(filters) {
    const where = { deletedAt: null };
    if (filters.type) where.type = filters.type;
    if (filters.category) where.category = { contains: filters.category, mode: 'insensitive' };
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = new Date(filters.startDate);
      if (filters.endDate) where.date.lte = new Date(filters.endDate);
    }
    
    const { page, limit, offset } = PaginationUtils.calculatePagination(filters.page, filters.limit);
    
    const [records, total] = await Promise.all([
      prisma.financialRecord.findMany({ where, orderBy: { date: 'desc' }, skip: offset, take: limit }),
      prisma.financialRecord.count({ where })
    ]);
    return { records, pagination: PaginationUtils.generateMetadata(total, page, limit) };
  }

  async getDeletedRecords(filters) {
    const where = { deletedAt: { not: null } };
    const { page, limit, offset } = PaginationUtils.calculatePagination(filters.page, filters.limit);
    const [records, total] = await Promise.all([
      prisma.financialRecord.findMany({ where, orderBy: { date: 'desc' }, skip: offset, take: limit }),
      prisma.financialRecord.count({ where })
    ]);
    return { records, pagination: PaginationUtils.generateMetadata(total, page, limit) };
  }

  async getRecordById(id) {
    const record = await prisma.financialRecord.findFirst({ where: { id, deletedAt: null } });
    if (!record) throw new Error('Record not found');
    return record;
  }

  async updateRecord(id, data) {
    const record = await this.getRecordById(id);
    if (data.amount !== undefined && data.amount <= 0) throw new Error('Amount must be positive');
    return await prisma.financialRecord.update({ where: { id }, data });
  }

  async deleteRecord(id) {
    await this.getRecordById(id);
    return await prisma.financialRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async restoreRecord(id) {
    const record = await prisma.financialRecord.findUnique({ where: { id } });
    if (!record || !record.deletedAt) throw new Error('Deleted record not found');
    return await prisma.financialRecord.update({ where: { id }, data: { deletedAt: null } });
  }

  async hardDeleteRecord(id) {
    const record = await prisma.financialRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Record not found');
    return await prisma.financialRecord.delete({ where: { id } });
  }
}
module.exports = new RecordService();
