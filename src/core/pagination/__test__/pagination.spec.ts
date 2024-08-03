import { Pagination } from '../pagination';

describe('Pagination Unit Test', () => {
  it('should map a Pagination', () => {
    // Given
    const expected = {
      total: 1,
      items: [1],
      perPage: 5,
      page: 1,
    };

    // When
    const pagination = new Pagination<number>({
      total: expected.total,
      items: expected.items,
      perPage: expected.perPage,
      page: expected.page,
    });

    // Then
    expect(pagination.map((item) => item)).toEqual(expected);
  });
});
