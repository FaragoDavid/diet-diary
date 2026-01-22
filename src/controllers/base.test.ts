import createHandler from './base';

describe('Auth Middleware', () => {
  describe('session validation', () => {
    it('should redirect to login when session.user is missing', async () => {
      const mockRequest = {
        session: {},
      } as any;

      const mockReply = {
        redirect: jest.fn(),
      } as any;

      const mockHandler = jest.fn();
      const handler = createHandler(mockHandler);

      await handler.preHandler(mockRequest, mockReply);

      expect(mockReply.redirect).toHaveBeenCalledWith('/login', 301);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should allow request when session.user exists', async () => {
      const mockRequest = {
        session: {
          user: {
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      } as any;

      const mockReply = {
        redirect: jest.fn(),
      } as any;

      const mockHandler = jest.fn();
      const handler = createHandler(mockHandler);

      await handler.preHandler(mockRequest, mockReply);

      expect(mockReply.redirect).not.toHaveBeenCalled();
    });

    it('should call handler when authenticated', async () => {
      const mockRequest = {
        session: {
          user: {
            email: 'test@example.com',
          },
        },
      } as any;

      const mockReply = {
        sent: false,
      } as any;

      const mockHandler = jest.fn().mockResolvedValue(undefined);
      const handler = createHandler(mockHandler);

      await handler.preHandler(mockRequest, mockReply);
      await handler.handler(mockRequest, mockReply);

      expect(mockHandler).toHaveBeenCalledWith(mockRequest, mockReply);
    });

    it('should handle errors in handler', async () => {
      const mockRequest = {
        session: {
          user: {
            email: 'test@example.com',
          },
        },
      } as any;

      const mockReply = {
        sent: false,
        status: jest.fn().mockReturnThis(),
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;

      const mockError = new Error('Handler error');
      const mockHandler = jest.fn().mockRejectedValue(mockError);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const handler = createHandler(mockHandler);

      await handler.handler(mockRequest, mockReply);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error in request handler:', mockError);
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.type).toHaveBeenCalledWith('text/html');
      expect(mockReply.send).toHaveBeenCalledWith(expect.stringContaining('An error occurred'));

      consoleErrorSpy.mockRestore();
    });

    it('should not send error response if reply already sent', async () => {
      const mockRequest = {
        session: {
          user: {
            email: 'test@example.com',
          },
        },
      } as any;

      const mockReply = {
        sent: true,
        status: jest.fn().mockReturnThis(),
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;

      const mockError = new Error('Handler error');
      const mockHandler = jest.fn().mockRejectedValue(mockError);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const handler = createHandler(mockHandler);

      await handler.handler(mockRequest, mockReply);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error in request handler:', mockError);
      expect(mockReply.status).not.toHaveBeenCalled();
      expect(mockReply.send).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
