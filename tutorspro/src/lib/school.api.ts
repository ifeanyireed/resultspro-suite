import api from './api';

export interface SchoolRegistrationData {
  email: string;
  password?: string; // Optional for cases where it's handled separately
  full_name: string;
  school_name: string;
  location: string;
  website: string;
}

export const registerSchool = async (data: SchoolRegistrationData) => {
  try {
    const response = await api.post('/school/register', data);
    return response.data;
  } catch (error) {
    // Axios wraps the error, so we re-throw the response data for components to handle
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred during school registration.');
  }
};

export const getSchoolTeachers = async () => {
  try {
    const response = await api.get('/school/teachers');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching teachers.');
  }
};

export interface InviteTeacherData {
  email: string;
  full_name: string;
}

export const inviteTeacher = async (data: InviteTeacherData) => {
  try {
    const response = await api.post('/school/teachers', data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while inviting the teacher.');
  }
};

export const getSchoolClasses = async () => {
  try {
    const response = await api.get('/school/classes');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching classes.');
  }
};

export interface CreateClassData {
  name: string;
  teacher_id: string;
}

export const createSchoolClass = async (data: CreateClassData) => {
  try {
    const response = await api.post('/school/classes', data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while creating the class.');
  }
};

export const getSchoolStudents = async () => {
  try {
    const response = await api.get('/school/students');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching students.');
  }
};

export const importStudents = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/school/students/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while importing students.');
  }
};

export const getSubscription = async () => {
  try {
    const response = await api.get('/school/subscription');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching subscription details.');
  }
};

export const updateSubscription = async (plan: string) => {
  try {
    const response = await api.post('/school/subscription', { plan });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while updating the subscription.');
  }
};

export const getBranding = async () => {
  try {
    const response = await api.get('/school/branding');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching branding settings.');
  }
};

export const updateBranding = async (data: any) => {
  try {
    const response = await api.post('/school/branding', data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while updating branding settings.');
  }
};

export const getReports = async () => {
  try {
    const response = await api.get('/school/reports');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching reports.');
  }
};

export const generateReport = async (data: any) => {
  try {
    const response = await api.post('/school/reports', data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while generating the report.');
  }
};

export const getAnalytics = async () => {
  try {
    const response = await api.get('/school/analytics');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching analytics.');
  }
};

export const getSchoolNotifications = async () => {
  try {
    const response = await api.get('/school/notifications');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching notifications.');
  }
};

export const createSchoolNotification = async (data: any) => {
  try {
    const response = await api.post('/school/notifications', data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while creating the notification.');
  }
};
