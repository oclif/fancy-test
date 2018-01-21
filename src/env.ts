const original = process.env

export default (env: {[k: string]: string}) => ({
  before() {
    process.env = {...env}
  },
  after() {
    process.env = original
  }
})
