export interface WebinarAttendee {
  id: string;
  series_name: string;
  edition_title: string;
  full_name: string;
  email: string;
  phone: string;
  school_name: string;
  role: string;
  state_location: string;
  estimated_students: string;
  pain_points: string;
  status: 'REGISTERED' | 'ATTENDED' | 'CERTIFICATE_DISPATCHED' | string;
  certificate_number?: string;
  notes?: string;
  registered_at: string;
}

export async function fetchWebinarAttendees(edition?: string): Promise<{ total_count: number; registrations: WebinarAttendee[] }> {
  try {
    const url = edition ? `/api/webinars?edition=${encodeURIComponent(edition)}` : '/api/webinars';
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch webinar attendees');
    return await res.json();
  } catch (err) {
    console.error('Error loading webinar attendees:', err);
    return { total_count: 0, registrations: [] };
  }
}

export async function dispatchWebinarCertificate(id: string, certificateNumber?: string, notes?: string): Promise<boolean> {
  try {
    const res = await fetch('/api/webinars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        status: 'CERTIFICATE_DISPATCHED',
        certificate_number: certificateNumber,
        notes,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('Error dispatching certificate:', err);
    return false;
  }
}

export async function batchDispatchWebinarCertificates(ids: string[]): Promise<boolean> {
  try {
    const res = await fetch('/api/webinars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids,
        status: 'CERTIFICATE_DISPATCHED',
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('Error batch dispatching certificates:', err);
    return false;
  }
}

export async function updateAttendeeStatus(id: string, status: string): Promise<boolean> {
  try {
    const res = await fetch('/api/webinars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        status,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('Error updating attendee status:', err);
    return false;
  }
}
