exports.paginationBoundaries = ({ limit, page }) => {
  let validLimit = parseInt(limit, 10) || 10;
  let currentPage = parseInt(page, 10) || 1;

  if (validLimit >= 50 || validLimit <= 0) {
    validLimit = 10;
  }

  if (currentPage <= 0) {
    currentPage = 1;
  }

  const offset = (currentPage - 1) * validLimit;

  return {
    limit: validLimit,
    page: currentPage,
    offset,
  };
};

exports.buildPagination = ({ totalItems, limit, page = 1 }) => {
  const totalPages = totalItems && limit ? Math.ceil(totalItems / limit) : 1;
  return {
    totalPages,
    limit,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
    currentPage: page,
    total: totalItems,
  };
};
