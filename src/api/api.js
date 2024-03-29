import axios from "axios";

const baseURL = "https://www.themealdb.com/api/json/v1/1";

const headers = {
  "Content-Type": "application/json",
};

const mockApi = "https://659d12bb633f9aee7908887d.mockapi.io/api/project5";

const api = axios.create({ baseURL, headers });
const myRecipeApi = axios.create({ baseURL: mockApi, headers });

export { api, myRecipeApi };
