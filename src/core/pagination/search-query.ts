import { Direction } from './direction';

export abstract class SearchQuery {
  _page: number;
  _sort: string;
  _terms: string;
  _perPage: number;
  _direction: Direction;

  constructor(
    page: number,
    perPage: number,
    terms: string,
    sort: string,
    direction: Direction,
  ) {
    this._page = page;
    this._sort = sort;
    this._terms = terms;
    this._perPage = perPage;
    this._direction = direction;
  }
}
