import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import * as FirebaseService from '../services/FirebaseService';
import { onAuthStateChanged } from 'firebase/auth';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((_, callback) => {
    callback(null);
    return jest.fn();
  })
}));

// Mock Firebase Service
jest.mock('../services/FirebaseService', () => ({
  auth: {},
  loginWithGoogle: jest.fn().mockResolvedValue({ displayName: 'Google User' }),
  logoutGoogle: jest.fn().mockResolvedValue(undefined)
}));

// Mock motion/react
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, layoutId, initial, animate, transition, ...props }: any) => (
      <div className={className} {...props}>{children}</div>
    )
  }
}));

// Mock Icons
jest.mock('./Icons', () => ({
  AppLogo: () => <div data-testid="app-logo">AppLogo</div>
}));

jest.mock('@/src/components/ui/Icons', () => {
  const DummyIcon = (props: any) => <svg data-testid="ui-icon" {...props} />;
  return {
    Archive: DummyIcon,
    ArrowCircleUp: DummyIcon,
    CaretDown: DummyIcon,
    Cpu: DummyIcon,
    FileText: DummyIcon,
    GameController: DummyIcon,
    GithubLogo: DummyIcon,
    Globe: DummyIcon,
    House: DummyIcon,
    SpinnerGap: DummyIcon,
    SignOut: DummyIcon,
    Gear: DummyIcon,
    Sparkle: DummyIcon,
    TwitterLogo: DummyIcon,
    Wrench: DummyIcon,
    Lightning: DummyIcon
  };
});

describe('Sidebar Component', () => {
  const mockSetActiveTab = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Sidebar with logo, groups, navigation items and version footer', () => {
    render(<Sidebar activeTab="dashboard" setActiveTab={mockSetActiveTab} />);

    expect(screen.getByTestId('app-logo')).toBeInTheDocument();
    expect(screen.getByText('Ana Menü')).toBeInTheDocument();
    expect(screen.getByText('Sistem & Yönetim')).toBeInTheDocument();
    expect(screen.getByText('Anasayfa')).toBeInTheDocument();
    expect(screen.getByText('Optimizasyon')).toBeInTheDocument();
    expect(screen.getByText('v1.1.0 Stable')).toBeInTheDocument();
    expect(screen.getByText('Google ile Giriş')).toBeInTheDocument();
  });

  test('handles item click without sub-items', () => {
    render(<Sidebar activeTab="dashboard" setActiveTab={mockSetActiveTab} />);

    const dashboardBtn = screen.getByRole('button', { name: /Anasayfa/i });
    fireEvent.click(dashboardBtn);

    expect(mockSetActiveTab).toHaveBeenCalledWith('dashboard');
  });

  test('expands category and toggles sub-items on click', () => {
    render(<Sidebar activeTab="dashboard" setActiveTab={mockSetActiveTab} />);

    const optBtn = screen.getByRole('button', { name: /Optimizasyon/i });
    
    // Click to expand
    fireEvent.click(optBtn);
    expect(mockSetActiveTab).toHaveBeenCalledWith('optimization');

    // Subitems should be visible (e.g. CPU)
    const cpuSubItem = screen.getByText('CPU');
    expect(cpuSubItem).toBeInTheDocument();

    // Click sub-item
    fireEvent.click(cpuSubItem);
    expect(mockSetActiveTab).toHaveBeenCalledWith('cpu');

    // Click category again to collapse
    fireEvent.click(optBtn);
  });

  test('automatically expands parent category when activeTab is a sub-item', () => {
    render(<Sidebar activeTab="cpu" setActiveTab={mockSetActiveTab} />);

    expect(screen.getByText('CPU')).toBeInTheDocument();
  });

  test('handles Google login click successfully', async () => {
    (FirebaseService.loginWithGoogle as jest.Mock).mockResolvedValueOnce({});

    render(<Sidebar activeTab="dashboard" setActiveTab={mockSetActiveTab} />);

    const loginBtn = screen.getByText('Google ile Giriş');
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(FirebaseService.loginWithGoogle).toHaveBeenCalled();
    });
  });

  test('handles Google login failure gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (FirebaseService.loginWithGoogle as jest.Mock).mockRejectedValueOnce(new Error('Auth failed'));

    render(<Sidebar activeTab="dashboard" setActiveTab={mockSetActiveTab} />);

    const loginBtn = screen.getByText('Google ile Giriş');
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Google auth error:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('renders user profile when user is authenticated with photo', () => {
    const mockUser = {
      displayName: 'Jane Doe',
      photoURL: 'https://example.com/photo.jpg',
      email: 'jane@example.com'
    };

    (onAuthStateChanged as jest.Mock).mockImplementationOnce((_, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    render(<Sidebar activeTab="dashboard" setActiveTab={mockSetActiveTab} />);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByAltText('Jane Doe')).toHaveAttribute('src', 'https://example.com/photo.jpg');
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  test('renders fallback avatar initial when user has no photoURL or displayName', () => {
    const mockUser = {
      displayName: null,
      photoURL: null,
      email: 'user@example.com'
    };

    (onAuthStateChanged as jest.Mock).mockImplementationOnce((_, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    render(<Sidebar activeTab="dashboard" setActiveTab={mockSetActiveTab} />);

    expect(screen.getByText('Kullanıcı')).toBeInTheDocument();
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  test('handles user logout successfully', async () => {
    const mockUser = {
      displayName: 'Jane Doe',
      photoURL: null,
      email: 'jane@example.com'
    };

    (onAuthStateChanged as jest.Mock).mockImplementationOnce((_, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    (FirebaseService.logoutGoogle as jest.Mock).mockResolvedValueOnce(undefined);

    render(<Sidebar activeTab="dashboard" setActiveTab={mockSetActiveTab} />);

    const logoutBtn = screen.getByTitle('Çıkış Yap');
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(FirebaseService.logoutGoogle).toHaveBeenCalled();
    });
  });

  test('handles logout error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockUser = {
      displayName: 'Jane Doe',
      photoURL: null,
      email: 'jane@example.com'
    };

    (onAuthStateChanged as jest.Mock).mockImplementationOnce((_, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    (FirebaseService.logoutGoogle as jest.Mock).mockRejectedValueOnce(new Error('Logout error'));

    render(<Sidebar activeTab="dashboard" setActiveTab={mockSetActiveTab} />);

    const logoutBtn = screen.getByTitle('Çıkış Yap');
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
