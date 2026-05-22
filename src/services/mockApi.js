const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const mockApi = {
  async get(endpoint) {
    await delay(200 + Math.random() * 300);
    if (Math.random() < 0.02) throw new Error('Network error. Please retry.');
    return { data: null, endpoint };
  },
  async post(endpoint, data) {
    await delay(400);
    return { success: true, data, endpoint };
  },
  async put(endpoint, data) {
    await delay(350);
    return { success: true, data, endpoint };
  },
  async delete(endpoint) {
    await delay(300);
    return { success: true, endpoint };
  },
};
