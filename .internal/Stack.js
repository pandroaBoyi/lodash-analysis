import ListCache from './ListCache.js'
import MapCache from './MapCache.js'

/** Used as the size to enable large array optimizations. */
const LARGE_ARRAY_SIZE = 200

class Stack {

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  constructor(entries) {
    // 默认使用有序的ListCache作为数据存储器
    const data = this.__data__ = new ListCache(entries)
    this.size = data.size
  }

  /**
   * Removes all key-value entries from the stack.
   *
   * @memberOf Stack
   */
  clear() {
    this.__data__ = new ListCache
    this.size = 0
  }

  /**
   * Removes `key` and its value from the stack.
   *
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  delete(key) {
    const data = this.__data__
    const result = data['delete'](key)

    this.size = data.size
    return result
  }

  /**
   * Gets the stack value for `key`.
   *
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  get(key) {
    return this.__data__.get(key)
  }

  /**
   * Checks if a stack value for `key` exists.
   *
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  has(key) {
    return this.__data__.has(key)
  }

  /**
   * Sets the stack `key` to `value`.
   *
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  set(key, value) {
    // 这是stack的this.__data__，该this.__data__引用ListCache或MapCache的实例
    let data = this.__data__
    if (data instanceof ListCache) {
      // 这里的paris获取ListCache实例的__data__，数据保存在这里
      const pairs = data.__data__
      // 超过数组最大长度限制，使用MapCache替换listCache
      if (pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value])
        this.size = ++data.size
        return this
      }
      // 替换当前的ListCache为MapCache，并将以保存pairs传入MapCache初始化
      data = this.__data__ = new MapCache(pairs)
    }
    data.set(key, value)
    this.size = data.size
    return this
  }
}

export default Stack
