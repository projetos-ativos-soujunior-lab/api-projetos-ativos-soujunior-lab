export default class ResponseEntity {
  readonly statusCode: number;
  readonly body: any;

  private constructor(statusCode: number, body: any) {
    this.statusCode = statusCode;
    this.body = body;
  }

  static ok = (body: any): ResponseEntity => new ResponseEntity(200, body);

  static serverError = (body: any): ResponseEntity => new ResponseEntity(500, body);

  getStatusCode = (): number => this.statusCode;

  getBody = (): any => this.body;
}
