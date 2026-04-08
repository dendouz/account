/**
 * API configuration for the mobile app.
 * Change API_HOST to your computer's IP address when testing on a physical device.
 * Use "localhost" only when running in an iOS simulator or Android emulator.
 */
const API_HOST = "192.168.0.239"; // Your PC's local IP
const API_PORT = "3001";

export const API_BASE = `http://${API_HOST}:${API_PORT}/api`;
