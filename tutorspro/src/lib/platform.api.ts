import api from './api';

export const getUsers = async () => {
  try {
    const response = await api.get('/platform-admin/users');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching users.');
  }
};

export const updateUserStatus = async (userId: string, status: string) => {
  try {
    const response = await api.post(`/platform-admin/users/${userId}`, { status });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while updating user status.');
  }
};

export const getTutorVerifications = async () => {
  try {
    const response = await api.get('/platform-admin/tutor-verifications');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching tutor verifications.');
  }
};

export const updateTutorVerificationStatus = async (verificationId: string, status: string) => {
  try {
    const response = await api.post(`/platform-admin/tutor-verifications/${verificationId}`, { status });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while updating tutor verification status.');
  }
};

export const getPayments = async () => {
  try {
    const response = await api.get('/platform-admin/payments');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching payments.');
  }
};

export const updatePaymentStatus = async (paymentId: string, status: string) => {
  try {
    const response = await api.post(`/platform-admin/payments/${paymentId}`, { status });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while updating payment status.');
  }
};

export const getDisputes = async () => {
  try {
    const response = await api.get('/platform-admin/disputes');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching disputes.');
  }
};

export const updateDisputeStatus = async (disputeId: string, status: string) => {
  try {
    const response = await api.post(`/platform-admin/disputes/${disputeId}`, { status });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while updating dispute status.');
  }
};

export const getModeration = async () => {
  try {
    const response = await api.get('/platform-admin/moderation');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching moderation flags.');
  }
};

export const updateModerationStatus = async (flagId: string, status: string) => {
  try {
    const response = await api.post(`/platform-admin/moderation/${flagId}`, { status });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while updating moderation status.');
  }
};

export const getSupportTickets = async () => {
  try {
    const response = await api.get('/platform-admin/support-tickets');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching support tickets.');
  }
};

export const updateTicketStatus = async (ticketId: string, status: string) => {
  try {
    const response = await api.post(`/platform-admin/support-tickets/${ticketId}`, { status });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while updating ticket status.');
  }
};
