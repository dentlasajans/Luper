import React from 'react';
import {
  Activity,
  Archive as ArchiveIcon,
  CornerDownLeft as ArrowDownLeft,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  ArrowUpCircle,
  ArrowUpRight as ArrowUpRightIcon,
  Book,
  Calendar as CalendarIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  Cloud as CloudIcon,
  Code as CodeIcon,
  Monitor as Computer,
  Cpu as CpuIcon,
  Crown as CrownIcon,
  Gauge as DashboardSpeed,
  Database as DatabaseIcon,
  Download,
  Eye as EyeIcon,
  EyeOff as EyeClosed,
  Gamepad2 as Gamepad,
  Gift as GiftIcon,
  GitFork as GitForkIcon,
  GitBranch as Github,
  Globe as GlobeIcon,
  HardDrive as HardDriveIcon,
  Home,
  Info as InfoCircle,
  Laptop as LaptopIcon,
  Lock as LockIcon,
  LogOut,
  Medal as MedalIcon,
  Menu,
  Minus as MinusIcon,
  ChevronDown as NavArrowDown,
  ChevronRight as NavArrowRight,
  ChevronUp as NavArrowUp,
  Package as PackageIcon,
  FileText as Page,
  FileMinus as PageMinus,
  Palette as PaletteIcon,
  Pause as PauseIcon,
  Mouse as PcMouse,
  Play as PlayIcon,
  Plus as PlusIcon,
  RefreshCw as Refresh,
  Search,
  Settings,
  Shield as ShieldIcon,
  ShieldCheck as ShieldCheckIcon,
  ShoppingBag as ShoppingBagIcon,
  Volume2 as SoundHigh,
  Sparkles as Sparks,
  Square as SquareIcon,
  Star as StarIcon,
  Terminal as TerminalIcon,
  Trash as TrashIcon,
  MessageCircle as Twitter,
  Type,
  RotateCcw as UndoAction,
  User as UserIcon,
  Grid as ViewGrid,
  Layers as ViewStructureUp,
  AlertCircle as WarningCircleIcon,
  AlertTriangle as WarningTriangle,
  Wifi,
  Wrench as WrenchIcon,
  X as Xmark
} from 'lucide-react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  weight?: string;
  className?: string;
}

const createIcon = (Component: React.ComponentType<any>) => {
  return function IconWrapper({ size = 20, weight, className = '', ...props }: IconProps) {
    return (
      <Component
        size={size}
        strokeWidth={1.5}
        className={`opacity-80 transition-all duration-300 hover:opacity-100 ${className}`}
        {...props}
      />
    );
  };
};

export const Archive = createIcon(ArchiveIcon);
export const ArrowCircleUp = createIcon(ArrowUpCircle);
export const ArrowCounterClockwise = createIcon(UndoAction);
export const ArrowElbowDownLeft = createIcon(ArrowDownLeft);
export const ArrowLeft = createIcon(ArrowLeftIcon);
export const ArrowRight = createIcon(ArrowRightIcon);
export const ArrowUpRight = createIcon(ArrowUpRightIcon);
export const ArrowsClockwise = createIcon(Refresh);
export const BatteryFull = createIcon(Activity);
export const BookOpen = createIcon(Book);
export const Calendar = createIcon(CalendarIcon);
export const CaretDown = createIcon(NavArrowDown);
export const CaretRight = createIcon(NavArrowRight);
export const CaretUp = createIcon(NavArrowUp);
export const Check = createIcon(CheckIcon);
export const CheckCircle = createIcon(CheckCircleIcon);
export const Clock = createIcon(ClockIcon);
export const Cloud = createIcon(CloudIcon);
export const Code = createIcon(CodeIcon);
export const Cpu = createIcon(CpuIcon);
export const Crown = createIcon(CrownIcon);
export const Database = createIcon(DatabaseIcon);
export const DownloadSimple = createIcon(Download);
export const Eye = createIcon(EyeIcon);
export const EyeSlash = createIcon(EyeClosed);
export const FileMinus = createIcon(PageMinus);
export const FileText = createIcon(Page);
export const GameController = createIcon(Gamepad);
export const Gauge = createIcon(DashboardSpeed);
export const Gear = createIcon(Settings);
export const GearSix = createIcon(Settings);
export const Gift = createIcon(GiftIcon);
export const GitFork = createIcon(GitForkIcon);
export const GithubLogo = createIcon(Github);
export const Globe = createIcon(GlobeIcon);
export const GridFour = createIcon(ViewGrid);
export const HardDrive = createIcon(HardDriveIcon);
export const HardDrives = createIcon(HardDriveIcon);
export const House = createIcon(Home);
export const Info = createIcon(InfoCircle);
export const Keyboard = createIcon(Type);
export const Laptop = createIcon(LaptopIcon);
export const Lightning = createIcon(Activity);
export const List = createIcon(Menu);
export const Lock = createIcon(LockIcon);
export const MagnifyingGlass = createIcon(Search);
export const Medal = createIcon(MedalIcon);
export const Minus = createIcon(MinusIcon);
export const Monitor = createIcon(Computer);
export const Mouse = createIcon(PcMouse);
export const Package = createIcon(PackageIcon);
export const Palette = createIcon(PaletteIcon);
export const Pause = createIcon(PauseIcon);
export const Play = createIcon(PlayIcon);
export const Plus = createIcon(PlusIcon);
export const Power = createIcon(Settings);
export const Pulse = createIcon(Activity);
export const Recycle = createIcon(Settings);
export const RocketLaunch = createIcon(DashboardSpeed);
export const Scales = createIcon(Settings);
export const Shield = createIcon(ShieldIcon);
export const ShieldCheck = createIcon(ShieldCheckIcon);
export const ShoppingBag = createIcon(ShoppingBagIcon);
export const SignOut = createIcon(LogOut);
export const Sparkle = createIcon(Sparks);
export const SpeakerHigh = createIcon(SoundHigh);
export const SpinnerGap = createIcon(Refresh);
export const Square = createIcon(SquareIcon);
export const Stack = createIcon(ViewStructureUp);
export const Star = createIcon(StarIcon);
export const Tag = createIcon(Settings);
export const Terminal = createIcon(TerminalIcon);
export const Trash = createIcon(TrashIcon);
export const TwitterLogo = createIcon(Twitter);
export const User = createIcon(UserIcon);
export const Warning = createIcon(WarningTriangle);
export const WarningCircle = createIcon(WarningCircleIcon);
export const WifiHigh = createIcon(Wifi);
export const Wrench = createIcon(WrenchIcon);
export const X = createIcon(Xmark);
