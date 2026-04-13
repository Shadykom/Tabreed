const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  getNews: () => fetchData<import('../types').NewsArticle[]>('news'),
  getAnnouncements: () => fetchData<import('../types').Announcement[]>('announcements'),
  getApplications: () => fetchData<import('../types').Application[]>('applications'),
  getEmployees: () => fetchData<import('../types').Employee[]>('employees'),
  getMeetingRooms: () => fetchData<import('../types').MeetingRoom[]>('meetingRooms'),
  getOfficeLocations: () => fetchData<import('../types').OfficeLocation[]>('officeLocations'),
  getSafeLocations: () => fetchData<import('../types').SafeLocation[]>('safeLocations'),
  getChairman: () => fetchData<import('../types').ChairmanMessage>('chairman'),
  getReminder: () => fetchData<import('../types').Reminder>('reminder'),
  getMotivation: () => fetchData<import('../types').WeeklyMotivation>('motivation'),
  getOrgChart: () => fetchData<import('../types').OrgMember>('orgChart'),
};
