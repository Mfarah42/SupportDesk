import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTicket, reset } from "../features/tickets/ticketSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { BackButton } from "../components/BackButton";

function NewTicket() {
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.tickets
  );

  const [name] = useState(user.name);
  const [email] = useState(user.email);
  const [product, setProduct] = useState("iPhone");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      dispatch(reset());
      navigate("/tickets");
    }

    dispatch(reset());
  }, [isError, isSuccess, message, user, navigate, dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(product, description);
    const ticketData = {
      product,
      description,
    };
    dispatch(createTicket(ticketData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <BackButton url="/" />
      <section className="heading">
        <h1> Create New Ticket</h1>
        <p> Fill out the form below</p>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="name">Customers Name</label>
          <input type="text" className="form-control" value={name} disabled />
        </div>
        <div className="form-group">
          <label htmlFor="email">Customers Email</label>
          <input type="text" className="form-control" value={email} disabled />
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="product">Product</label>
            <select
              name="product"
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            >
              <option value="iPhone 11">iPhone 11</option>
              <option value="iPhone 11 Pro">iPhone 11 Pro</option>
              <option value="iPhone 12">iPhone 12</option>
              <option value="iPhone 12 Pro">iPhone 12 Pro</option>
              <option value="iPhone SE">iPhone SE</option>
              <option value="iPhone 13">iPhone 13</option>
              <option value="iPhone 13 Pro">iPhone 13 Pro</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label html="description">Description of the issue</label>
            <textarea
              name="description"
              id="description"
              className="form-control"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <button className="btn btn-block btn-green-reverse">Submit</button>
          </div>
        </form>
      </section>
    </>
  );
}
export default NewTicket;
