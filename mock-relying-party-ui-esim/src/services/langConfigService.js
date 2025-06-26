import axios from "axios";

const defaultConfigEndpoint = "/locales/default.json";

/**
 * Fetch and return the locale configuration stored in the public folder
 * @returns {Promise<Object>} JSON object containing language configurations
 */
const getLocaleConfiguration = async () => {
  const endpoint = process.env.PUBLIC_URL + defaultConfigEndpoint;

  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error loading language configuration:", error);
    return { languages: [] }; // fallback
  }
};

const langConfigService = {
  getLocaleConfiguration,
};

export default langConfigService;
