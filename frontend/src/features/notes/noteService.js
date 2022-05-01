import axios from "axios";

const API_URL = "/api/tickets/";

// Get user Notes
const getNotes = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + ticketId + "/notes", config);

  return response.data;
};

// create ticket note
const createNote = async (noteTicket, ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    API_URL + ticketId + "/notes",
    {
      text: noteTicket,
    },
    config
  );

  return response.data;
};

const noteService = {
  getNotes,
  createNote,
};

export default noteService;
