exports.paginationBoundaries = ({
  limit,
  page,
  defaultLimit = 10,
  maxLimit = 50,
}) => {
  defaultLimit = parseInt(defaultLimit, 10);
  maxLimit = parseInt(maxLimit, 10);
  let validLimit = parseInt(limit, 10) || defaultLimit;
  let currentPage = parseInt(page, 10) || 1;

  if (validLimit >= maxLimit || validLimit <= 0) {
    validLimit = defaultLimit;
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
