export default (timeout?: number) => {
  return {
    init(ctx: {timeout: number}) {
      ctx.timeout = timeout!
    },
  }
}
