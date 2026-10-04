const test = require("node:test")
const assert = require("node:assert/strict")
const onebot = require("../lib/index.js")

function createContext(overrides = {}) {
  let middleware
  let dispose
  const logs = []
  const ctx = {
    bots: [],
    database: { getAssignedChannels: async () => [] },
    broadcast: async () => {},
    logger: () => ({ info: (...args) => logs.push(["info", ...args]), warn: (...args) => logs.push(["warn", ...args]), error: (...args) => logs.push(["error", ...args]) }),
    on(event, callback) { if (event === "dispose") dispose = callback },
    middleware(callback) { middleware = callback },
    faithCore: { adapter: { resolve: async () => null } },
    faithBusiness: { acceptsCommand: () => true, dispatch: async () => ({ matched: false, reason: "not-found" }) },
    ...overrides,
  }
  return { ctx, get middleware() { return middleware }, get dispose() { return dispose }, logs }
}

function createSession(overrides = {}) {
  const sent = []
  return {
    sent,
    session: {
      platform: "onebot",
      userId: "123456",
      selfId: "bot",
      channelId: "private:123456",
      messageId: "message-1",
      username: "玩家",
      isDirect: true,
      content: "椰子水 申请绑定",
      stripped: { content: "椰子水 申请绑定" },
      send: async (value) => sent.push(value),
      ...overrides,
    },
  }
}

test("OneBot binding request is dispatched without creating a UID", async () => {
  let event
  let resolveCount = 0
  const fixture = createContext({
    faithCore: { adapter: { resolve: async () => { resolveCount += 1; return null } } },
    faithBusiness: {
      acceptsCommand: (content) => content === "椰子水 申请绑定",
      dispatch: async (value) => {
        event = value
        return { matched: true, business: "binding", command: "binding/coconut_water/request_link", result: { type: "text", content: "TokenA" } }
      },
    },
  })
  onebot.apply(fixture.ctx, { enableBroadcast: true })
  const { session, sent } = createSession()
  await fixture.middleware(session, async () => {})

  assert.equal(resolveCount, 1)
  assert.equal(event.uid, null)
  assert.deepEqual(event.identity, { adapter: "onebot", type: "qq_account", value: "123456", scope: "global" })
  assert.deepEqual(sent, ["TokenA"])
  fixture.dispose()
})

test("command prefilter avoids identity and database work for ordinary messages", async () => {
  let nextCount = 0
  let resolveCount = 0
  const fixture = createContext({
    faithCore: { adapter: { resolve: async () => { resolveCount += 1; return null } } },
    faithBusiness: { acceptsCommand: () => false, dispatch: async () => { throw new Error("should not dispatch") } },
  })
  onebot.apply(fixture.ctx, { enableBroadcast: false })
  const { session, sent } = createSession({ content: "普通聊天", stripped: { content: "普通聊天" } })
  await fixture.middleware(session, async () => { nextCount += 1 })
  assert.equal(nextCount, 1)
  assert.equal(resolveCount, 0)
  assert.deepEqual(sent, [])
})

test("stored OneBot reply channel remains usable until adapter disposal", async () => {
  let event
  const fixture = createContext({
    faithCore: { adapter: { resolve: async () => null } },
    faithBusiness: {
      acceptsCommand: () => true,
      dispatch: async (value) => {
        event = value
        return { matched: true, business: "binding", command: "binding/request", result: { type: "text", content: "TokenA" } }
      },
    },
  })
  onebot.apply(fixture.ctx, { enableBroadcast: true })
  const { session, sent } = createSession()
  await fixture.middleware(session, async () => {})
  await event.reply({ type: "text", content: "TokenB" })
  assert.deepEqual(sent, ["TokenA", "TokenB"])
  fixture.dispose()
  await event.reply({ type: "text", content: "ignored" })
  assert.deepEqual(sent, ["TokenA", "TokenB"])
})

test("normalizes slash commands before fast routing", () => {
  assert.equal(onebot.normalizeOneBotContent({ content: "／ 椰子水 用户信息", stripped: {} }), "椰子水 用户信息")
})

test("adapter mode defaults to binding", () => {
  const { Schema } = require("koishi")
  const config = new Schema(onebot.Config)
  assert.equal(config({}).mode, "binding")
  assert.equal(config({}).allowRegistration, false)
  assert.equal(config({ mode: "normal" }).mode, "normal")
  assert.throws(() => config({ mode: "invalid" }))
})

test("binding mode only accepts private binding commands", async () => {
  let dispatched = 0
  let next = 0
  const fixture = createContext({
    faithBusiness: {
      acceptsCommand: () => true,
      dispatch: async () => { dispatched += 1; return { matched: true, result: { type: "silent" } } },
    },
  })
  onebot.apply(fixture.ctx, { mode: "binding", enableBroadcast: true })
  await fixture.middleware(createSession({ isDirect: false, channelId: "group", content: "椰子水 用户信息", stripped: { content: "椰子水 用户信息" } }).session, async () => { next += 1 })
  await fixture.middleware(createSession({ content: "椰子水 用户信息", stripped: { content: "椰子水 用户信息" } }).session, async () => { next += 1 })
  await fixture.middleware(createSession({ content: "信仰 信息", stripped: { content: "信仰 信息" } }).session, async () => { next += 1 })
  assert.equal(dispatched, 0)
  assert.equal(next, 3)
})

test("normal mode handles complete Business commands in groups", async () => {
  let dispatched = 0
  let event
  const fixture = createContext({
    faithBusiness: {
      acceptsCommand: () => true,
      dispatch: async (value) => { dispatched += 1; event = value; return { matched: true, result: { type: "silent" } } },
    },
  })
  onebot.apply(fixture.ctx, { mode: "normal", enableBroadcast: false })
  const { session } = createSession({ isDirect: false, channelId: "group", content: "信仰 信息", stripped: { content: "信仰 信息" } })
  await fixture.middleware(session, async () => {})
  assert.equal(dispatched, 1)
  assert.equal(event.adapter.allowRegistration, false)
})

test("normal mode can explicitly allow OneBot registration", async () => {
  let event
  const fixture = createContext({
    faithBusiness: {
      acceptsCommand: () => true,
      dispatch: async (value) => { event = value; return { matched: true, result: { type: "silent" } } },
    },
  })
  onebot.apply(fixture.ctx, { mode: "normal", allowRegistration: true, enableBroadcast: false })
  await fixture.middleware(createSession({ content: "信仰 注册 真理", stripped: { content: "信仰 注册 真理" } }).session, async () => {})
  assert.equal(event.adapter.allowRegistration, true)
})
