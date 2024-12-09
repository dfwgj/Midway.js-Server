import { Provide } from '@midwayjs/core';

@Provide()
export class BigIntService {
  // BigInt 序列化函数放在类
  bigInt(obj: any): any {
    // 遍历对象的每个字段，如果发现 BigInt 类型，转换为字符串
    if (typeof obj === 'bigint') {
      return obj.toString();
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          obj[key] = this.bigInt(obj[key]);
        }
      }
    }
    return obj;
  }
}
