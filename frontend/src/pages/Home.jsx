import { FaQuestionCircle, FaTicketAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
function Home() {
  return (
    <>
      <section className="heading">
        <h1>Welcome To Mo-Support Team</h1>
        <h3>What Can We Help You With?</h3>
        <p>Please choose from an option below</p>
      </section>

      <Link to="/new-ticket" className="btn btn-reverse btn-block">
        <FaQuestionCircle /> Create New Ticket
      </Link>

      <Link to="/tickets" className="btn btn-block">
        <FaTicketAlt /> View My Tickets
      </Link>
    </>
  );
}

export default Home;
