import { DateMap } from './DateMap';

describe('DateMap', () => {
  describe('get', () => {
    it('should fetch exact items from the DateMap', () => {
      const firstDate = new Date(2023, 7, 1);
      const secondDate = new Date(2023, 7, 2);
      const thirdDate = new Date(2023, 7, 3);

      const dateMap = new DateMap();

      dateMap.put(firstDate, 'foo');
      dateMap.put(secondDate, 'bar');
      dateMap.put(thirdDate, 'baz');

      // Check out of order to prevent ordering bias
      expect(dateMap.get(secondDate)).toEqual('bar');
      expect(dateMap.get(thirdDate)).toEqual('baz');
      expect(dateMap.get(firstDate)).toEqual('foo');
    });

    it('should fetch the last prior date from the DateMap', () => {
      const firstDate = new Date(2023, 7, 1);
      const secondDate = new Date(2023, 7, 2);
      const thirdDate = new Date(2023, 7, 4);

      const targetDate = new Date(2023, 7, 3);

      const dateMap = new DateMap();

      dateMap.put(firstDate, 'foo');
      dateMap.put(secondDate, 'bar');
      dateMap.put(thirdDate, 'baz');

      expect(dateMap.get(targetDate)).toEqual('bar');
    });

    it('should return null for an empty list', () => {
      const date = new Date(2023, 7, 1);
      const dateMap = new DateMap();

      expect(dateMap.get(date)).toEqual(null);
    });

    it('should return null for an invalid date', () => {
      const date = new Date('foo');
      const dateMap = new DateMap();

      dateMap.put(new Date(2023, 7, 1), 'foo');

      expect(dateMap.get(date)).toEqual(null);
    });

    it('should return null for too early of a date', () => {
      const date = new Date(1900, 7, 1);
      const dateMap = new DateMap();

      dateMap.put(new Date(2023, 7, 1), 'foo');
      dateMap.put(new Date(2023, 7, 2), 'bar');
      dateMap.put(new Date(2023, 7, 3), 'baz');

      expect(dateMap.get(date)).toEqual(null);
    });
  });

  describe('put', () => {
   it('should insert into the DateMap', () => {
      const date = new Date();
      const dateMap = new DateMap();
      
      dateMap.put(date, 'foo');
      expect(dateMap.get(date)).toEqual('foo');
    });

    it('should override an existing value in the DateMap', () => {
      const date = new Date();
      const dateMap = new DateMap();
      
      dateMap.put(date, 'foo');
      expect(dateMap.get(date)).toEqual('foo');

      dateMap.put(date, 'bar');
      expect(dateMap.get(date)).toEqual('bar');
    });
  });
});