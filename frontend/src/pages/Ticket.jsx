import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { getTicket, reset, closeTicket } from "../features/tickets/ticketSlice";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { BackButton } from "../components/BackButton";

function Ticket() {
  const { ticket, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.tickets
  );
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ticketid } = useParams();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getTicket(ticketid));
    // eslint-disable-next-line
  }, [isError, dispatch, message, ticketid]);

  // Close Ticket
  const onTicketClose = () => {
    dispatch(closeTicket(ticketid));
    toast.success("Ticket Successfully Closed");
    navigate("/tickets");
  };
  // if (isLoading) {
  //   return <Spinner />;
  // }
  // if (isError) {
  //   return <h3>Something Went Wrong</h3>;
  // }

  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/tickets" />
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>
        </h2>
        <h3>
          Date Submitted: {new Date(ticket.createdAt).toLocaleString("en-us")}
        </h3>
        <h3>Product: {ticket.product}</h3>
        <hr />
        <div className="ticket-desc">
          <h3> Description of the issue</h3>
          <p>{ticket.description}</p>
        </div>
      </header>
      {ticket.status !== "closed" && (
        <button onClick={onTicketClose} className="btn btn-block btn-danger">
          Close Ticket
        </button>
      )}
    </div>
  );
}

export default Ticket;
