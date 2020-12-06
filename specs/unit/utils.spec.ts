import { expect } from "chai";
import { get }    from "../../lib/utils";

describe('Utils', () => {
  const sampleObj = {
    foo: 'bar',
    some: {
      key: {
        value: 'palapa'
      }
    }
  };

  describe('get', () => {
    it('returns the default value if the object is not traversable', () => {
      expect(get(1, 'some.key', 'def')).to.equal('def');
      expect(get(null, 'some.key', 'def')).to.equal('def');
      expect(get(undefined, 'some.key', 'def')).to.equal('def');
      expect(get('hello', 'some.key', 'def')).to.equal('def');
    })

    it('returns the default value if the key isnt found', () => {
      expect(get(sampleObj, 'some.wrong.key', 'nope')).to.equal('nope')
      expect(get(sampleObj, 'some.key.value.bad', 'nope')).to.equal('nope')
      expect(get(sampleObj, 'something', 'nope')).to.equal('nope')
    })

    it('returns the immediate key if found', () => {
      expect(get(sampleObj, 'foo')).to.equal('bar')
      expect(get(sampleObj, 'some.key.value', 'nope')).to.equal('palapa')
    })
  })
});
