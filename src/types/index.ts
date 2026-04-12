export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  image: string;
  category: string;
  date: string;
  comments: number;
  author?: string;
  likes?: number;
}

export type AnnouncementType = 'Important' | 'Scheduled' | 'Announcement';

export interface Announcement {
  id: number;
  title: string;
  type: AnnouncementType;
  department: string;
  date: string;
}

export type AppCategory = 'Favorites' | 'Core Systems' | 'Tools';

export interface Application {
  id: number;
  name: string;
  category: AppCategory;
  icon: string;
  color?: string;
  description: string;
  url: string;
}

export interface Employee {
  id: number;
  name: string;
  department: string;
  title: string;
  avatar: string;
  managerId?: number;
}

export interface OrgMember {
  id: number;
  name: string;
  title: string;
  avatar: string;
  children?: OrgMember[];
}

export type RoomStatus = 'available' | 'busy';

export interface MeetingRoom {
  id: number;
  name: string;
  image: string;
  capacity: number;
  floor?: string;
  status: RoomStatus;
}

export interface OfficeLocation {
  id: number;
  name: string;
  city: string;
  address: string;
  type: 'hq' | 'branch';
}

export interface SafeLocation {
  id: number;
  name: string;
  address: string;
  image: string;
}

export interface ChairmanMessage {
  name: string;
  title: string;
  message: string;
  image: string;
}

export interface Reminder {
  id: number;
  message: string;
  active: boolean;
}

export interface WeeklyMotivation {
  quote: string;
  author: string;
  backgroundImage: string;
}

export interface NavItem {
  id: string;
  labelKey: string;
  icon: string;
  path: string;
}

export interface CurrentUser {
  id: number;
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  department: string;
  avatar: string;
}
