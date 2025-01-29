export class Configuration {
  constructor() {
    this.env = process.env.NODE_ENV || 'development';
    this.port = process.env.PORT || '3000';
  }
}
