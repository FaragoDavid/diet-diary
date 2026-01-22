import { getGoogleCallback, getLogin, getLogout } from './login';
import config from '../config';

describe('Login Routes', () => {
  describe('getLogin', () => {
    it('should destroy session and render login page', async () => {
      const mockRequest = {
        session: {
          destroy: jest.fn(),
        },
      } as any;

      const mockReply = {
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;

      await getLogin(mockRequest, mockReply);

      expect(mockRequest.session.destroy).toHaveBeenCalled();
      expect(mockReply.type).toHaveBeenCalledWith('text/html');
      expect(mockReply.send).toHaveBeenCalled();
    });
  });

  describe('getLogout', () => {
    it('should destroy session and redirect to login', async () => {
      const mockRequest = {
        session: {
          destroy: jest.fn(),
        },
      } as any;

      const mockReply = {
        redirect: jest.fn(),
      } as any;

      await getLogout(mockRequest, mockReply);

      expect(mockRequest.session.destroy).toHaveBeenCalled();
      expect(mockReply.redirect).toHaveBeenCalledWith('/login', 303);
    });
  });

  describe('getGoogleCallback', () => {
    const mockUserInfo = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/photo.jpg',
    };

    const mockToken = {
      access_token: 'mock_access_token',
    };

    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should authenticate user with valid email in allowlist', async () => {
      const originalAllowedEmails = config.oauth.allowedEmails;
      config.oauth.allowedEmails = ['test@example.com'];

      const mockRequest = {
        server: {
          googleOAuth2: {
            getAccessTokenFromAuthorizationCodeFlow: jest.fn().mockResolvedValue(mockToken),
          },
        },
        session: {},
      } as any;

      const mockReply = {
        redirect: jest.fn(),
      } as any;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserInfo),
      });

      await getGoogleCallback(mockRequest, mockReply);

      expect(mockRequest.session.user).toEqual({
        email: mockUserInfo.email,
        name: mockUserInfo.name,
        picture: mockUserInfo.picture,
      });
      expect(mockReply.redirect).toHaveBeenCalledWith('/dashboard', 303);

      config.oauth.allowedEmails = originalAllowedEmails;
    });

    it('should deny access for email not in allowlist', async () => {
      const originalAllowedEmails = config.oauth.allowedEmails;
      config.oauth.allowedEmails = ['allowed@example.com'];

      const mockRequest = {
        server: {
          googleOAuth2: {
            getAccessTokenFromAuthorizationCodeFlow: jest.fn().mockResolvedValue(mockToken),
          },
        },
        session: {},
      } as any;

      const mockReply = {
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserInfo),
      });

      await getGoogleCallback(mockRequest, mockReply);

      expect(mockRequest.session.user).toBeUndefined();
      expect(mockReply.type).toHaveBeenCalledWith('text/html');
      expect(mockReply.send).toHaveBeenCalledWith(expect.stringContaining('Access Denied'));
      expect(mockReply.send).toHaveBeenCalledWith(expect.stringContaining(mockUserInfo.email));

      config.oauth.allowedEmails = originalAllowedEmails;
    });

    it('should deny access when allowlist is empty', async () => {
      const originalAllowedEmails = config.oauth.allowedEmails;
      config.oauth.allowedEmails = [];

      const mockRequest = {
        server: {
          googleOAuth2: {
            getAccessTokenFromAuthorizationCodeFlow: jest.fn().mockResolvedValue(mockToken),
          },
        },
        session: {},
      } as any;

      const mockReply = {
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserInfo),
      });

      await getGoogleCallback(mockRequest, mockReply);

      expect(mockRequest.session.user).toBeUndefined();
      expect(mockReply.type).toHaveBeenCalledWith('text/html');
      expect(mockReply.send).toHaveBeenCalledWith(expect.stringContaining('Access Denied'));

      config.oauth.allowedEmails = originalAllowedEmails;
    });

    it('should redirect to login on OAuth error', async () => {
      const mockRequest = {
        server: {
          googleOAuth2: {
            getAccessTokenFromAuthorizationCodeFlow: jest.fn().mockRejectedValue(new Error('OAuth failed')),
          },
        },
        session: {},
      } as any;

      const mockReply = {
        redirect: jest.fn(),
      } as any;

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await getGoogleCallback(mockRequest, mockReply);

      expect(mockRequest.session.user).toBeUndefined();
      expect(mockReply.redirect).toHaveBeenCalledWith('/login?error=oauth', 303);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should redirect to login when user info fetch fails', async () => {
      const originalAllowedEmails = config.oauth.allowedEmails;
      config.oauth.allowedEmails = ['test@example.com'];

      const mockRequest = {
        server: {
          googleOAuth2: {
            getAccessTokenFromAuthorizationCodeFlow: jest.fn().mockResolvedValue(mockToken),
          },
        },
        session: {},
      } as any;

      const mockReply = {
        redirect: jest.fn(),
      } as any;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await getGoogleCallback(mockRequest, mockReply);

      expect(mockRequest.session.user).toBeUndefined();
      expect(mockReply.redirect).toHaveBeenCalledWith('/login?error=oauth', 303);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      config.oauth.allowedEmails = originalAllowedEmails;
    });

    it('should handle multiple emails in allowlist', async () => {
      const originalAllowedEmails = config.oauth.allowedEmails;
      config.oauth.allowedEmails = ['user1@example.com', 'test@example.com', 'user2@example.com'];

      const mockRequest = {
        server: {
          googleOAuth2: {
            getAccessTokenFromAuthorizationCodeFlow: jest.fn().mockResolvedValue(mockToken),
          },
        },
        session: {},
      } as any;

      const mockReply = {
        redirect: jest.fn(),
      } as any;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserInfo),
      });

      await getGoogleCallback(mockRequest, mockReply);

      expect(mockRequest.session.user).toEqual({
        email: mockUserInfo.email,
        name: mockUserInfo.name,
        picture: mockUserInfo.picture,
      });
      expect(mockReply.redirect).toHaveBeenCalledWith('/dashboard', 303);

      config.oauth.allowedEmails = originalAllowedEmails;
    });
  });
});
