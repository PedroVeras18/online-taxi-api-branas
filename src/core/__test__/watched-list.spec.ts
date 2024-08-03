import { WatchedList } from '../watched-list';

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b;
  }
}

describe('Wached List unit test', () => {
  it('should be able to create a watched list with initial items', () => {
    const list = new NumberWatchedList([1, 2, 3, 4]);

    expect(list.currentItems).toHaveLength(4);
  });

  it('should be able to add new items to the list', () => {
    const list = new NumberWatchedList([1, 2, 3, 4]);

    list.add(5);

    expect(list.currentItems).toHaveLength(5);
    expect(list.getNewItems()).toEqual([5]);
  });

  it('should be able to remove items from the list', () => {
    const list = new NumberWatchedList([1, 2, 3, 4]);

    list.remove(2);

    expect(list.currentItems).toHaveLength(3);
    expect(list.getRemovedItems()).toEqual([2]);
  });

  it('should be able to add an item even if it was removed before', () => {
    const list = new NumberWatchedList([1, 2, 3, 4]);

    list.remove(2);
    list.add(2);

    expect(list.getNewItems()).toEqual([]);
    expect(list.currentItems).toHaveLength(4);
    expect(list.getRemovedItems()).toEqual([]);
  });

  it('should be able to remove an item even if it was added before', () => {
    const list = new NumberWatchedList([1, 2, 3, 4]);

    list.add(5);
    list.remove(5);

    expect(list.getNewItems()).toEqual([]);
    expect(list.currentItems).toHaveLength(4);
    expect(list.getRemovedItems()).toEqual([]);
  });

  it('should be able to update a watched list', () => {
    const list = new NumberWatchedList([1, 2, 3, 4]);

    list.update([1, 2, 9]);

    expect(list.getRemovedItems()).toEqual([3, 4]);
    expect(list.getNewItems()).toEqual([9]);
  });
});
