export default class Result {
  constructor({
    data = {},
    succ = 200,
    status = 1,
    msg = '',
  }) {
    this.succ = succ;
    this.status = status;
    this.data = data;
    this.msg = msg;
  }
}