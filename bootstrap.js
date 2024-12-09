const process = require('process');
const { NodeSDK, node, resources } = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');

// 初始化一个 open-telemetry 的 SDK
const sdk = new NodeSDK({
  resource: new resources.Resource({
    'service.name': 'Midway.js-Server',
  }),
  // 配置当前的导出方式，比如这里配置了一个输出到控制台的，也可以配置其他的 Exporter，比如 Jaeger
  traceExporter: new node.ConsoleSpanExporter(),
  // 这里配置了默认自带的一些监控模块，比如 http 模块等
  instrumentations: [getNodeAutoInstrumentations()],
});

// 初始化 SDK
sdk.start();

// 在进程关闭时，同时关闭数据采集
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch(error => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

// 启动 Midway 应用
const { Bootstrap } = require('@midwayjs/bootstrap');
Bootstrap.configure(/**/).run();
//   resource: 包含服务的资源信息，例如服务名称、使用的SDK、进程信息等。
// service.name: 服务名称，这里显示为 unknown_service。
// telemetry.sdk.language: SDK 的编程语言，这里是 nodejs。
// telemetry.sdk.name: SDK 的名称，这里是 opentelemetry。
// telemetry.sdk.version: SDK 的版本，这里是 1.29.0。
// process.pid: 进程ID，这里是 39108。
// process.executable.name: 可执行文件的名称，这里是 cmd.exe。
// process.executable.path: 可执行文件的路径，这里是 E:\\node\\nodejs\\node.exe。
// process.command_args: 命令行参数，这里显示了启动 Node.js 进程的命令。
// process.runtime.version: 运行时版本，这里是 20.18.0。
// process.runtime.name: 运行时名称，这里是 nodejs。
// process.runtime.description: 运行时描述，这里是 Node.js。
// process.command: 执行的命令，这里是 bootstrap.js 文件的路径。
// process.owner: 进程所有者，这里是 DF。
// host.name: 主机名称，这里是 WGJ-jige。
// host.arch: 主机架构，这里是 amd64。
// host.id: 主机ID，这里是 3bf04208-293b-45ba-b818-5fa8c6f69e15。
// instrumentationScope: 包含使用的 instrumentation（监控）范围的信息。

// name: instrumentation 的名称，这里是 @opentelemetry/instrumentation-koa。
// version: instrumentation 的版本，这里是 0.46.0。
// traceId: 追踪ID，用于标识一个完整的追踪会话。

// parentId: 父Span的ID，用于标识追踪中的父子关系。

// traceState: 追踪状态，这里没有定义。

// name: Span的名称，这里是 middleware - midwayRootMiddleware。

// id: Span的ID，用于标识追踪中的一个操作单元。

// kind: Span的类型，0 表示这是一个服务器接收的Span。

// timestamp: Span的开始时间戳。

// duration: Span的持续时间。

// attributes: 包含Span的属性，这里显示了Koa中间件的名称和类型。

// status: Span的状态，code: 0 表示成功。

// events: Span中的事件列表，这里是空的。

// links: Span中的链接列表，这里是空的。
