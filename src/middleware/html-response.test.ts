import { FastifyReply, FastifyRequest } from 'fastify';
import { htmlResponseMiddleware } from './html-response';

describe('htmlResponseMiddleware', () => {
  let mockRequest: FastifyRequest;
  let mockReply: FastifyReply;

  beforeEach(() => {
    mockRequest = {} as FastifyRequest;
    mockReply = {
      sent: false,
      type: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      header: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as FastifyReply;
  });

  it('sends string response as HTML', async () => {
    const handler = jest.fn().mockResolvedValue('<div>test</div>');
    const wrappedHandler = htmlResponseMiddleware(handler);

    await wrappedHandler(mockRequest, mockReply);

    expect(mockReply.type).toHaveBeenCalledWith('text/html');
    expect(mockReply.send).toHaveBeenCalledWith('<div>test</div>');
  });

  it('sends error response with 400 status', async () => {
    const handler = jest.fn().mockResolvedValue({ error: 'Validation failed' });
    const wrappedHandler = htmlResponseMiddleware(handler);

    await wrappedHandler(mockRequest, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.type).toHaveBeenCalledWith('text/html');
    expect(mockReply.send).toHaveBeenCalledWith('<div class="alert alert-error">Validation failed</div>');
  });

  it('sends template response without URL', async () => {
    const handler = jest.fn().mockResolvedValue({ template: '<div>content</div>' });
    const wrappedHandler = htmlResponseMiddleware(handler);

    await wrappedHandler(mockRequest, mockReply);

    expect(mockReply.type).toHaveBeenCalledWith('text/html');
    expect(mockReply.send).toHaveBeenCalledWith('<div>content</div>');
    expect(mockReply.header).not.toHaveBeenCalled();
  });

  it('sends template response with URL header', async () => {
    const handler = jest.fn().mockResolvedValue({ template: '<div>content</div>', url: '/redirect' });
    const wrappedHandler = htmlResponseMiddleware(handler);

    await wrappedHandler(mockRequest, mockReply);

    expect(mockReply.type).toHaveBeenCalledWith('text/html');
    expect(mockReply.header).toHaveBeenCalledWith('HX-Push-Url', '/redirect');
    expect(mockReply.send).toHaveBeenCalledWith('<div>content</div>');
  });

  it('does nothing when reply already sent', async () => {
    mockReply.sent = true;
    const handler = jest.fn().mockResolvedValue('<div>test</div>');
    const wrappedHandler = htmlResponseMiddleware(handler);

    await wrappedHandler(mockRequest, mockReply);

    expect(mockReply.type).not.toHaveBeenCalled();
    expect(mockReply.send).not.toHaveBeenCalled();
  });

  it('does nothing when handler returns void', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const wrappedHandler = htmlResponseMiddleware(handler);

    await wrappedHandler(mockRequest, mockReply);

    expect(mockReply.type).not.toHaveBeenCalled();
    expect(mockReply.send).not.toHaveBeenCalled();
  });
});
