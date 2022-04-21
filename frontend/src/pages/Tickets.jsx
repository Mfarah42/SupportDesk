import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTickets, reset } from "../features/tickets/ticketSlice";
import { BackButton } from "../components/BackButton";
import Spinner from "../components/Spinner";

const Tickets = () => {
  // const { user } = useSelector((state) => state.auth);
  const { tickets, isLoading, isError, isSuccess, messages } = useSelector(
    (state) => state.tickets
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // unmount
    return () => {
      if (isSuccess) {
        dispatch(reset());
      }
    };
  }, [dispatch, isSuccess]);

  useEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  if (isLoading) {
    console.log(true);
  }

  return (
    <>
      <h1>Tickets</h1>
    </>
  );
};

export default Tickets;
