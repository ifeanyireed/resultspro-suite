import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      organizationType,
      painPoints,
      studentCount,
      campusCount,
      infrastructure,
      migrationNeed,
      timeline,
      selectedSolutions,
      demoFormat,
      preferredDate,
      preferredTime,
      fullName,
      email,
      phone,
      institutionName,
      role,
      notes,
    } = body;

    // Validate essential fields
    if (!fullName || !email || !phone || !institutionName) {
      return NextResponse.json(
        { error: 'Full name, email, phone number, and institution name are required.' },
        { status: 400 }
      );
    }

    // Generate unique reference code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `DEMO-RP-${randomSuffix}`;

    const bookingRecord = {
      referenceCode,
      organizationType: organizationType || 'K-12 Private School',
      painPoints: painPoints || [],
      context: {
        studentCount: studentCount || '250 – 1,000',
        campusCount: campusCount || 'Single Campus',
        infrastructure: infrastructure || 'Hybrid',
        migrationNeed: migrationNeed || 'Excel / Spreadsheets',
        timeline: timeline || 'Immediate',
      },
      selectedSolutions: selectedSolutions || ['ResultsPRO', 'ExamsPRO'],
      logistics: {
        demoFormat: demoFormat || 'Virtual (Google Meet / Zoom)',
        preferredDate: preferredDate || new Date().toISOString().split('T')[0],
        preferredTime: preferredTime || '11:00 AM WAT',
      },
      contact: {
        fullName,
        email,
        phone,
        institutionName,
        role: role || 'Administrator / Proprietor',
        notes: notes || '',
      },
      createdAt: new Date().toISOString(),
    };

    // Non-blocking forward to service_users enterprise demo booking receiver & email dispatcher
    const usersApi = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    fetch(`${usersApi}/api/v1/public/demo-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        referenceCode,
        organizationType,
        painPoints,
        studentCount,
        campusCount,
        infrastructure,
        migrationNeed,
        timeline,
        selectedSolutions,
        demoFormat,
        preferredDate,
        preferredTime,
        fullName,
        email,
        phone,
        institutionName,
        role,
        notes,
      }),
    })
      .then(() => clearTimeout(timeoutId))
      .catch((err) => {
        clearTimeout(timeoutId);
        console.warn('[Demo API] Note forwarding to service_users:', err.message);
      });

    return NextResponse.json({
      success: true,
      message: 'Demo booking request registered successfully',
      referenceCode,
      booking: bookingRecord,
    });
  } catch (error: any) {
    console.error('[Demo API] Error processing booking:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
