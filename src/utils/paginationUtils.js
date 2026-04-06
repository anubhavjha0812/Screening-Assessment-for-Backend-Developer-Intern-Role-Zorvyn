class PaginationUtils {
  static calculatePagination(page, limit) {
    page = Math.max(1, parseInt(page) || 1);
    limit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    return { page, limit, offset: (page - 1) * limit };
  }
  static generateMetadata(total, page, limit) {
    const pages = Math.ceil(total / limit);
    return { total, page, limit, pages, hasNextPage: page < pages, hasPreviousPage: page > 1 };
  }
}
module.exports = PaginationUtils;
