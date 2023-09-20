export default (timeout?: number) => ({
  init(ctx: {timeout: number}) {
    ctx.timeout = timeout!
  },
})
