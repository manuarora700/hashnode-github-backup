export class Measure {
  private startTime: number;
  private endTime: number;
  constructor() {
    this.startTime = 0;
    this.endTime = 0;
  }
  public start() {
    this.startTime = performance.now();
  }

  public stop() {
    this.endTime = performance.now();
  }

  public calculate(message = "") {
    console.log(`${message} ${this.endTime - this.startTime} milliseconds`);

    this.startTime = 0;
    this.endTime = 0;
  }
}
