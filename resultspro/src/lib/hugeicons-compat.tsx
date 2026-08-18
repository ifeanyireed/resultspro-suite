// Simple icon wrapper using Lucide React as fallback
import React from 'react';
import * as LucideIcons from 'lucide-react';

// Map icon names to Lucide icons
const iconMap: Record<string, React.ElementType> = {
  AlertCircle: LucideIcons.AlertCircle,
  AlertTriangle: LucideIcons.AlertTriangle,
  Target: LucideIcons.Target,
  Archive: LucideIcons.Archive,
  ArrowDown: LucideIcons.ArrowDown,
  ArrowLeft: LucideIcons.ArrowLeft,
  ArrowRight: LucideIcons.ArrowRight,
  ArrowRight01: LucideIcons.ArrowRight,
  ArrowUp: LucideIcons.ArrowUp,
  Award: LucideIcons.Award,
  BarChart01: LucideIcons.BarChart3,
  BookOpen: LucideIcons.BookOpen,
  Briefcase: LucideIcons.Briefcase,
  Building2: LucideIcons.Building2,
  Calendar: LucideIcons.Calendar,
  Check: LucideIcons.Check,
  CheckCircle: LucideIcons.CheckCircle,
  CheckSquare: LucideIcons.CheckSquare2,
  ChevronDown: LucideIcons.ChevronDown,
  ChevronLeft: LucideIcons.ChevronLeft,
  ChevronRight: LucideIcons.ChevronRight,
  ChevronUp: LucideIcons.ChevronUp,
  Circle: LucideIcons.Circle,
  ClipboardList: LucideIcons.ClipboardList,
  Clock: LucideIcons.Clock,
  Cloud: LucideIcons.Cloud,
  Copy: LucideIcons.Copy,
  CreditCard: LucideIcons.CreditCard,
  Database: LucideIcons.Database,
  DollarSign: LucideIcons.DollarSign,
  Download: LucideIcons.Download,
  Download01: LucideIcons.Download,
  Dot: LucideIcons.Dot,
  Edit02: LucideIcons.Edit2,
  Eye: LucideIcons.Eye,
  EyeOff: LucideIcons.EyeOff,
  File: LucideIcons.File,
  FileText: LucideIcons.FileText,
  Filter: LucideIcons.Filter,
  Folder: LucideIcons.Folder,
  Heart: LucideIcons.Heart,
  Info: LucideIcons.Info,
  GripVertical: LucideIcons.GripVertical,
  LayoutDashboard: LucideIcons.LayoutDashboard,
  LayoutGrid: LucideIcons.LayoutGrid,
  Layers: LucideIcons.Layers,
  Loading01: LucideIcons.Loader,
  Mail: LucideIcons.Mail,
  MapPin: LucideIcons.MapPin,
  Location01: LucideIcons.MapPin,
  ListRecord: LucideIcons.List,
  Refresh: LucideIcons.RefreshCw,
  MessageCircle: LucideIcons.MessageCircle,
  MessageSquare: LucideIcons.MessageSquare,
  MoreHorizontal: LucideIcons.MoreHorizontal,
  MoreVertical: LucideIcons.MoreVertical,
  Newspaper: LucideIcons.Newspaper,
  Palette: LucideIcons.Palette,
  PanelLeft: LucideIcons.PanelLeft,
  Pause: LucideIcons.Pause,
  Play: LucideIcons.Play,
  PieChart01: LucideIcons.PieChart,
  Phone: LucideIcons.Phone,
  Phone01: LucideIcons.Phone,
  Plus: LucideIcons.Plus,
  Printer: LucideIcons.Printer,
  ShoppingCart: LucideIcons.ShoppingCart,
  Headphones: LucideIcons.Headphones,
  RotateCcw: LucideIcons.RotateCcw,
  Save: LucideIcons.Save,
  Search: LucideIcons.Search,
  Send: LucideIcons.Send,
  Settings: LucideIcons.Settings,
  Settings02: LucideIcons.Settings,
  Share01: LucideIcons.Share2,
  Shield: LucideIcons.Shield,
  Ticket: LucideIcons.Ticket,
  Ticket01: LucideIcons.Ticket,
  TrendingDown: LucideIcons.TrendingDown,
  TrendingUp: LucideIcons.TrendingUp,
  Trophy: LucideIcons.Trophy,
  Trash01: LucideIcons.Trash2,
  Trash2: LucideIcons.Trash2,
  Upload: LucideIcons.Upload,
  Upload01: LucideIcons.Upload,
  Upload02: LucideIcons.Upload,
  Users: LucideIcons.Users,
  UserGroup: LucideIcons.Users2,
  Contact: LucideIcons.Contact,
  X: LucideIcons.X,
  XClose: LucideIcons.X,
  XCircle: LucideIcons.XCircle,
  Zap: LucideIcons.Zap,
  Bell: LucideIcons.Bell,
  User: LucideIcons.User,
  UserCheck: LucideIcons.UserCheck,
  LogOut: LucideIcons.LogOut,
  Wallet: LucideIcons.Wallet,
  Crown: LucideIcons.Crown,
  Star: LucideIcons.Star,
  Medal: LucideIcons.Medal,
  Activity: LucideIcons.Activity,
  Camera: LucideIcons.Camera,
  Building01: LucideIcons.Building2,
  Hash: LucideIcons.Hash,
  Calendar01: LucideIcons.Calendar,
  GraduationCap: LucideIcons.GraduationCap,
};

