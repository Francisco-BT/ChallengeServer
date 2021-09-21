const { paginationBoundaries, buildPagination } = require('../../../src/utils');

describe('Pagination utils', () => {
  describe('Pagination Request Values', () => {
    it('should have a paginationBoundaries function', () => {
      expect(typeof paginationBoundaries).toBe('function');
    });

    it('should return limit of 10 if limit is not provided', () => {
      const { limit } = paginationBoundaries({});
      expect(limit).toBe(10);
    });

    it('should return page of 1 if page is not provided', () => {
      const { page } = paginationBoundaries({});
      expect(page).toBe(1);
    });

    it('should return offset of 0 if both page and limit are not provided', () => {
      const { offset } = paginationBoundaries({});
      expect(offset).toBe(0);
    });

    it('should return limit if is provided', () => {
      const { limit } = paginationBoundaries({ limit: 15 });
      expect(limit).toBe(15);
    });

    it('should return limit 10 if limit is 0', () => {
      const { limit } = paginationBoundaries({ limit: 0 });
      expect(limit).toBe(10);
    });

    it('should return limit of 10 if limit provided is greater or equal to 50', () => {
      const { limit } = paginationBoundaries({ limit: 50 });
      expect(limit).toBe(10);
    });

    it('should return limit of 10 if limit is less than 0', () => {
      const { limit } = paginationBoundaries({ limit: 0 });
      expect(limit).toBe(10);
    });

    it('should return page if page is provided', () => {
      const { page } = paginationBoundaries({ page: 4 });
      expect(page).toBe(4);
    });

    it('should return page of 1 if page provided is less than 0', () => {
      const { page } = paginationBoundaries({ page: -10 });
      expect(page).toBe(1);
    });

    describe('Offset calculation', () => {
      it.each([
        {
          page: 1,
          limit: 10,
          expectedOffset: 0,
        },
        {
          page: 2,
          limit: 10,
          expectedOffset: 10,
        },
        {
          page: 5,
          limit: 20,
          expectedOffset: 80,
        },
      ])(
        'should return offset: $expectedOffset when page is $page and limit is $limit',
        ({ page, limit, expectedOffset }) => {
          const { offset } = paginationBoundaries({ page, limit });
          expect(offset).toBe(expectedOffset);
        }
      );
    });
  });

  describe('Build Pagination', () => {
    it('should have a buildPagination function', () => {
      expect(typeof buildPagination).toBe('function');
    });

    it('should return page as currentPage', () => {
      const { currentPage } = buildPagination({
        totalItems: 10,
        limit: 10,
        page: 1,
      });
      expect(currentPage).toBe(1);
    });

    it('should return currentPage as 1 if page is not defined', () => {
      const { currentPage } = buildPagination({
        totalItems: 10,
        limit: 10,
      });
      expect(currentPage).toBe(1);
    });

    it.each([
      {
        totalItems: 10,
        limit: 10,
        page: 1,
        expectedPagination: {
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
          total: 10,
        },
      },
      {
        totalItems: 12,
        limit: 10,
        page: 1,
        expectedPagination: {
          totalPages: 2,
          hasNext: true,
          hasPrevious: false,
          total: 12,
        },
      },
      {
        totalItems: 12,
        limit: 10,
        page: 2,
        expectedPagination: {
          totalPages: 2,
          hasNext: false,
          hasPrevious: true,
          total: 12,
        },
      },
      {
        totalItems: 100,
        limit: 10,
        page: 5,
        expectedPagination: {
          totalPages: 10,
          hasNext: true,
          hasPrevious: true,
          total: 100,
        },
      },
      {
        totalItems: 0,
        limit: 0,
        expectedPagination: {
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
          total: 0,
        },
      },
    ])(
      'should return pagination = $expectedPagination when totalItems is $totalItems, limit is $limit and page is $page',
      ({ totalItems, limit, page, expectedPagination }) => {
        const { totalPages, hasNext, hasPrevious, total } = buildPagination({
          totalItems,
          limit,
          page,
        });
        expect(totalPages).toBe(expectedPagination.totalPages);
        expect(hasNext).toBe(expectedPagination.hasNext);
        expect(hasPrevious).toBe(expectedPagination.hasPrevious);
        expect(total).toBe(expectedPagination.total);
      }
    );
  });
});
