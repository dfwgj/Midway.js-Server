import { createApp, close, createHttpRequest } from "@midwayjs/mock";
import { Framework } from "@midwayjs/koa";

// 测试auth控制器的相关功能
describe("test/controller/api.auth.test.ts", () => {

  // 测试用户登录功能
  it("should login and verify token", async () => {
    const app = await createApp<Framework>();
    // 发送登录请求并期望返回状态为200
    const loginResult = await createHttpRequest(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        account: "1233456",  // 替换为正确的测试账号
        password: "12345678"    // 替换为正确的密码
      });
    // 从登录返回结果中提取token
    const token = loginResult.body.data;
    expect(loginResult.status).toBe(200);

    // 验证token是否有效
    const verifyResult = await createHttpRequest(app)
      .post("/api/auth/tokenVerify")
      .set("Authorization", `Bearer ${token}`);
    expect(verifyResult.status).toBe(200);

    // 使用获取的token请求用户信息
    const result = await createHttpRequest(app)
      .get("/api/user/getUser")
      .set("Authorization", `Bearer ${token}`)
      .query({ userId: 135 });
    // 验证用户信息请求的结果
    expect(result.status).toBe(200);
    // 关闭应用
    await close(app);
  });
});