// Export icons using Lucide as fallback
export const createIcon = (name: string) => {
  const LucideIcon = iconMap[name];
  if (LucideIcon) {
    return LucideIcon;
  }
  // Fallback to a generic icon if not found
  return LucideIcons.Circle;
};

// Export all icons
export const AlertCircle = iconMap.AlertCircle || LucideIcons.AlertCircle;
export const AlertTriangle = iconMap.AlertTriangle || LucideIcons.AlertTriangle;
export const Target = iconMap.Target || LucideIcons.Target;
export const Archive = iconMap.Archive || LucideIcons.Archive;
export const ArrowDown = iconMap.ArrowDown || LucideIcons.ArrowDown;
export const ArrowLeft = iconMap.ArrowLeft || LucideIcons.ArrowLeft;
export const ArrowRight = iconMap.ArrowRight || LucideIcons.ArrowRight;
export const ArrowRight01 = iconMap.ArrowRight01 || LucideIcons.ArrowRight;
export const ArrowUp = iconMap.ArrowUp || LucideIcons.ArrowUp;
export const Award = iconMap.Award || LucideIcons.Award;
export const BarChart01 = iconMap.BarChart01 || LucideIcons.BarChart3;
export const BookOpen = iconMap.BookOpen || LucideIcons.BookOpen;
export const Building2 = iconMap.Building2 || LucideIcons.Building2;
export const Calendar = iconMap.Calendar || LucideIcons.Calendar;
export const Check = iconMap.Check || LucideIcons.Check;
export const CheckCircle = iconMap.CheckCircle || LucideIcons.CheckCircle;
export const CheckSquare = iconMap.CheckSquare || LucideIcons.CheckSquare2;
export const HeaderChevronDown = iconMap.ChevronDown || LucideIcons.ChevronDown;
export const ChevronDown = iconMap.ChevronDown || LucideIcons.ChevronDown;
export const ChevronLeft = iconMap.ChevronLeft || LucideIcons.ChevronLeft;
export const ChevronRight = iconMap.ChevronRight || LucideIcons.ChevronRight;
export const ChevronUp = iconMap.ChevronUp || LucideIcons.ChevronUp;
export const Circle = iconMap.Circle || LucideIcons.Circle;
export const ClipboardList = iconMap.ClipboardList || LucideIcons.ClipboardList;
export const Clock = iconMap.Clock || LucideIcons.Clock;
export const Cloud = iconMap.Cloud || LucideIcons.Cloud;
export const Copy = iconMap.Copy || LucideIcons.Copy;
export const CreditCard = iconMap.CreditCard || LucideIcons.CreditCard;
export const Database = iconMap.Database || LucideIcons.Database;
export const DollarSign = iconMap.DollarSign || LucideIcons.DollarSign;
export const Download = iconMap.Download || LucideIcons.Download;
export const Download01 = iconMap.Download01 || LucideIcons.Download;
export const Dot = iconMap.Dot || LucideIcons.Dot;
export const Edit02 = iconMap.Edit02 || LucideIcons.Edit2;
export const Eye = iconMap.Eye || LucideIcons.Eye;
export const EyeOff = iconMap.EyeOff || LucideIcons.EyeOff;
export const File = iconMap.File || LucideIcons.File;
export const FileText = iconMap.FileText || LucideIcons.FileText;
export const Filter = iconMap.Filter || LucideIcons.Filter;
export const Folder = iconMap.Folder || LucideIcons.Folder;
export const Heart = iconMap.Heart || LucideIcons.Heart;
export const Info = iconMap.Info || LucideIcons.Info;
export const GripVertical = iconMap.GripVertical || LucideIcons.GripVertical;
export const LayoutDashboard = iconMap.LayoutDashboard || LucideIcons.LayoutDashboard;
export const LayoutGrid = iconMap.LayoutGrid || LucideIcons.LayoutGrid;
export const Layers = iconMap.Layers || LucideIcons.Layers;
export const Loading01 = iconMap.Loading01 || LucideIcons.Loader;
export const Mail = iconMap.Mail || LucideIcons.Mail;
export const MapPin = iconMap.MapPin || LucideIcons.MapPin;
export const Location01 = iconMap.Location01 || LucideIcons.MapPin;
export const ListRecord = iconMap.ListRecord || LucideIcons.List;
export const Refresh = iconMap.Refresh || LucideIcons.RefreshCw;
export const MessageCircle = iconMap.MessageCircle || LucideIcons.MessageCircle;
export const MessageSquare = iconMap.MessageSquare || LucideIcons.MessageSquare;
export const MoreHorizontal = iconMap.MoreHorizontal || LucideIcons.MoreHorizontal;
export const MoreVertical = iconMap.MoreVertical || LucideIcons.MoreVertical;
export const Newspaper = iconMap.Newspaper || LucideIcons.Newspaper;
export const Palette = iconMap.Palette || LucideIcons.Palette;
export const PanelLeft = iconMap.PanelLeft || LucideIcons.PanelLeft;
export const Pause = iconMap.Pause || LucideIcons.Pause;
export const Play = iconMap.Play || LucideIcons.Play;
export const PieChart01 = iconMap.PieChart01 || LucideIcons.PieChart;
export const Phone = iconMap.Phone || LucideIcons.Phone;
export const Phone01 = iconMap.Phone01 || LucideIcons.Phone;
export const Plus = iconMap.Plus || LucideIcons.Plus;
export const Printer = iconMap.Printer || LucideIcons.Printer;
export const ShoppingCart = iconMap.ShoppingCart || LucideIcons.ShoppingCart;
export const Headphones = iconMap.Headphones || LucideIcons.Headphones;
export const RotateCcw = iconMap.RotateCcw || LucideIcons.RotateCcw;
export const Save = iconMap.Save || LucideIcons.Save;
export const Search = iconMap.Search || LucideIcons.Search;
export const Send = iconMap.Send || LucideIcons.Send;
export const Settings = iconMap.Settings || LucideIcons.Settings;
export const Settings02 = iconMap.Settings02 || LucideIcons.Settings;
export const Share01 = iconMap.Share01 || LucideIcons.Share2;
export const Shield = iconMap.Shield || LucideIcons.Shield;
export const Ticket = iconMap.Ticket || LucideIcons.Ticket;
export const Ticket01 = iconMap.Ticket01 || LucideIcons.Ticket;
export const TrendingDown = iconMap.TrendingDown || LucideIcons.TrendingDown;
export const TrendingUp = iconMap.TrendingUp || LucideIcons.TrendingUp;
export const Trophy = iconMap.Trophy || LucideIcons.Trophy;
export const Trash01 = iconMap.Trash01 || LucideIcons.Trash2;
export const Trash2 = iconMap.Trash2 || LucideIcons.Trash2;
export const Upload = iconMap.Upload || LucideIcons.Upload;
export const Upload01 = iconMap.Upload01 || LucideIcons.Upload;
export const Upload02 = iconMap.Upload02 || LucideIcons.Upload;
export const Users = iconMap.Users || LucideIcons.Users;
export const UserGroup = iconMap.UserGroup || LucideIcons.Users2;
export const Contact = iconMap.Contact || LucideIcons.Contact;
export const X = iconMap.X || LucideIcons.X;
export const XClose = iconMap.XClose || LucideIcons.X;
export const XCircle = iconMap.XCircle || LucideIcons.XCircle;
export const Zap = iconMap.Zap || LucideIcons.Zap;
export const Bell = iconMap.Bell || LucideIcons.Bell;
export const User = iconMap.User || LucideIcons.User;
export const UserCheck = iconMap.UserCheck || LucideIcons.UserCheck;
export const LogOut = iconMap.LogOut || LucideIcons.LogOut;
export const Briefcase = iconMap.Briefcase || LucideIcons.Briefcase;
export const Wallet = iconMap.Wallet || LucideIcons.Wallet;
export const Crown = iconMap.Crown || LucideIcons.Crown;
export const Star = iconMap.Star || LucideIcons.Star;
export const Medal = iconMap.Medal || LucideIcons.Medal;
export const Activity = iconMap.Activity || LucideIcons.Activity;
export const Camera = iconMap.Camera || LucideIcons.Camera;
export const Building01 = iconMap.Building01 || LucideIcons.Building2;
export const Hash = iconMap.Hash || LucideIcons.Hash;
export const Calendar01 = iconMap.Calendar01 || LucideIcons.Calendar;
export const GraduationCap = iconMap.GraduationCap || LucideIcons.GraduationCap;
