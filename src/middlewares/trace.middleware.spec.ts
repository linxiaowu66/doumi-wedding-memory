import { TraceMiddleware } from './trace.middleware';

describe('TraceMiddleware', () => {
  it('should be defined', () => {
    expect(new TraceMiddleware()).toBeDefined();
  });
});
